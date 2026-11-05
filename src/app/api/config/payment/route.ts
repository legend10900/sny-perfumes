import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const upiId =
    process.env.UPI_ID ||
    process.env.NEXT_PUBLIC_UPI_ID ||
    "snyperfumes@okhdfcbank";

  const businessName =
    process.env.UPI_BUSINESS_NAME ||
    process.env.NEXT_PUBLIC_UPI_NAME ||
    "SNY Perfumes";

  return NextResponse.json({
    upiId,
    businessName,
  });
}
