"use client";

import { BookingProvider } from "@/components/providers/booking-context";
import { DetailProvider } from "@/components/providers/detail-context";
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
import { DestinationDetailDialog } from "@/components/travel/destination-detail-dialog";
import { TourDetailDialog } from "@/components/travel/tour-detail-dialog";

export default function Home() {
  return (
    <BookingProvider>
      <DetailProvider>
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
          <DestinationDetailDialog />
          <TourDetailDialog />
        </div>
      </DetailProvider>
    </BookingProvider>
  );
}
