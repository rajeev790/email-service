import { EmailRequest } from "../models/EmailRequest";
import { EmailStatus, StatusTracking } from "../models/EmailStatus";
import { MockEmailProviderA } from "./MockEmailProviderA";
import { MockEmailProviderB } from "./MockEmailProviderB";
import { RetryStrategy } from "./RetryStrategy";
import { RateLimiter } from "./RateLimiter";
import { CircuitBreaker } from "./CircuitBreaker";
import { IdempotencyKeyGenerator } from "../utils/IdempotencyKeyGenerator";
import { Logger } from "../utils/Logger";
import { Queue } from "../utils/Queue";

export class EmailService {
    private providerA: MockEmailProviderA;
    private providerB: MockEmailProviderB;
    private retryStrategy: RetryStrategy;
    private rateLimiter: RateLimiter;
    private circuitBreaker: CircuitBreaker;
    private statusTracking: Map<string, StatusTracking>;

    constructor() {
        this.providerA = new MockEmailProviderA();
        this.providerB = new MockEmailProviderB();
        this.retryStrategy = new RetryStrategy();
        this.rateLimiter = new RateLimiter();
        this.circuitBreaker = new CircuitBreaker();
        this.statusTracking = new Map<string, StatusTracking>();
    }

    public async sendEmail(request: EmailRequest): Promise<void> {
        const idempotencyKey = request.idempotencyKey || IdempotencyKeyGenerator.generate(request);

        if (this.statusTracking.has(idempotencyKey)) {
            Logger.log("Duplicate email request. Skipping...");
            return;
        }

        this.statusTracking.set(idempotencyKey, {
            idempotencyKey,
            status: EmailStatus.PENDING,
            provider: '',
            attempts: 0,
        });

        const queue = new Queue();
        queue.enqueue(() => this.processEmail(request, this.providerA, idempotencyKey));
        queue.enqueue(() => this.processEmail(request, this.providerB, idempotencyKey));

        await queue.execute();
    }

    private async processEmail(request: EmailRequest, provider: any, idempotencyKey: string) {
        const status = this.statusTracking.get(idempotencyKey)!;
        const sendWithRetry = async () => {
            if (this.circuitBreaker.isOpen()) {
                Logger.log("Circuit breaker is open. Skipping provider.");
                throw new Error("Circuit breaker is open.");
            }

            await this.rateLimiter.limit();

            try {
                status.attempts++;
                await provider.send(request);
                status.status = EmailStatus.SENT;
                status.provider = provider.constructor.name;
                Logger.log(Email sent successfully using ${status.provider});
            } catch (error) {
                Logger.log(Failed to send email using ${provider.constructor.name}: ${error.message});
                this.circuitBreaker.recordFailure();
                throw error;
            }
        };

        try {
            await this.retryStrategy.execute(sendWithRetry);
        } catch (error) {
            status.status = EmailStatus.FAILED;
            Logger.log("All retries exhausted. Email sending failed.");
        } finally {
            this.statusTracking.set(idempotencyKey, status);
        }
    }

    public getStatus(idempotencyKey: string): StatusTracking | undefined {
        return this.statusTracking.get(idempotencyKey);
    }
}