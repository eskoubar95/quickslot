import { NextResponse } from "next/server";
import { z } from "zod";
import { bookSlot, getAvailableSlots } from "@/lib/slots";

export async function GET() {
  const slots = getAvailableSlots();
  return NextResponse.json({ slots });
}

const bodySchema = z.object({
  slotId: z.string().min(1),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = bookSlot(parsed.data.slotId);
  if (!result.ok) {
    const status =
      result.error === "NOT_FOUND"
        ? 404
        : result.error === "ALREADY_BOOKED"
          ? 409
          : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ slot: result.slot });
}
