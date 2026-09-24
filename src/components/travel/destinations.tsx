"use client";

import { ArrowRight, Star, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-context";
import { destinations } from "@/data/travel-data";
import { SectionHeading } from "@/components/travel/section-heading";
import { useBooking } from "@/components/providers/booking-context";

export function Destinations() {
  const { t, locale } = useI18n();
  const { openBooking } = useBooking();

  return (
    <section
      id="destinations"
      className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/40"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.sections.destinations.eyebrow}
          title={t.sections.destinations.title}
          subtitle={t.sections.destinations.subtitle}
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {destinations.map((d, i) => (
            <Card
              key={d.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-sm hover:shadow-xl transition-all duration-300 fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={d.image}
                  alt={d.name[locale]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                {/* Rating badge */}
                <div className="absolute top-3 end-3 flex items-center gap-1 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur px-2.5 py-1 text-xs font-bold shadow">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{d.rating.toFixed(1)}</span>
                </div>

                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 mb-1">
                    <MapPin className="h-3 w-3" />
                    {d.country[locale]}
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{d.name[locale]}</h3>
                  <div className="mt-2 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-white/70">
                        {t.sections.destinations.from}
                      </div>
                      <div className="text-lg font-bold text-amber-300">
                        ${d.priceFrom.toLocaleString()}
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-white/15 text-white border-0 backdrop-blur"
                    >
                      {d.tours} {t.sections.destinations.tours}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Hover action */}
              <div className="p-3">
                <Button
                  variant="outline"
                  className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                  onClick={() =>
                    openBooking({
                      packageTitle: `${d.name[locale]} - Custom Trip`,
                      destination: d.name[locale],
                      price: d.priceFrom,
                    })
                  }
                >
                  <Plane className="h-4 w-4" />
                  {t.nav.bookNow}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" size="lg" className="gap-2">
            {t.sections.destinations.viewAll}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </section>
  );
}
