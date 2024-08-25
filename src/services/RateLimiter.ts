export class RateLimiter {
  private maxRequests: number;
  private interval: number;
  private requests: number;
  private queue: (() => void)[];

  constructor(maxRequests: number = 5, interval: number = 1000) {
      this.maxRequests = maxRequests;
      this.interval = interval;
      this.requests = 0;
      this.queue = [];

      setInterval(() => this.processQueue(), this.interval);
  }

  public async limit(): Promise<void> {
      if (this.requests >= this.maxRequests) {
          await new Promise<void>(resolve => this.queue.push(resolve));
      } else {
          this.requests++;
      }
  }

  private processQueue(): void {
      this.requests = 0;
      while (this.queue.length > 0 && this.requests < this.maxRequests) {
          const resolve = this.queue.shift();
          this.requests++;
          resolve!();
      }
  }
}