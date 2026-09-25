"use client";

import {
  X,
  Star,
  MapPin,
  CalendarDays,
  Coins,
  Languages,
  Building2,
  Clock,
  Compass,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Plane,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDetail } from "@/components/providers/detail-context";
import { useBooking } from "@/components/providers/booking-context";
import { useI18n } from "@/i18n/i18n-context";
import { tours } from "@/data/travel-data";
import { cn } from "@/lib/utils";
import { useGallery } from "@/hooks/use-gallery";

export function DestinationDetailDialog() {
  const { detail, close } = useDetail();
  const { openBooking } = useBooking();
  const { t, locale } = useI18n();

  const isOpen = detail?.kind === "destination";
  const d = detail?.kind === "destination" ? detail.destination : null;

  // Compute gallery length before the early return so the hook is called unconditionally
  const galleryLength = d ? (d.gallery.length || 1) : 1;
  const gallery = d ? (d.gallery.length ? d.gallery : [d.image]) : [];

  const { active: activeImg, next, prev, goTo, setActive: setActiveImg, pause, resume, containerRef } =
    useGallery({ length: galleryLength });

  if (!d) return null;

  const relatedTours = tours.filter((x) => x.destinationId === d.id);
  const facts = [
    { icon: CalendarDays, label: t.detail.destination.bestTime, value: d.bestTime[locale] },
    { icon: Coins, label: t.detail.destination.currency, value: d.currency },
    { icon: Building2, label: t.detail.destination.capital, value: d.capital[locale] },
    { icon: Languages, label: t.detail.destination.language, value: d.language[locale] },
    { icon: Clock, label: t.detail.destination.timezone, value: d.timezone },
    { icon: Compass, label: t.detail.destination.toursAvailable, value: String(d.tours) },
  ];

  const onPlanTrip = () => {
    close();
    openBooking({
      packageTitle: t.detail.destination.planTrip.replace("{name}", d.name[locale]),
      destination: `${d.name[locale]}, ${d.country[locale]}`,
      price: d.priceFrom,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && close()}>
      <DialogContent
        className="max-w-4xl w-[95vw] p-0 overflow-hidden gap-0 max-h-[92vh] overflow-y-auto scroll-pretty"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <DialogTitle className="sr-only">
          {d.name[locale]} — {d.country[locale]}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {d.overview[locale]}
        </DialogDescription>

        {/* Hero gallery */}
        <div
          ref={containerRef}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
          className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-muted"
        >
          <img
            src={gallery[activeImg]}
            alt={`${d.name[locale]} ${activeImg + 1}`}
            className="h-full w-full object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <button
            onClick={close}
            aria-label={t.detail.close}
            className="absolute top-3 end-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors z-20"
          >
            <X className="h-4 w-4" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute top-1/2 -translate-y-1/2 start-3 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors z-30"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute top-1/2 -translate-y-1/2 end-3 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition-colors z-30"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
              <div className="absolute bottom-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex gap-1.5 z-30">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Image ${i + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === activeImg ? "w-6 bg-white" : "w-1.5 bg-white/50",
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Title overlay — pointer-events-none so it never blocks the slider controls */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-white z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 text-sm font-medium text-white/90 mb-1">
              <MapPin className="h-4 w-4" />
              {d.country[locale]}
              <span className="mx-1">·</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{d.rating.toFixed(1)}</span>
              <span className="text-white/70">({d.reviews.toLocaleString()})</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight drop-shadow">
              {d.name[locale]}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-white/70">
                {t.sections.destinations.from}
              </span>
              <span className="text-2xl font-bold text-amber-300">
                ${d.priceFrom.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 grid md:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="md:col-span-2 space-y-6">
            {/* Overview */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                {t.detail.destination.overview}
              </h3>
              <p className="text-base leading-relaxed text-foreground/90">
                {d.overview[locale]}
              </p>
            </section>

            <Separator />

            {/* Quick facts */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
                {t.detail.destination.quickFacts}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {facts.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      <f.icon className="h-3 w-3 text-primary" />
                      {f.label}
                    </div>
                    <div className="text-sm font-semibold leading-tight">
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Related tours */}
            {relatedTours.length > 0 && (
              <>
                <Separator />
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
                    {t.detail.destination.topTours.replace("{name}", d.name[locale])}
                  </h3>
                  <div className="space-y-3">
                    {relatedTours.map((tour) => (
                      <div
                        key={tour.id}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={tour.image}
                          alt={tour.title[locale]}
                          className="h-16 w-24 rounded-lg object-cover shrink-0"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm line-clamp-1">
                            {tour.title[locale]}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{tour.durationDays} {t.sections.tours.days}</span>
                            <span className="mx-1">·</span>
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            <span className="font-bold">{tour.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="text-end shrink-0">
                          <div className="text-base font-bold text-primary">
                            ${tour.price.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {t.sections.tours.perPerson}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sticky CTA sidebar */}
          <aside className="md:col-span-1">
            <div className="md:sticky md:top-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {t.detail.tour.startingFrom}
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold text-primary">
                  ${d.priceFrom.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t.common.perPerson}
                </span>
              </div>

              <ul className="space-y-2 mb-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {t.detail.destination.toursAvailable}: {d.tours}
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  {t.booking.summary.guarantee}
                </li>
              </ul>

              <Button
                onClick={onPlanTrip}
                className="w-full h-12 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow"
              >
                <Plane className="h-4 w-4" />
                {t.detail.destination.bookNow}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <p className="mt-3 text-[11px] text-center text-muted-foreground">
                {t.detail.destination.planTrip.replace("{name}", d.name[locale])}
              </p>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
