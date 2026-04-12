import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, isValidEmail } from "@/lib/sanitize";
import { sql } from "@/lib/db";

// All newsletter and notify-me forms funnel here — differentiated by source.
const VALID_SOURCES = [
  "newsletter-float",
  "footer-newsletter",
  "about-newsletter",
  "insights-newsletter",
  "notify-teardowns",
  "notify-blog",
  "notify-case-studies",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = sanitizeEmail(body.email ?? "");
    const source = sanitizeText(body.source ?? "");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!source || !VALID_SOURCES.includes(source)) {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }

    const payload = { email, source };

    await sql`
      INSERT INTO newsletter_subscribers (email, source)
      VALUES (${payload.email}, ${payload.source})
      ON CONFLICT (email) DO UPDATE SET source = EXCLUDED.source, updated_at = now()
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
