import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string; locale?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const locale = body.locale ?? "en";

    if (!email || !isEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 },
      );
    }

    const existing = await db.newsletter.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }

    await db.newsletter.create({ data: { email, locale } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 },
    );
  }
}
