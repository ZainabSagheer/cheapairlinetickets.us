import { NextRequest, NextResponse } from "next/server";

const BASE = "https://sky-scrapper.p.rapidapi.com";
const HEADERS = {
  "x-rapidapi-key": process.env.RAPIDAPI_KEY ?? "",
  "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
};

const CABIN_MAP: Record<string, string> = {
  economy: "economy",
  premiumeconomy: "premiumeconomy",
  business: "business",
  firstclass: "first",
  first: "first",
};

async function getAirportEntity(query: string) {
  const url = `${BASE}/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`;
  const res = await fetch(url, {
    headers: HEADERS,
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const ap = data?.data?.[0];
  return ap ? { skyId: ap.skyId as string, entityId: ap.entityId as string } : null;
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const from       = sp.get("from");
  const to         = sp.get("to");
  const date       = sp.get("date");
  const returnDate = sp.get("returnDate");
  const adults     = sp.get("adults") ?? "1";
  const cabin      = sp.get("cabinClass") ?? "economy";

  if (!from || !to || !date) {
    return NextResponse.json({ error: "Missing required params: from, to, date" }, { status: 400 });
  }

  if (!process.env.RAPIDAPI_KEY) {
    return NextResponse.json({ error: "RAPIDAPI_KEY not configured" }, { status: 500 });
  }

  try {
    const [originAp, destAp] = await Promise.all([
      getAirportEntity(from),
      getAirportEntity(to),
    ]);

    if (!originAp || !destAp) {
      return NextResponse.json({ error: "Airport lookup failed" }, { status: 404 });
    }

    const params = new URLSearchParams({
      originSkyId:          originAp.skyId,
      destinationSkyId:     destAp.skyId,
      originEntityId:       originAp.entityId,
      destinationEntityId:  destAp.entityId,
      date,
      adults,
      cabinClass:           CABIN_MAP[cabin] ?? "economy",
      currency:             "USD",
      market:               "en-US",
      countryCode:          "US",
      sortBy:               "best",
    });
    if (returnDate) params.set("returnDate", returnDate);

    const res = await fetch(`${BASE}/api/v1/flights/searchFlights?${params}`, {
      headers: HEADERS,
    });

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `Sky Scrapper error: ${res.status}`, detail: txt }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Flight search failed", detail: msg }, { status: 500 });
  }
}
