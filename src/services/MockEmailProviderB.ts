import { EmailRequest } from "../models/EmailRequest";

export class MockEmailProviderB {
    public async send(request: EmailRequest): Promise<void> {
        // Simulate success or failure
        if (Math.random() < 0.5) {
            throw new Error("Provider B failed");
        }
        return Promise.resolve();
    }
}