"use client";

import { useState } from "react";
import { Star, MapPin, Heart, ArrowUpRight, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-context";
import { destinations } from "@/data/travel-data";
import { SectionHeading } from "@/components/travel/section-heading";
import { useDetail } from "@/components/providers/detail-context";
import { cn } from "@/lib/utils";

export function Destinations() {
  const { t, locale } = useI18n();
  const { openDestination } = useDetail();
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved((s) => ({ ...s, [id]: !s[id] }));
  };

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
          {destinations.map((d, i) => {
            const isSaved = !!saved[d.id];
            return (
              <Card
                key={d.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card p-0 shadow-md hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1.5 transition-all duration-500 fade-up cursor-pointer"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => openDestination(d)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDestination(d);
                  }
                }}
                aria-label={`${t.sections.destinations.viewDetails}: ${d.name[locale]}`}
              >
                {/* Tall, dominant image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name[locale]}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Strong gradient for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                  {/* Heart / save icon — top end (premium touch) */}
                  <button
                    type="button"
                    onClick={(e) => toggleSave(d.id, e)}
                    aria-label="Save"
                    className="absolute top-3 end-3 grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur-md hover:bg-white/25 transition-colors"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-all",
                        isSaved
                          ? "fill-rose-500 text-rose-500 scale-110"
                          : "text-white",
                      )}
                    />
                  </button>

                  {/* Tours count — subtle, top start */}
                  <div className="absolute top-3 start-3 flex items-center gap-1 rounded-full bg-black/30 backdrop-blur-md text-white px-2.5 py-1 text-[11px] font-medium">
                    <TrendingUp className="h-3 w-3" />
                    {d.tours} {t.sections.destinations.tours}
                  </div>

                  {/* Organized bottom overlay — all info in one clean block */}
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    {/* Country */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/80 mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {d.country[locale]}
                    </div>

                    {/* Name — hero */}
                    <h3 className="text-3xl font-bold leading-tight tracking-tight drop-shadow-sm">
                      {d.name[locale]}
                    </h3>

                    {/* Rating — single place, one line */}
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{d.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-white/60">·</span>
                      <span className="text-white/80">
                        {d.reviews.toLocaleString()} {t.sections.hotels.reviews}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className="my-3 h-px bg-white/15" />

                    {/* Price + CTA hint */}
                    <div className="flex items-end justify-between gap-2">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-white/70 font-medium">
                          {t.sections.destinations.from}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-amber-300">
                            ${d.priceFrom.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-white/70">
                            {t.common.perPerson}
                          </span>
                        </div>
                      </div>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur-md group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                        <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-card px-8 h-12 text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
            {t.sections.destinations.viewAll}
          </button>
        </div>
      </div>
    </section>
  );
}
