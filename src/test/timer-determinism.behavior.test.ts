import { afterEach, describe, expect, it, vi } from "vitest";
import { createDeferredFlag } from "./timerUtils";

describe("timer-sensitive deterministic behavior", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("produces deterministic outcomes across repeated runs with fake timers", () => {
    const outcomes: boolean[] = [];

    for (let i = 0; i < 3; i += 1) {
      vi.useFakeTimers();
      const deferred = createDeferredFlag(200);

      expect(deferred.isDone()).toBe(false);
      vi.advanceTimersByTime(199);
      expect(deferred.isDone()).toBe(false);
      vi.advanceTimersByTime(1);

      outcomes.push(deferred.isDone());
      vi.useRealTimers();
    }

    expect(outcomes).toEqual([true, true, true]);
  });
});
