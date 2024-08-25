import { EmailRequest } from "../models/EmailRequest";
import crypto from "crypto";

export class IdempotencyKeyGenerator {
    public static generate(request: EmailRequest): string {
        return crypto.createHash('sha256').update(JSON.stringify(request)).digest('hex');
    }
}