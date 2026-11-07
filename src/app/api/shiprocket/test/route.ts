import { NextResponse } from "next/server";
import { getShiprocketToken } from "@/lib/shiprocket";

export const dynamic = "force-dynamic";

export async function GET() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION || "Surat_Atelier";

  // Step 1: Check environment variables
  if (!email || !password) {
    return NextResponse.json(
      {
        status: "CONFIG_MISSING",
        message: "Shiprocket API credentials are not set in environment variables.",
        details: {
          hasEmail: Boolean(email),
          hasPassword: Boolean(password),
          pickupLocation: pickupLocation,
        },
        action:
          "Please set SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, and SHIPROCKET_PICKUP_LOCATION in your Vercel Environment Variables.",
      },
      { status: 400 }
    );
  }

  // Step 2: Attempt authentication
  try {
    const authRes = await fetch("https://apiv2.shiprocket.in/v2/ks/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok || !authData.token) {
      return NextResponse.json(
        {
          status: "AUTH_FAILED",
          message: "Shiprocket API login rejected these credentials.",
          error: authData.message || authData.errors || "Invalid email or password",
          suggestion:
            "Verify the email and password you created under Shiprocket Settings -> API -> API Users.",
        },
        { status: 401 }
      );
    }

    const token = authData.token;

    // Step 3: Verify pickup locations
    let registeredPickups: string[] = [];
    let pickupLocationFound = false;

    try {
      const pickupRes = await fetch("https://apiv2.shiprocket.in/v2/ks/settings/company/pickup", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (pickupRes.ok) {
        const pickupData = await pickupRes.json();
        const locations = pickupData?.data?.shipping_address || [];
        registeredPickups = locations.map((loc: any) => loc.pickup_location);
        pickupLocationFound = registeredPickups.some(
          (loc) => loc.toLowerCase() === pickupLocation.toLowerCase()
        );
      }
    } catch (e) {
      console.warn("Could not fetch pickup locations:", e);
    }

    // Step 4: Verify wallet balance
    let walletBalance = null;
    try {
      const walletRes = await fetch(
        "https://apiv2.shiprocket.in/v2/ks/account/details/wallet-balance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (walletRes.ok) {
        const walletData = await walletRes.json();
        walletBalance = walletData?.data?.balance ?? null;
      }
    } catch (e) {
      console.warn("Could not fetch wallet balance:", e);
    }

    return NextResponse.json({
      status: "CONNECTED",
      success: true,
      message: "Shiprocket API connection is working perfectly!",
      details: {
        accountEmail: email,
        tokenReceived: true,
        tokenPreview: `${token.slice(0, 10)}...${token.slice(-6)}`,
        configuredPickupLocation: pickupLocation,
        pickupLocationFoundInAccount: pickupLocationFound,
        registeredPickupLocations: registeredPickups,
        walletBalance: walletBalance !== null ? `₹${walletBalance}` : "Available in Shiprocket panel",
      },
      nextStep: pickupLocationFound
        ? "Your integration is 100% ready. Any order placed will generate a live shipment automatically!"
        : `Your configured pickup location "${pickupLocation}" was not found in Shiprocket. Please create it under Settings -> Manage Pickup Address or match the exact nickname.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "NETWORK_ERROR",
        message: "Failed to communicate with Shiprocket API servers.",
        error: err?.message,
      },
      { status: 500 }
    );
  }
}
