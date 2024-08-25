export class CircuitBreaker {
  private failureThreshold: number;
  private recoveryTimeout: number;
  private failureCount: number;
  private lastFailureTime: number | null;

  constructor(failureThreshold: number = 3, recoveryTimeout: number = 10000) {
      this.failureThreshold = failureThreshold;
      this.recoveryTimeout = recoveryTimeout;
      this.failureCount = 0;
      this.lastFailureTime = null;
  }

  public isOpen(): boolean {
      if (this.failureCount >= this.failureThreshold) {
          if (Date.now() - (this.lastFailureTime ?? 0) > this.recoveryTimeout) {
              this.reset();
              return false;
          }
          return true;
      }
      return false;
  }

  public recordFailure(): void {
      this.failureCount++;
      this.lastFailureTime = Date.now();
  }

  private reset(): void {
      this.failureCount = 0;
      this.lastFailureTime = null;
  }
}