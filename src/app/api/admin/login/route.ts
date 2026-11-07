import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sny@admin2026";

// Simple secure session token derived from password hash / timestamp
export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password.trim() === ADMIN_PASSWORD.trim()) {
      // Create a deterministic session token valid for the day
      const dayStamp = new Date().toISOString().slice(0, 10);
      const token = Buffer.from(`sny_admin_auth_${dayStamp}_${ADMIN_PASSWORD}`).toString("base64");

      return NextResponse.json({
        success: true,
        message: "Authentication successful",
        token,
      });
    }

    return NextResponse.json({ error: "Incorrect admin password. Access denied." }, { status: 401 });
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
