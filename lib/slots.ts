export type Slot = {
  id: string;
  start: string;
  end: string;
};

type Store = {
  slots: Slot[];
  booked: Set<string>;
};

function createInitialStore(): Store {
  const slots: Slot[] = [];
  const base = new Date();
  base.setHours(9, 0, 0, 0);
  base.setMinutes(0, 0, 0);

  for (let i = 0; i < 6; i++) {
    const start = new Date(base);
    start.setDate(start.getDate() + Math.floor(i / 3));
    start.setHours(9 + (i % 3) * 2, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    slots.push({
      id: `slot-${i + 1}`,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  }

  return { slots, booked: new Set() };
}

let store: Store = createInitialStore();

export function resetStoreForTests(): void {
  store = createInitialStore();
}

export function getAvailableSlots(now: Date = new Date()): Slot[] {
  return store.slots.filter(
    (s) =>
      !store.booked.has(s.id) && new Date(s.start).getTime() >= now.getTime(),
  );
}

export type BookError = "NOT_FOUND" | "ALREADY_BOOKED" | "PAST_SLOT";

export type BookResult =
  | { ok: true; slot: Slot }
  | { ok: false; error: BookError };

export function bookSlot(id: string, now: Date = new Date()): BookResult {
  const slot = store.slots.find((s) => s.id === id);
  if (!slot) {
    return { ok: false, error: "NOT_FOUND" };
  }
  if (new Date(slot.start).getTime() < now.getTime()) {
    return { ok: false, error: "PAST_SLOT" };
  }
  if (store.booked.has(id)) {
    return { ok: false, error: "ALREADY_BOOKED" };
  }
  store.booked.add(id);
  return { ok: true, slot };
}
