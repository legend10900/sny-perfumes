import { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sny@admin2026";

export function isAuthorizedAdmin(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const dayStamp = new Date().toISOString().slice(0, 10);
    const expected = `sny_admin_auth_${dayStamp}_${ADMIN_PASSWORD}`;
    return decoded === expected;
  } catch {
    return false;
  }
}
