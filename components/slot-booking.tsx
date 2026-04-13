"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CalendarDays, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Slot = {
  id: string;
  start: string;
  end: string;
};

function formatRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const d = new Intl.DateTimeFormat("da-DK", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(start);
  const t = new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(end);
  return `${d} – ${t}`;
}

function dayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cmp = new Date(d);
  cmp.setHours(0, 0, 0, 0);
  const diff = (cmp.getTime() - today.getTime()) / (86400 * 1000);
  if (diff === 0) return "I dag";
  if (diff === 1) return "I morgen";
  return new Intl.DateTimeFormat("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(d);
}

function groupByDay(slots: Slot[]): { key: string; label: string; slots: Slot[] }[] {
  const map = new Map<string, Slot[]>();
  for (const s of slots) {
    const k = dayKey(s.start);
    const list = map.get(k) ?? [];
    list.push(s);
    map.set(k, list);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, list]) => ({
      key,
      label: dayLabel(list[0]!.start),
      slots: list.sort(
        (x, y) => new Date(x.start).getTime() - new Date(y.start).getTime(),
      ),
    }));
}

export function SlotBooking() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");

  const days = useMemo(() => groupByDay(slots), [slots]);
  const [activeDay, setActiveDay] = useState<string>("");

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

  useEffect(() => {
    if (days.length && !activeDay) {
      setActiveDay(days[0]!.key);
    }
  }, [days, activeDay]);

  async function book(slotId: string) {
    const name = guestName.trim();
    if (!name) {
      toast.error("Skriv dit navn før du booker.");
      return;
    }
    setError(null);
    setBookingId(slotId);
    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slotId, guestName: name }),
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
      const data = (await res.json()) as { guestName: string };
      toast.success(`Booket for ${data.guestName}`, {
        description: "Vi har gemt din booking.",
      });
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Ukendt fejl";
      setError(msg);
      toast.error(msg);
    } finally {
      setBookingId(null);
    }
  }

  const firstId = slots[0]?.id;

  return (
    <div className="w-full max-w-2xl space-y-8">
      <Card className="border-border/80 shadow-md shadow-primary/5">
        <CardHeader className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Sparkles className="size-5 text-primary" aria-hidden />
            Dine oplysninger
          </CardTitle>
          <CardDescription>
            Navnet bruges kun til at vise en bekræftelse — demo uden login.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="guest">Navn</Label>
          <Input
            id="guest"
            name="guestName"
            autoComplete="name"
            placeholder="Fx Ada Lovelace"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <CalendarDays className="size-5 text-muted-foreground" aria-hidden />
          Ledige tider
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vælg dag og tid. Bookede tider forsvinder fra listen.
        </p>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground" role="status">
          Henter tider…
        </p>
      )}

      {!loading && slots.length === 0 && (
        <Card className="border-dashed bg-muted/30">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Ingen ledige tider lige nu.
          </CardContent>
        </Card>
      )}

      {error && (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}

      {!loading && days.length > 0 && (
        <Tabs
          value={activeDay || days[0]!.key}
          onValueChange={setActiveDay}
          className="w-full"
        >
          <TabsList className="mb-4 h-auto w-full flex-wrap justify-start gap-1 bg-muted/50 p-1">
            {days.map((d) => (
              <TabsTrigger
                key={d.key}
                value={d.key}
                className="rounded-md px-3 py-1.5 text-sm data-[state=active]:shadow-sm"
              >
                {d.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {days.map((d) => (
            <TabsContent key={d.key} value={d.key} className="mt-0">
              <ul className="flex flex-col gap-3">
                <AnimatePresence initial={false} mode="popLayout">
                  {d.slots.map((slot, index) => (
                    <motion.li
                      key={slot.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        delay: index * 0.04,
                      }}
                    >
                      <Card
                        className={cn(
                          "overflow-hidden transition-shadow",
                          firstId === slot.id &&
                            "ring-2 ring-primary/20 ring-offset-2 ring-offset-background",
                        )}
                      >
                        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-start gap-3">
                            <Clock
                              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                              aria-hidden
                            />
                            <div>
                              <p className="font-medium leading-tight">
                                {formatRange(slot.start, slot.end)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                30 min · QuickSlot demo
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            disabled={bookingId !== null}
                            onClick={() => void book(slot.id)}
                            className="shrink-0"
                          >
                            {bookingId === slot.id ? "Booker…" : "Book"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
