import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, isValidEmail } from "@/lib/sanitize";

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

    // TODO: insert into DB using process.env.DATABASE_URL
    // Example: await db.from("pdf_leads").insert(payload);
    console.log("[pdf-lead]", JSON.stringify(payload, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
