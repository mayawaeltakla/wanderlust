"use client";

import { ArrowRight, Star, MapPin, Info, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-context";
import { destinations } from "@/data/travel-data";
import { SectionHeading } from "@/components/travel/section-heading";
import { useDetail } from "@/components/providers/detail-context";

export function Destinations() {
  const { t, locale } = useI18n();
  const { openDestination } = useDetail();

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

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {destinations.map((d, i) => (
            <Card
              key={d.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-0 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Image — landscape, wider, more premium */}
              <button
                type="button"
                onClick={() => openDestination(d)}
                className="relative aspect-[3/2] overflow-hidden block w-full text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                aria-label={`${t.sections.destinations.viewDetails}: ${d.name[locale]}`}
              >
                <img
                  src={d.image}
                  alt={d.name[locale]}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Rating badge — top end */}
                <div className="absolute top-3 end-3 flex items-center gap-1 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur px-2.5 py-1 text-xs font-bold shadow-md">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span>{d.rating.toFixed(1)}</span>
                </div>

                {/* Tours count badge — top start */}
                <div className="absolute top-3 start-3 flex items-center gap-1 rounded-full bg-primary/90 text-primary-foreground backdrop-blur px-2.5 py-1 text-xs font-bold shadow-md">
                  <TrendingUp className="h-3 w-3" />
                  {d.tours} {t.sections.destinations.tours}
                </div>

                {/* View details hint on hover */}
                <div className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 text-primary shadow-lg">
                    <Info className="h-5 w-5" />
                  </span>
                </div>
              </button>

              {/* Body — clean, organized, generous padding */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                {/* Country */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {d.country[locale]}
                </div>

                {/* Name */}
                <button
                  type="button"
                  onClick={() => openDestination(d)}
                  className="text-start block w-full mt-1"
                >
                  <h3 className="text-2xl font-bold leading-tight tracking-tight hover:text-primary transition-colors">
                    {d.name[locale]}
                  </h3>
                </button>

                {/* Reviews line */}
                <div className="mt-2 flex items-center gap-1.5 text-sm">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3.5 w-3.5 ${
                          idx < Math.round(d.rating)
                            ? "fill-amber-500 text-amber-500"
                            : "fill-muted-foreground/20 text-muted-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{d.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({d.reviews.toLocaleString()} {t.sections.hotels.reviews})
                  </span>
                </div>

                {/* Price + meta row */}
                <div className="mt-4 flex items-end justify-between gap-3 pt-4 border-t border-border">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                      {t.sections.destinations.from}
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-bold text-primary">
                        ${d.priceFrom.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {t.common.perPerson}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Full-width CTA */}
                <Button
                  onClick={() => openDestination(d)}
                  className="mt-4 w-full h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm group-hover:shadow-md transition-shadow"
                >
                  <Info className="h-4 w-4" />
                  {t.sections.destinations.viewDetails}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="gap-2 rounded-full px-8 h-12"
          >
            {t.sections.destinations.viewAll}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </section>
  );
}
