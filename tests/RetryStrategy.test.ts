import { RetryStrategy } from "../src/services/RetryStrategy";

describe("RetryStrategy", () => {
    let retryStrategy: RetryStrategy;

    beforeEach(() => {
        retryStrategy = new RetryStrategy();
    });

    it("should succeed on the first attempt", async () => {
        const mockFunction = jest.fn().mockResolvedValueOnce(undefined);

        await retryStrategy.execute(mockFunction);

        expect(mockFunction).toHaveBeenCalledTimes(1);
    });

    it("should retry on failure and eventually succeed", async () => {
        const mockFunction = jest.fn()
            .mockRejectedValueOnce(new Error("Failed"))
            .mockResolvedValueOnce(undefined);

        await retryStrategy.execute(mockFunction);

        expect(mockFunction).toHaveBeenCalledTimes(2);
    });

    it("should exhaust retries and fail", async () => {
        const mockFunction = jest.fn().mockRejectedValue(new Error("Failed"));

        await expect(retryStrategy.execute(mockFunction)).rejects.toThrow("Failed");
        expect(mockFunction).toHaveBeenCalledTimes(3);
    });
});