export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  idempotencyKey: string;
}