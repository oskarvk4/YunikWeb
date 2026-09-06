import { NextRequest, NextResponse } from "next/server";
import { fetchPickupPoints, ShipmondoError } from "@/lib/shipmondo";
import { DEFAULT_PICKUP_CARRIER, isPickupCarrier } from "@/constants/carriers";

/**
 * Server-side proxy so the Shipmondo credentials never reach the browser.
 */
export async function GET(request: NextRequest) {
  const zipcode = request.nextUrl.searchParams.get("zipcode")?.trim() || "";
  const carrier =
    request.nextUrl.searchParams.get("carrier")?.trim() || DEFAULT_PICKUP_CARRIER;

  if (!/^\d{4}$/.test(zipcode)) {
    return NextResponse.json({ error: "Ugyldigt postnummer." }, { status: 400 });
  }

  if (!isPickupCarrier(carrier)) {
    return NextResponse.json({ error: "Ukendt fragtfører." }, { status: 400 });
  }

  try {
    const points = await fetchPickupPoints({ zipcode, carrierCode: carrier });
    return NextResponse.json({ points });
  } catch (error) {
    if (error instanceof ShipmondoError) {
      console.error("Shipmondo lookup failed:", error.message);
      return NextResponse.json(
        { error: "Kunne ikke hente pakkeshops lige nu." },
        { status: 502 }
      );
    }
    throw error;
  }
}
