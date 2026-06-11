import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import VideoBackground from "@/components/VideoBackground";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { GlassFilter } from "@/components/LiquidGlass";
import { ThemeProvider } from "@/components/ThemeProvider";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlightBooking.bitsolmarketing.com — Find Cheap Flights Worldwide | Discount Airfare",
  description: "Find cheap airline tickets, discount flights, and affordable airfare worldwide. Compare 500+ airlines, search domestic and international flights. Book with our travel experts via WhatsApp for the best deals on USA flight tickets.",
  keywords: "cheap airline tickets, cheap flights, discount flights, international flights, domestic flights, USA flight tickets, affordable airfare, cheap airfare, flight deals, low cost flights",
  openGraph: {
    title: "FlightBooking.bitsolmarketing.com — Find Cheap Flights Worldwide",
    description: "Search hundreds of airlines and find the cheapest flights worldwide. Compare routes, explore destinations, and connect with our travel experts for personalized booking assistance.",
    type: "website",
    url: "https://flightbooking.bitsolmarketing.com",
    siteName: "FlightBooking.bitsolmarketing.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlightBooking.bitsolmarketing.com — Cheap Flights & Discount Airfare",
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
    canonical: "https://flightbooking.bitsolmarketing.com",
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
      className={`${montserrat.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "FlightBooking.bitsolmarketing.com",
              "url": "https://flightbooking.bitsolmarketing.com",
              "description": "Find cheap airline tickets and discount flights worldwide",
              "telephone": "+1-800-555-1234",
              "email": "support@flightbooking.bitsolmarketing.com",
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
        <ThemeProvider>
          <GlassFilter />
          <VideoBackground />
          <ScrollProgressBar />
          <div className="relative z-10 flex flex-col min-h-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
