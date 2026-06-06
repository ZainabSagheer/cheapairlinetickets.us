import { fetchDeals, fetchDestinations, fetchTestimonials } from "@/lib/wordpress";
import HomeClient from "@/components/HomeClient";

// Revalidate the page every hour — WordPress edits will be reflected within 60 minutes.
// Set to 0 for always-fresh SSR, or Infinity for pure static.
export const revalidate = 3600;

export default async function Page() {
  const [deals, destinations, testimonials] = await Promise.all([
    fetchDeals(),
    fetchDestinations(),
    fetchTestimonials(),
  ]);

  return (
    <HomeClient
      deals={deals}
      destinations={destinations}
      testimonials={testimonials}
    />
  );
}
