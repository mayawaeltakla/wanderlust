"use client";

import { Clock, Star, Check, ArrowRight, Tag, Flame, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/i18n/i18n-context";
import { tours, TOUR_CATEGORIES, type TourCategory } from "@/data/travel-data";
import { destinations } from "@/data/travel-data";
import { SectionHeading } from "@/components/travel/section-heading";
import { useBooking } from "@/components/providers/booking-context";
import { useDetail } from "@/components/providers/detail-context";

export function Tours() {
  const { t, locale } = useI18n();
  const { openBooking } = useBooking();
  const { openTour } = useDetail();

  const filterTours = (cat: TourCategory) =>
    cat === "all" ? tours : tours.filter((x) => x.category === cat);

  const destName = (id: string) => {
    const d = destinations.find((x) => x.id === id);
    return d ? d.name[locale] : "";
  };

  return (
    <section id="tours" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.sections.tours.eyebrow}
          title={t.sections.tours.title}
          subtitle={t.sections.tours.subtitle}
        />

        <Tabs defaultValue="all" className="mt-8">
          <div className="flex justify-center">
            <TabsList className="flex flex-wrap h-auto bg-muted/60 p-1.5 gap-1">
              {TOUR_CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="px-3 sm:px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
                >
                  {t.sections.tours.filters[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {TOUR_CATEGORIES.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterTours(cat).map((tour, i) => {
                  const discount = tour.oldPrice
                    ? Math.round(
                        ((tour.oldPrice - tour.price) / tour.oldPrice) * 100,
                      )
                    : 0;
                  return (
                    <Card
                      key={tour.id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 fade-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <button
                        type="button"
                        onClick={() => openTour(tour)}
                        aria-label={`${t.sections.tours.viewDetails}: ${tour.title[locale]}`}
                        className="relative aspect-[16/10] overflow-hidden block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <img
                          src={tour.image}
                          alt={tour.title[locale]}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        {discount > 0 && (
                          <Badge className="absolute top-3 start-3 bg-accent text-accent-foreground border-0 gap-1 shadow-md">
                            <Flame className="h-3 w-3" />
                            {discount}% {t.sections.tours.off}
                          </Badge>
                        )}
                        {i === 0 && cat === "all" && (
                          <Badge className="absolute top-3 end-3 bg-primary text-primary-foreground border-0 shadow-md">
                            <Tag className="h-3 w-3" /> {t.sections.tours.bestValue}
                          </Badge>
                        )}
                        <div className="absolute bottom-3 start-3 flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur px-2.5 py-1 text-xs font-bold">
                          <Clock className="h-3 w-3 text-primary" />
                          {tour.durationDays} {t.sections.tours.days}
                        </div>
                        {/* View details hint on hover */}
                        <div className="absolute top-3 end-3 grid h-8 w-8 place-items-center rounded-full bg-white/15 backdrop-blur text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <Info className="h-4 w-4" />
                        </div>
                      </button>

                      <div className="flex flex-col flex-1 p-5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <span className="text-base leading-none">📍</span>
                            {destName(tour.destinationId)}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                            {tour.rating.toFixed(1)}
                            <span className="text-muted-foreground font-normal">
                              ({tour.reviews.toLocaleString()})
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openTour(tour)}
                          className="text-start block w-full"
                        >
                          <h3 className="text-lg font-bold leading-snug line-clamp-2 min-h-[3.5rem] hover:text-primary transition-colors">
                            {tour.title[locale]}
                          </h3>
                        </button>

                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {tour.description[locale]}
                        </p>

                        {/* Includes */}
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {tour.includes[locale].slice(0, 3).map((inc, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                            >
                              <Check className="h-3 w-3 text-primary" />
                              {inc}
                            </span>
                          ))}
                        </div>

                        {/* Price + CTA */}
                        <div className="mt-auto pt-4 flex items-end justify-between gap-3 border-t border-border">
                          <div>
                            {tour.oldPrice && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${tour.oldPrice.toLocaleString()}
                              </div>
                            )}
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-foreground">
                                ${tour.price.toLocaleString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {t.sections.tours.perPerson}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => openTour(tour)}
                            >
                              <Info className="h-4 w-4" />
                              <span className="hidden sm:inline">{t.sections.tours.viewDetails}</span>
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow"
                              onClick={() =>
                                openBooking({
                                  packageTitle: tour.title[locale],
                                  destination: destName(tour.destinationId),
                                  price: tour.price,
                                  durationDays: tour.durationDays,
                                })
                              }
                            >
                              {t.sections.tours.bookNow}
                              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
