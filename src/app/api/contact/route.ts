import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, sanitizeLong, isValidEmail } from "@/lib/sanitize";
import { sql } from "@/lib/db";

const VALID_REASONS = [
  "Book a discovery call",
  "Free audit — show me where my site is leaking",
  "Ask about a specific service tier",
  "Other",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = sanitizeText(body.name ?? "");
    const email = sanitizeEmail(body.email ?? "");
    const website = sanitizeText(body.website ?? "");
    const reason = sanitizeText(body.reason ?? "");
    const message = sanitizeLong(body.message ?? "");

    if (!name || !email || !website) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (reason && !VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
    }

    const payload = {
      name,
      email,
      website,
      reason: reason || null,
      message: message || null,
    };

    await sql`
      INSERT INTO contact_submissions (name, email, website, reason, message)
      VALUES (${payload.name}, ${payload.email}, ${payload.website}, ${payload.reason}, ${payload.message})
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
