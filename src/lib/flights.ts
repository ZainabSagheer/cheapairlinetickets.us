export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  aircraft: string;
  from: string;
  fromCity: string;
  to: string;
  toCity: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  stopCity?: string;
  price: number;
  taxes: number;
  cabin: string;
  seatsLeft: number;
  tag?: string;
}

const airlines = [
  { name: "American Airlines", code: "AA", prefix: "AA" },
  { name: "Delta Air Lines", code: "DL", prefix: "DL" },
  { name: "United Airlines", code: "UA", prefix: "UA" },
  { name: "Southwest Airlines", code: "WN", prefix: "WN" },
  { name: "JetBlue Airways", code: "B6", prefix: "B6" },
  { name: "Alaska Airlines", code: "AS", prefix: "AS" },
  { name: "Spirit Airlines", code: "NK", prefix: "NK" },
  { name: "Frontier Airlines", code: "F9", prefix: "F9" },
  { name: "Emirates", code: "EK", prefix: "EK" },
  { name: "Qatar Airways", code: "QR", prefix: "QR" },
  { name: "British Airways", code: "BA", prefix: "BA" },
  { name: "Lufthansa", code: "LH", prefix: "LH" },
];

const aircraft = ["Boeing 737-800", "Boeing 777-300ER", "Airbus A320", "Airbus A321", "Airbus A380", "Boeing 787-9", "Airbus A350-900", "Boeing 737 MAX 8"];

const tags = ["Best Value", "Fastest", "Lowest Fare", "Popular", undefined, undefined, undefined];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTime(): string {
  const h = randomInt(0, 23).toString().padStart(2, "0");
  const m = ["00", "15", "30", "45"][randomInt(0, 3)];
  return `${h}:${m}`;
}

function calcArrival(dep: string, durationMins: number): string {
  const [h, m] = dep.split(":").map(Number);
  const total = h * 60 + m + durationMins;
  const ah = Math.floor((total % 1440) / 60).toString().padStart(2, "0");
  const am = (total % 60).toString().padStart(2, "0");
  return `${ah}:${am}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export function generateFlights(
  from: string,
  fromCity: string,
  to: string,
  toCity: string,
  cabin: string
): Flight[] {
  const count = randomInt(6, 10);
  const flights: Flight[] = [];
  const usedTags = new Set<string>();

  for (let i = 0; i < count; i++) {
    const airline = airlines[randomInt(0, airlines.length - 1)];
    const stops = randomInt(0, 1);
    const baseDuration = randomInt(stops === 0 ? 90 : 180, stops === 0 ? 300 : 540);
    const dep = generateTime();
    const price = randomInt(
      cabin === "economy" ? 149 : cabin === "business" ? 799 : 1499,
      cabin === "economy" ? 599 : cabin === "business" ? 2999 : 5999
    );

    let tag: string | undefined;
    const availableTags = tags.filter(t => t && !usedTags.has(t as string));
    if (availableTags.length > 0 && randomInt(0, 2) === 0) {
      tag = availableTags[0] as string;
      usedTags.add(tag);
    }

    flights.push({
      id: `FL${randomInt(1000, 9999)}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.prefix}${randomInt(100, 9999)}`,
      aircraft: aircraft[randomInt(0, aircraft.length - 1)],
      from,
      fromCity,
      to,
      toCity,
      departure: dep,
      arrival: calcArrival(dep, baseDuration),
      duration: formatDuration(baseDuration),
      stops,
      stopCity: stops > 0 ? ["ATL", "DFW", "ORD", "CLT", "PHX"][randomInt(0, 4)] : undefined,
      price,
      taxes: Math.round(price * 0.18),
      cabin,
      seatsLeft: randomInt(2, 15),
      tag,
    });
  }

  return flights.sort((a, b) => a.price - b.price);
}

// ── Sky Scrapper normaliser ────────────────────────────────────────────────────

function parseTime(iso: string | undefined): string {
  if (!iso) return "00:00";
  const t = iso.split("T")[1];
  return t ? t.slice(0, 5) : "00:00";
}

function parseDuration(mins: number | undefined): string {
  const m = mins ?? 120;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(item: any, from: string, fromCity: string, to: string, toCity: string, cabin: string, idx: number): Flight {
  const leg      = item.legs?.[0];
  const seg      = leg?.segments?.[0];
  const carrier  = leg?.carriers?.marketing?.[0];
  const rawPrice = item.price?.raw ?? 199;

  return {
    id:           item.id ?? `FL${idx}`,
    airline:      carrier?.name        ?? "Airline",
    airlineCode:  carrier?.alternateId ?? "XX",
    flightNumber: seg ? `${seg.marketingCarrier?.alternateId ?? "XX"}${seg.flightNumber ?? idx}` : `XX${1000 + idx}`,
    aircraft:     seg?.operatingCarrier?.name ?? "Commercial Aircraft",
    from,
    fromCity,
    to,
    toCity,
    departure:    parseTime(leg?.departure),
    arrival:      parseTime(leg?.arrival),
    duration:     parseDuration(leg?.durationInMinutes),
    stops:        leg?.stopCount ?? 0,
    stopCity:     leg?.stopCount > 0 ? leg?.segments?.[1]?.origin?.displayCode : undefined,
    price:        Math.round(rawPrice),
    taxes:        Math.round(rawPrice * 0.18),
    cabin,
    seatsLeft:    Math.floor(Math.random() * 8) + 2,
    tag:          idx === 0 ? "Best Value" : idx === 1 ? "Fastest" : undefined,
  };
}

export async function fetchFlights(
  from:       string,
  fromCity:   string,
  to:         string,
  toCity:     string,
  date:       string,
  returnDate: string,
  adults:     number,
  cabin:      string,
): Promise<Flight[]> {
  const params = new URLSearchParams({
    from,
    to,
    date,
    adults:     String(adults),
    cabinClass: cabin,
  });
  if (returnDate) params.set("returnDate", returnDate);

  const res = await fetch(`/api/flights/search?${params}`);
  if (!res.ok) throw new Error(`API ${res.status}`);

  const data = await res.json();
  const itineraries: unknown[] = data?.data?.itineraries ?? [];
  if (!itineraries.length) throw new Error("No flights returned");

  return itineraries
    .slice(0, 10)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any, i) => normalise(item, from, fromCity, to, toCity, cabin, i));
}
