import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { BookingPayload } from "@/lib/types";

function makeReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "WL-";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<BookingPayload>;

    const fullName = (body.fullName ?? "").trim();
    const email = (body.email ?? "").trim();
    const phone = (body.phone ?? "").trim();
    const packageTitle = (body.packageTitle ?? "").trim() || "Custom Trip";
    const destination = (body.destination ?? "").trim();
    const travelDate = (body.travelDate ?? "").trim();
    const travelers = Number(body.travelers ?? 0);
    const notes = (body.notes ?? "").trim();
    const totalPrice = Number(body.totalPrice ?? 0);
    const locale = body.locale ?? "en";

    // Required: identity + date + travelers. Destination/price optional for custom trips.
    if (!fullName || !email || !phone || !travelDate || !travelers) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 },
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 },
      );
    }

    let reference = makeReference();
    // ensure uniqueness
    let attempt = 0;
    while (attempt < 5) {
      const exists = await db.booking.findUnique({ where: { reference } });
      if (!exists) break;
      reference = makeReference();
      attempt++;
    }

    const booking = await db.booking.create({
      data: {
        reference,
        fullName,
        email,
        phone,
        packageTitle,
        destination,
        travelDate,
        travelers,
        notes: notes || null,
        totalPrice,
        locale,
        status: "confirmed",
      },
    });

    return NextResponse.json({ ok: true, reference: booking.reference });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({ ok: true, bookings });
}
