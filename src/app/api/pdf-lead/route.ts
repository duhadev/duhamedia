import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, isValidEmail } from "@/lib/sanitize";
import { sql } from "@/lib/db";
import { sendPdfLeadNotification } from "@/lib/email";

const VALID_TIERS = ["Class A", "Class B", "Class C"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = sanitizeEmail(body.email ?? "");
    const url = sanitizeText(body.url ?? "");
    const tier = sanitizeText(body.tier ?? "");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (tier && !VALID_TIERS.includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const payload = { email, url: url || null, tier: tier || null };

    await sql`
      INSERT INTO pdf_leads (email, url, tier)
      VALUES (${payload.email}, ${payload.url}, ${payload.tier})
    `;

    sendPdfLeadNotification(payload).catch(console.error);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
