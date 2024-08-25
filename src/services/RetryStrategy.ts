export class RetryStrategy {
  private maxRetries: number;
  private baseDelay: number;

  constructor(maxRetries: number = 3, baseDelay: number = 1000) {
      this.maxRetries = maxRetries;
      this.baseDelay = baseDelay;
  }

  public async execute(fn: () => Promise<void>): Promise<void> {
      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
          try {
              await fn();
              return;
          } catch (error) {
              if (attempt < this.maxRetries - 1) {
                  await this.delay(attempt + 1);
              } else {
                  throw error;
              }
          }
      }
  }

  private delay(attempt: number): Promise<void> {
      const delayTime = this.baseDelay * Math.pow(2, attempt);
      return new Promise(resolve => setTimeout(resolve, delayTime));
  }
}