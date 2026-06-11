// WordPress REST API client for flightbooking.bitsolmarketing.com (headless CMS)

const WP_URL = (process.env.NEXT_PUBLIC_WP_URL ?? "https://flightbooking.bitsolmarketing.com").replace(/\/$/, "");
const API    = `${WP_URL}/wp-json/wp/v2`;

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

async function wpFetch<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}/${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// ── Deal ───────────────────────────────────────────────────────────────────────

export interface WPDeal {
  route:   string;
  price:   string;
  airline: string;
}

export const FALLBACK_DEALS: WPDeal[] = [
  { route: "NYC → LAX",          price: "$149", airline: "Delta"           },
  { route: "Chicago → Miami",    price: "$99",  airline: "Spirit"          },
  { route: "Dallas → Vegas",     price: "$89",  airline: "Southwest"       },
  { route: "Miami → NYC",        price: "$129", airline: "JetBlue"         },
  { route: "LAX → Tokyo",        price: "$599", airline: "United"          },
  { route: "NYC → London",       price: "$399", airline: "British Airways" },
  { route: "SFO → Dubai",        price: "$699", airline: "Emirates"        },
  { route: "Atlanta → Orlando",  price: "$79",  airline: "Frontier"        },
  { route: "Boston → Cancún",    price: "$249", airline: "American"        },
  { route: "Seattle → Vegas",    price: "$109", airline: "Alaska"          },
];

export async function fetchDeals(): Promise<WPDeal[]> {
  const raw = await wpFetch<Array<{
    title: { rendered: string };
    meta:  { price?: string; airline?: string };
  }>>("deal?per_page=20&_fields=title,meta");

  if (!raw || raw.length === 0) return FALLBACK_DEALS;
  return raw.map(d => ({
    route:   stripTags(d.title.rendered),
    price:   d.meta?.price   ?? "$0",
    airline: d.meta?.airline ?? "",
  }));
}

// ── Destination ────────────────────────────────────────────────────────────────

export interface WPDestination {
  city:         string;
  code:         string;
  country:      string;
  from:         string;
  emoji:        string;
  gradientFrom: string;
  gradientTo:   string;
  accent:       string;
  tag:          string;
  bg:           string;
}

export const FALLBACK_DESTINATIONS: WPDestination[] = [
  { city: "New York",      code: "JFK", country: "USA", from: "$149", emoji: "🗽", gradientFrom: "#1a2a5c", gradientTo: "#0a0a40", accent: "#2563EB", tag: "Most Popular",  bg: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80" },
  { city: "Los Angeles",   code: "LAX", country: "USA", from: "$129", emoji: "🌴", gradientFrom: "#2d1a5c", gradientTo: "#1a0a40", accent: "#A78BFA", tag: "Trending",      bg: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&q=80" },
  { city: "Miami",         code: "MIA", country: "USA", from: "$159", emoji: "🏖️", gradientFrom: "#1a5c3a", gradientTo: "#0a3020", accent: "#34D399", tag: "Beach Getaway", bg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { city: "Chicago",       code: "ORD", country: "USA", from: "$119", emoji: "🏙️", gradientFrom: "#3a1a1a", gradientTo: "#2a0a0a", accent: "#F87171", tag: "Business Hub",  bg: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80" },
  { city: "Las Vegas",     code: "LAS", country: "USA", from: "$99",  emoji: "🎰", gradientFrom: "#3a2a1a", gradientTo: "#2a1a0a", accent: "#FBBF24", tag: "Best Deal",     bg: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80" },
  { city: "Orlando",       code: "MCO", country: "USA", from: "$139", emoji: "🎢", gradientFrom: "#1a1a3a", gradientTo: "#0a0a20", accent: "#00D9FF", tag: "Family Fun",    bg: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?w=600&q=80" },
  { city: "Dallas",        code: "DFW", country: "USA", from: "$109", emoji: "🤠", gradientFrom: "#3a1a3a", gradientTo: "#200a20", accent: "#E879F9", tag: "Value Pick",    bg: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80" },
  { city: "San Francisco", code: "SFO", country: "USA", from: "$189", emoji: "🌉", gradientFrom: "#1a1a3a", gradientTo: "#0a0a20", accent: "#7C3AED", tag: "Tech Capital",  bg: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80" },
];

export async function fetchDestinations(): Promise<WPDestination[]> {
  const raw = await wpFetch<Array<{
    title:     { rendered: string };
    _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
    meta: {
      code?:          string;
      country?:       string;
      price_from?:    string;
      emoji?:         string;
      accent_color?:  string;
      tag?:           string;
      gradient_from?: string;
      gradient_to?:   string;
    };
  }>>("destination?per_page=20&_embed");

  if (!raw || raw.length === 0) return FALLBACK_DESTINATIONS;
  return raw.map(d => ({
    city:         stripTags(d.title.rendered),
    code:         d.meta?.code          ?? "",
    country:      d.meta?.country       ?? "",
    from:         d.meta?.price_from    ?? "$0",
    emoji:        d.meta?.emoji         ?? "✈️",
    gradientFrom: d.meta?.gradient_from ?? "#1a3a5c",
    gradientTo:   d.meta?.gradient_to   ?? "#0F172A",
    accent:       d.meta?.accent_color  ?? "#2563EB",
    tag:          d.meta?.tag           ?? "",
    bg:           d._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "",
  }));
}

// ── Testimonial ────────────────────────────────────────────────────────────────

export interface WPTestimonial {
  id:       number;
  name:     string;
  location: string;
  rating:   number;
  review:   string;
  route:    string;
  savings:  string;
  avatar:   string;
  color:    string;
}

export const FALLBACK_TESTIMONIALS: WPTestimonial[] = [
  { id: 1, name: "Sarah Mitchell",  location: "New York, USA",      rating: 5, review: "FlightBooking.bitsolmarketing.com saved me over $400 on my roundtrip to London! The WhatsApp support was incredibly fast — my consultant responded within minutes and had my tickets confirmed the same day. Absolutely phenomenal service!", route: "NYC → London",       savings: "$412", avatar: "SM", color: "#2563EB" },
  { id: 2, name: "Marcus Johnson",  location: "Chicago, USA",        rating: 5, review: "I was skeptical at first, but after comparing with three other sites, FlightBooking.bitsolmarketing.com had the lowest fare by far. The booking consultant walked me through every step. Will definitely use again for our family vacation!",  route: "Chicago → Cancún",  savings: "$287", avatar: "MJ", color: "#00D9FF" },
  { id: 3, name: "Jennifer Park",   location: "Los Angeles, USA",    rating: 5, review: "Booked business class to Tokyo at a price I couldn't believe. The team negotiated an upgrade I never expected. Professional, efficient, and genuinely cared about getting me the best deal. 10/10 recommend!",                       route: "LAX → Tokyo",        savings: "$650", avatar: "JP", color: "#7C3AED" },
  { id: 4, name: "David Thompson",  location: "Miami, USA",          rating: 5, review: "What sets them apart is the personal touch. Instead of a generic booking portal, I had a real expert help me find connecting flights that saved me money and reduced travel time. Pure gold!",                                       route: "Miami → Dubai",      savings: "$320", avatar: "DT", color: "#34D399" },
  { id: 5, name: "Amanda Rivera",   location: "Dallas, USA",         rating: 5, review: "Used FlightBooking.bitsolmarketing.com for three trips this year. Each time, the service was seamless and the prices were unbeatable. The WhatsApp chat feature makes it so easy to get quick answers. Highly recommended!",                    route: "Dallas → NYC",       savings: "$195", avatar: "AR", color: "#FBBF24" },
  { id: 6, name: "Robert Chen",     location: "San Francisco, USA",  rating: 5, review: "Finally a travel agency that doesn't charge hidden fees and actually communicates! Got my entire family of 5 to Orlando for under $600 total. The consultant was patient and found us the perfect flight times.",                     route: "SFO → Orlando",      savings: "$480", avatar: "RC", color: "#F87171" },
];

export async function fetchTestimonials(): Promise<WPTestimonial[]> {
  const raw = await wpFetch<Array<{
    id:      number;
    title:   { rendered: string };
    content: { rendered: string };
    meta: {
      location?: string;
      rating?:   string;
      route?:    string;
      savings?:  string;
      avatar?:   string;
      color?:    string;
    };
  }>>("testimonial?per_page=20&_fields=id,title,content,meta");

  if (!raw || raw.length === 0) return FALLBACK_TESTIMONIALS;
  return raw.map(t => ({
    id:       t.id,
    name:     stripTags(t.title.rendered),
    location: t.meta?.location ?? "",
    rating:   Number(t.meta?.rating ?? 5),
    review:   stripTags(t.content.rendered),
    route:    t.meta?.route    ?? "",
    savings:  t.meta?.savings  ?? "",
    avatar:   t.meta?.avatar   ?? stripTags(t.title.rendered).split(" ").map(w => w[0]).join("").toUpperCase(),
    color:    t.meta?.color    ?? "#2563EB",
  }));
}

// ── Blog Posts ─────────────────────────────────────────────────────────────────

export interface WPPost {
  id:            number;
  slug:          string;
  title:         string;
  excerpt:       string;
  date:          string;
  featuredImage?: string;
}

export async function fetchPosts(count = 6): Promise<WPPost[]> {
  const raw = await wpFetch<Array<{
    id:       number;
    slug:     string;
    title:    { rendered: string };
    excerpt:  { rendered: string };
    date:     string;
    _embedded?: { "wp:featuredmedia"?: Array<{ source_url: string }> };
  }>>(`posts?per_page=${count}&_embed`);

  if (!raw) return [];
  return raw.map(p => ({
    id:            p.id,
    slug:          p.slug,
    title:         stripTags(p.title.rendered),
    excerpt:       stripTags(p.excerpt.rendered),
    date:          p.date,
    featuredImage: p._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
  }));
}
