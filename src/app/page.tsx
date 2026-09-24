"use client";

import { BookingProvider } from "@/components/providers/booking-context";
import { Header } from "@/components/travel/header";
import { Hero } from "@/components/travel/hero";
import { Destinations } from "@/components/travel/destinations";
import { Tours } from "@/components/travel/tours";
import { Hotels } from "@/components/travel/hotels";
import { Features } from "@/components/travel/features";
import { Testimonials } from "@/components/travel/testimonials";
import { NewsletterCTA } from "@/components/travel/newsletter-cta";
import { Footer } from "@/components/travel/footer";
import { BookingModal } from "@/components/travel/booking-modal";

export default function Home() {
  return (
    <BookingProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Hero />
          <Destinations />
          <Tours />
          <Hotels />
          <Features />
          <Testimonials />
          <NewsletterCTA />
        </main>
        <Footer />
        <BookingModal />
      </div>
    </BookingProvider>
  );
}
