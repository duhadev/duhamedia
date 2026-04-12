import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, isValidEmail } from "@/lib/sanitize";
import { sql } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const storeUrl = sanitizeText(body.storeUrl ?? "");
    const name = sanitizeText(body.name ?? "");
    const email = sanitizeEmail(body.email ?? "");
    const phone = sanitizeText(body.phone ?? "");

    if (!storeUrl || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const payload = { storeUrl, name, email, phone: phone || null };

    await sql`
      INSERT INTO audit_requests (store_url, name, email, phone)
      VALUES (${payload.storeUrl}, ${payload.name}, ${payload.email}, ${payload.phone})
    `;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
