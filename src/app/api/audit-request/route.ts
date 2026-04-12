import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, isValidEmail } from "@/lib/sanitize";

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

    // TODO: insert into DB using process.env.DATABASE_URL
    // Example: await db.from("audit_requests").insert(payload);
    console.log("[audit-request]", JSON.stringify(payload, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
