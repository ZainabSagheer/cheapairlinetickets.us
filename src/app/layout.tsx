import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/VideoBackground";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { GlassFilter } from "@/components/LiquidGlass";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CheapAirlineTickets.us — Find Cheap Flights Worldwide | Discount Airfare",
  description: "Find cheap airline tickets, discount flights, and affordable airfare worldwide. Compare 500+ airlines, search domestic and international flights. Book with our travel experts via WhatsApp for the best deals on USA flight tickets.",
  keywords: "cheap airline tickets, cheap flights, discount flights, international flights, domestic flights, USA flight tickets, affordable airfare, cheap airfare, flight deals, low cost flights",
  openGraph: {
    title: "CheapAirlineTickets.us — Find Cheap Flights Worldwide",
    description: "Search hundreds of airlines and find the cheapest flights worldwide. Compare routes, explore destinations, and connect with our travel experts for personalized booking assistance.",
    type: "website",
    url: "https://cheapairlinetickets.us",
    siteName: "CheapAirlineTickets.us",
  },
  twitter: {
    card: "summary_large_image",
    title: "CheapAirlineTickets.us — Cheap Flights & Discount Airfare",
    description: "Find cheap airline tickets and discount flights worldwide. Search, compare, and book with our travel experts.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://cheapairlinetickets.us",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0EA5E9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "CheapAirlineTickets.us",
              "url": "https://cheapairlinetickets.us",
              "description": "Find cheap airline tickets and discount flights worldwide",
              "telephone": "+1-800-555-1234",
              "email": "support@cheapairlinetickets.us",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "New York",
                "addressRegion": "NY",
                "addressCountry": "US"
              },
              "areaServed": "Worldwide",
              "serviceType": "Flight Booking",
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative">
        <GlassFilter />
        <VideoBackground />
        <ScrollProgressBar />
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
