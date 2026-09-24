"use client";

import { Star, MapPin, BedDouble, Wifi, Waves, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-context";
import { hotels } from "@/data/travel-data";
import { SectionHeading } from "@/components/travel/section-heading";
import { useBooking } from "@/components/providers/booking-context";

const AMENITY_ICON: Record<string, React.ElementType> = {
  Pool: Waves,
  Spa: Star,
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

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((h, i) => (
            <Card
              key={h.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={h.image}
                  alt={h.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {h.badge && (
                  <Badge className="absolute top-3 start-3 bg-accent text-accent-foreground border-0 shadow">
                    {h.badge[locale]}
                  </Badge>
                )}
                <div className="absolute bottom-2 end-2 flex items-center gap-1 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur px-2 py-0.5 text-[11px] font-bold">
                  {"★".repeat(h.stars)}
                </div>
              </div>

              <div className="flex flex-col flex-1 p-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <MapPin className="h-3 w-3" />
                  {h.location[locale]}
                </div>
                <h3 className="text-base font-bold leading-tight line-clamp-1">
                  {h.name}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-bold">{h.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({h.reviews.toLocaleString()} {t.sections.hotels.reviews})
                  </span>
                </div>

                {/* Amenities */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {h.amenities.map((a) => {
                    const Icon = AMENITY_ICON[a] ?? Wifi;
                    return (
                      <span
                        key={a}
                        title={a}
                        className="grid h-7 w-7 place-items-center rounded-md bg-muted text-muted-foreground"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                    );
                  })}
                </div>

                <div className="mt-auto pt-4 flex items-end justify-between gap-2 border-t border-border">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold">${h.pricePerNight}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {t.sections.hotels.perNight}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 hover:bg-primary hover:text-primary-foreground hover:border-primary"
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
                    <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
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
