import type { Slot as PrismaSlot } from "@prisma/client";
import { prisma } from "@/lib/db";

export type Slot = {
  id: string;
  start: string;
  end: string;
};

function toApiSlot(row: PrismaSlot): Slot {
  return {
    id: row.id,
    start: row.start.toISOString(),
    end: row.end.toISOString(),
  };
}

export async function getAvailableSlots(now: Date = new Date()): Promise<Slot[]> {
  const rows = await prisma.slot.findMany({
    where: {
      start: { gte: now },
      booking: null,
    },
    orderBy: { start: "asc" },
  });
  return rows.map(toApiSlot);
}

export type BookError = "NOT_FOUND" | "ALREADY_BOOKED" | "PAST_SLOT";

export type BookResult =
  | { ok: true; slot: Slot; guestName: string }
  | { ok: false; error: BookError };

export async function bookSlot(
  id: string,
  guestName: string,
  now: Date = new Date(),
): Promise<BookResult> {
  return prisma.$transaction(async (tx) => {
    const slot = await tx.slot.findUnique({
      where: { id },
      include: { booking: true },
    });

    if (!slot) {
      return { ok: false, error: "NOT_FOUND" };
    }
    if (slot.start.getTime() < now.getTime()) {
      return { ok: false, error: "PAST_SLOT" };
    }
    if (slot.booking) {
      return { ok: false, error: "ALREADY_BOOKED" };
    }

    await tx.booking.create({
      data: {
        slotId: slot.id,
        guestName: guestName.trim(),
      },
    });

    return {
      ok: true,
      slot: toApiSlot(slot),
      guestName: guestName.trim(),
    };
  });
}

/** Kun til tests: nulstil ikke længere in-memory; behold for bagudkompatibilitet som no-op. */
export function resetStoreForTests(): void {
  /* in-memory fjernet — brug mocked Prisma i tests */
}
