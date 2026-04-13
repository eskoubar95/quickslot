"use client";

import { useCallback, useEffect, useState } from "react";

type Slot = {
  id: string;
  start: string;
  end: string;
};

function formatRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  return new Intl.DateTimeFormat("da-DK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(start) + " – " + new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(end);
}

export function SlotBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/slots");
      if (!res.ok) {
        throw new Error("Kunne ikke hente tider");
      }
      const data = (await res.json()) as { slots: Slot[] };
      setSlots(data.slots);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukendt fejl");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function book(slotId: string) {
    setError(null);
    setBookingId(slotId);
    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(
          body.error === "ALREADY_BOOKED"
            ? "Tiden er allerede booket"
            : body.error === "NOT_FOUND"
              ? "Tiden findes ikke"
              : body.error === "PAST_SLOT"
                ? "Kan ikke booke en tid i fortiden"
                : "Booking mislykkedes",
        );
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukendt fejl");
    } finally {
      setBookingId(null);
    }
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Ledige tider
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Vælg et tidsrum. Bookede tider forsvinder fra listen.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-zinc-500" role="status">
          Henter tider…
        </p>
      )}

      {!loading && slots.length === 0 && (
        <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Ingen ledige tider lige nu.
        </p>
      )}

      {error && (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}

      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {slots.map((slot) => (
          <li
            key={slot.id}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <span className="text-sm text-zinc-800 dark:text-zinc-200">
              {formatRange(slot.start, slot.end)}
            </span>
            <button
              type="button"
              disabled={bookingId !== null}
              onClick={() => void book(slot.id)}
              className="shrink-0 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {bookingId === slot.id ? "Booker…" : "Book"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
