import { EmailService } from "./services/EmailService";
import { EmailRequest } from "./models/EmailRequest";

const emailService = new EmailService();

const emailRequest: EmailRequest = {
    to: "user@example.com",
    subject: "Welcome!",
    body: "Thank you for signing up.",
    idempotencyKey: "", // Auto-generated if not provided
};

emailService.sendEmail(emailRequest).then(() => {
    console.log("Email processed successfully.");
}).catch(error => {
    console.error("Error processing email:", error);
});