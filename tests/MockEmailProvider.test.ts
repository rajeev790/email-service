import { MockEmailProviderA } from "../src/services/MockEmailProviderA";
import { MockEmailProviderB } from "../src/services/MockEmailProviderB";
import { EmailRequest } from "../src/models/EmailRequest";

describe("MockEmailProvider", () => {
    let providerA: MockEmailProviderA;
    let providerB: MockEmailProviderB;
    let request: EmailRequest;

    beforeEach(() => {
        providerA = new MockEmailProviderA();
        providerB = new MockEmailProviderB();
        request = {
            to: "test@example.com",
            subject: "Test Subject",
            body: "Test Body",
            idempotencyKey: "",
        };
    });

    it("should successfully send email with Provider A", async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.1); // Force success

        await expect(providerA.send(request)).resolves.toBeUndefined();
    });

    it("should fail to send email with Provider B", async () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.9); // Force failure

        await expect(providerB.send(request)).rejects.toThrow("Provider B failed");
    });
});