"use client";

import {
  Star,
  MapPin,
  BedDouble,
  Wifi,
  Waves,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-context";
import { hotels } from "@/data/travel-data";
import { SectionHeading } from "@/components/travel/section-heading";
import { useBooking } from "@/components/providers/booking-context";

const AMENITY_ICON: Record<string, React.ElementType> = {
  Pool: Waves,
  Spa: Sparkles,
  Beach: Waves,
  WiFi: Wifi,
  Bar: BedDouble,
  View: Star,
  Gym: BedDouble,
};

export function Hotels() {
  const { t, locale } = useI18n();
  const { openBooking } = useBooking();

  return (
    <section
      id="hotels"
      className="py-16 sm:py-24 bg-gradient-to-b from-muted/40 to-background"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.sections.hotels.eyebrow}
          title={t.sections.hotels.title}
          subtitle={t.sections.hotels.subtitle}
        />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {hotels.map((h, i) => (
            <Card
              key={h.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={h.image}
                  alt={h.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                {h.badge && (
                  <Badge className="absolute top-3 start-3 bg-accent text-accent-foreground border-0 shadow-md px-3 py-1">
                    {h.badge[locale]}
                  </Badge>
                )}
                {/* Stars — top end */}
                <div className="absolute top-3 end-3 flex items-center gap-1 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur px-2.5 py-1 text-xs font-bold shadow-md">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{h.stars}</span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {h.location[locale]}
                </div>

                {/* Name */}
                <h3 className="mt-1 text-xl font-bold leading-tight tracking-tight line-clamp-1">
                  {h.name}
                </h3>

                {/* Rating + reviews */}
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < Math.round(h.rating)
                            ? "fill-amber-500 text-amber-500"
                            : "fill-muted-foreground/20 text-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{h.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({h.reviews.toLocaleString()} {t.sections.hotels.reviews})
                  </span>
                </div>

                {/* Amenities */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {h.amenities.map((a) => {
                      const Icon = AMENITY_ICON[a] ?? Wifi;
                      return (
                        <span
                          key={a}
                          title={a}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="mt-auto pt-5 flex items-end justify-between gap-3 border-t border-border">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      {t.sections.hotels.perNight}
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-bold text-foreground">
                        ${h.pricePerNight}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="gap-1.5 h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    onClick={() =>
                      openBooking({
                        packageTitle: `${h.name} - ${h.location[locale]}`,
                        destination: h.location[locale],
                        price: h.pricePerNight,
                        durationDays: 1,
                      })
                    }
                  >
                    {t.sections.hotels.book}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
