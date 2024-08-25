import { CircuitBreaker } from "../src/services/CircuitBreaker";

describe("CircuitBreaker", () => {
    let circuitBreaker: CircuitBreaker;

    beforeEach(() => {
        circuitBreaker = new CircuitBreaker(2, 1000);
    });

    it("should stay closed on success", () => {
        expect(circuitBreaker.isOpen()).toBe(false);
    });

    it("should open on repeated failures", () => {
        circuitBreaker.recordFailure();
        circuitBreaker.recordFailure();

        expect(circuitBreaker.isOpen()).toBe(true);
    });

    it("should reset after timeout", async () => {
        circuitBreaker.recordFailure();
        circuitBreaker.recordFailure();

        expect(circuitBreaker.isOpen()).toBe(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        expect(circuitBreaker.isOpen()).toBe(false);
    });
});