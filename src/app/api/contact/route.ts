import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, sanitizeLong, isValidEmail } from "@/lib/sanitize";

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

    // TODO: insert into DB using process.env.DATABASE_URL
    // Example: await db.from("contact_submissions").insert(payload);
    console.log("[contact]", JSON.stringify(payload, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
