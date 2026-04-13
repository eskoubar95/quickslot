import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  bookSlot,
  getAvailableSlots,
  resetStoreForTests,
} from "./slots";

describe("slots store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2030-06-01T10:00:00.000Z"));
    resetStoreForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("lists only available future slots", () => {
    const slots = getAvailableSlots();
    expect(slots.length).toBeGreaterThan(0);
    const first = slots[0];
    expect(first).toBeDefined();
    expect(new Date(first!.start).getTime()).toBeGreaterThanOrEqual(
      Date.now(),
    );
  });

  it("books a slot and removes it from available", () => {
    const id = getAvailableSlots()[0]!.id;
    const result = bookSlot(id);
    expect(result.ok).toBe(true);
    expect(getAvailableSlots().find((s) => s.id === id)).toBeUndefined();
  });

  it("returns NOT_FOUND for unknown id", () => {
    const result = bookSlot("unknown-id");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("NOT_FOUND");
  });

  it("returns ALREADY_BOOKED on double book", () => {
    const id = getAvailableSlots()[0]!.id;
    expect(bookSlot(id).ok).toBe(true);
    const second = bookSlot(id);
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error).toBe("ALREADY_BOOKED");
  });

  it("returns PAST_SLOT when slot start is before the reference time", () => {
    const id = getAvailableSlots()[0]!.id;
    const result = bookSlot(id, new Date("2035-01-01T00:00:00.000Z"));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("PAST_SLOT");
  });
});
