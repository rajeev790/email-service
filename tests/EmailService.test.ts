import { EmailService } from "../src/services/EmailService";
import { EmailRequest } from "../src/models/EmailRequest";
import { EmailStatus } from "../src/models/EmailStatus";

describe("EmailService", () => {
    let emailService: EmailService;

    beforeEach(() => {
        emailService = new EmailService();
    });

    it("should send email successfully using a provider", async () => {
        const request: EmailRequest = {
            to: "test@example.com",
            subject: "Test",
            body: "Test body",
            idempotencyKey: "",
        };

        await emailService.sendEmail(request);

        const status = emailService.getStatus(request.idempotencyKey);
        expect(status).toBeDefined();
        expect(status!.status).toBe(EmailStatus.SENT);
    });

    it("should retry and eventually fail after max retries", async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.9); // Force providers to fail

        const request: EmailRequest = {
            to: "test@example.com",
            subject: "Test",
            body: "Test body",
            idempotencyKey: "",
        };

        await emailService.sendEmail(request);

        const status = emailService.getStatus(request.idempotencyKey);
        expect(status).toBeDefined();
        expect(status!.status).toBe(EmailStatus.FAILED);
        expect(status!.attempts).toBeGreaterThan(1);
    });
});