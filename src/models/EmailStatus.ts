export enum EmailStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export interface StatusTracking {
  idempotencyKey: string;
  status: EmailStatus;
  provider: string;
  attempts: number;
}