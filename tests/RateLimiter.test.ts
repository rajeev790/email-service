import { RateLimiter } from "../src/services/RateLimiter";

describe("RateLimiter", () => {
    let rateLimiter: RateLimiter;

    beforeEach(() => {
        rateLimiter = new RateLimiter(2, 1000);
    });

    it("should allow requests within the limit", async () => {
        await expect(rateLimiter.limit()).resolves.toBeUndefined();
        await expect(rateLimiter.limit()).resolves.toBeUndefined();
    });

    it("should queue requests that exceed the limit", async () => {
        await expect(rateLimiter.limit()).resolves.toBeUndefined();
        await expect(rateLimiter.limit()).resolves.toBeUndefined();

        const start = Date.now();
        const limitPromise = rateLimiter.limit();

        expect(Date.now() - start).toBeLessThan(1000);

        await limitPromise;

        expect(Date.now() - start).toBeGreaterThanOrEqual(1000);
    });
});