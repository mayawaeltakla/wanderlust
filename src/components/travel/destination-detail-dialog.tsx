"use client";

import {
  X,
  Star,
  MapPin,
  CalendarDays,
  Coins,
  Languages,
  FileText,
  Clock,
  Compass,
  Check,
  ChevronLeft,
  ChevronRight,
  Plane,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

  const { active: activeImg, next, prev, setActive: setActiveImg, pause, resume, containerRef } =
    useGallery({ length: galleryLength });

  if (!d) return null;

  const relatedTours = tours.filter((x) => x.destinationId === d.id);

  // 6 info cards — equal, no-wrap values
  const facts = [
    { icon: CalendarDays, label: t.detail.destination.bestTime, value: d.bestTime[locale] },
    { icon: Coins, label: t.detail.destination.currency, value: d.currency },
    { icon: Languages, label: t.detail.destination.language, value: d.language[locale] },
    { icon: FileText, label: t.detail.destination.visa, value: d.visa[locale] },
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
        className="max-w-4xl w-[95vw] p-0 overflow-hidden gap-0 flex flex-col max-h-[92vh] rounded-[1.75rem] border border-border/60 shadow-2xl"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <DialogTitle className="sr-only">
          {d.name[locale]} — {d.country[locale]}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {d.overview[locale]}
        </DialogDescription>

        {/* ===== 1. Gallery (top, fixed height) — image + overlay with name/rating/price + slider controls ===== */}
        <div
          ref={containerRef}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={resume}
          className="relative aspect-[16/10] sm:aspect-[2/1] shrink-0 overflow-hidden bg-muted"
        >
          {/* Stacked images — all preloaded, crossfade between active slide.
              No blank flash because every image is rendered (even at opacity-0). */}
          {gallery.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${d.name[locale]} ${i + 1}`}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                i === activeImg ? "opacity-100" : "opacity-0",
              )}
              loading="eager"
              decoding="async"
            />
          ))}
          {/* gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 pointer-events-none" />

          {/* Close — top end, always on top */}
          <button
            onClick={close}
            aria-label={t.detail.close}
            className="absolute top-3 end-3 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors z-30"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev / Next arrows */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute top-1/2 -translate-y-1/2 start-3 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors z-30"
              >
                <ChevronLeft className="h-5 w-5 rtl:rotate-180" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute top-1/2 -translate-y-1/2 end-3 grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors z-30"
              >
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </button>
            </>
          )}

          {/* Overlay text — country, name, rating, price (non-interactive, behind controls) */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 text-sm font-medium text-white/85 mb-1">
              <MapPin className="h-4 w-4" />
              {d.country[locale]}
              <span className="mx-1">·</span>
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold">{d.rating.toFixed(1)}</span>
              <span className="text-white/70">({d.reviews.toLocaleString()})</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight drop-shadow-sm leading-tight">
              {d.name[locale]}
            </h2>

            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-white/70 font-medium">
                {t.sections.destinations.from}
              </span>
              <span className="text-2xl font-bold text-amber-300">
                ${d.priceFrom.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Slider dots — separate, clickable, above the overlay text */}
          {gallery.length > 1 && (
            <div className="absolute bottom-3 end-3 flex gap-1.5 z-30">
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
          )}
        </div>

        {/* ===== 2. Scrollable middle — overview + 6-card info grid ===== */}
        <div className="flex-1 overflow-y-auto scroll-pretty p-5 sm:p-6 space-y-6">
          {/* Overview */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
              {t.detail.destination.overview}
            </h3>
            <p className="text-base leading-relaxed text-foreground/90">
              {d.overview[locale]}
            </p>
          </section>

          {/* 6-card info grid — equal size, no-wrap values */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
              {t.detail.destination.quickFacts}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {facts.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-muted/30 px-3 py-3 flex flex-col items-center text-center overflow-hidden"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary mb-2 shrink-0">
                    <f.icon className="h-4 w-4" />
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap mb-0.5">
                    {f.label}
                  </div>
                  <div
                    className="text-sm font-semibold leading-tight w-full whitespace-nowrap overflow-hidden text-ellipsis"
                    title={f.value}
                    dir={f.value && /[\u0600-\u06FF]/.test(f.value) ? "rtl" : "ltr"}
                  >
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related tours (compact list, stays in scroll area) */}
          {relatedTours.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
                {t.detail.destination.topTours.replace("{name}", d.name[locale])}
              </h3>
              <div className="space-y-2">
                {relatedTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-2"
                  >
                    <img
                      src={tour.image}
                      alt={tour.title[locale]}
                      className="h-14 w-20 rounded-lg object-cover shrink-0"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm line-clamp-1">
                        {tour.title[locale]}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span className="whitespace-nowrap">
                          {tour.durationDays} {t.sections.tours.days}
                        </span>
                        <span>·</span>
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        <span className="font-bold whitespace-nowrap">
                          {tour.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <div className="text-base font-bold text-primary whitespace-nowrap">
                        ${tour.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ===== 3. Fixed bottom bar — price on one side, Book Now on the other ===== */}
        <div className="shrink-0 border-t border-border bg-card px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium whitespace-nowrap">
              {t.sections.destinations.from}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-primary whitespace-nowrap">
                ${d.priceFrom.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {t.common.perPerson}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={onPlanTrip}
              className="h-12 px-6 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md whitespace-nowrap"
            >
              <Plane className="h-4 w-4" />
              {t.detail.destination.bookNow}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
