import { NextRequest, NextResponse } from "next/server";
import { sanitizeEmail, sanitizeText, sanitizeLong, isValidEmail } from "@/lib/sanitize";

const VALID_REVENUE = ["under-300k", "300k-750k", "750k-2m", "2m-5m", "over-5m"];
const VALID_SESSIONS = ["under-500", "500-2000", "2000-10000", "10000-plus"];
const VALID_ADS = ["facebook-instagram", "google", "multiple", "planning", "none"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const store = sanitizeText(body.store ?? "");
    const revenue = sanitizeText(body.revenue ?? "");
    const sessions = sanitizeText(body.sessions ?? "");
    const ads = sanitizeText(body.ads ?? "");
    const problem = sanitizeLong(body.problem ?? "");
    const other = sanitizeLong(body.other ?? "");
    // email is optional on this form but sanitize if provided
    const email = body.email ? sanitizeEmail(body.email) : undefined;

    if (!store || !revenue || !sessions || !problem) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!VALID_REVENUE.includes(revenue)) {
      return NextResponse.json({ error: "Invalid revenue range" }, { status: 400 });
    }

    if (!VALID_SESSIONS.includes(sessions)) {
      return NextResponse.json({ error: "Invalid sessions range" }, { status: 400 });
    }

    if (ads && !VALID_ADS.includes(ads)) {
      return NextResponse.json({ error: "Invalid ads value" }, { status: 400 });
    }

    if (email && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const payload = {
      store,
      revenue,
      sessions,
      ads: ads || null,
      problem,
      other: other || null,
      ...(email ? { email } : {}),
    };

    // TODO: insert into DB using process.env.DATABASE_URL
    // Example: await db.from("founding_client_applications").insert(payload);
    console.log("[founding-client-apply]", JSON.stringify(payload, null, 2));

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
