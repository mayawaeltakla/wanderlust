"use client";

import { useMemo } from "react";
import {
  X,
  Star,
  Clock,
  Users,
  Gauge,
  MapPin,
  Check,
  Info,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Quote,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDetail } from "@/components/providers/detail-context";
import { useBooking } from "@/components/providers/booking-context";
import { useI18n } from "@/i18n/i18n-context";
import { destinations, testimonials } from "@/data/travel-data";
import { cn } from "@/lib/utils";
import { useGallery } from "@/hooks/use-gallery";

function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return (p[0]?.[0] ?? "") + (p[1]?.[0] ?? "");
}

export function TourDetailDialog() {
  const { detail, close } = useDetail();
  const { openBooking } = useBooking();
  const { t, locale } = useI18n();

  const isOpen = detail?.kind === "tour";
  const tour = detail?.kind === "tour" ? detail.tour : null;

  const dest = useMemo(
    () => destinations.find((d) => d.id === tour?.destinationId),
    [tour?.destinationId],
  );

  // Compute gallery length before the early return so the hook is called unconditionally
  const galleryLength = tour ? (tour.gallery.length || 1) : 1;
  const gallery = tour ? (tour.gallery.length ? tour.gallery : [tour.image]) : [];

  const { active: activeImg, next, prev, setActive: setActiveImg, pause, resume, containerRef } =
    useGallery({ length: galleryLength });

  if (!tour) return null;

  const discount = tour.oldPrice
    ? Math.round(((tour.oldPrice - tour.price) / tour.oldPrice) * 100)
    : 0;

  const relatedReviews = testimonials.slice(0, 2);

  const onBook = () => {
    close();
    openBooking({
      packageTitle: tour.title[locale],
      destination: dest ? `${dest.name[locale]}, ${dest.country[locale]}` : "",
      price: tour.price,
      durationDays: tour.durationDays,
    });
  };

  const difficultyLabel = t.detail.tour.level[tour.difficulty];

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && close()}>
      <DialogContent
        className="max-w-4xl w-[95vw] p-0 overflow-hidden gap-0 max-h-[92vh] overflow-y-auto scroll-pretty"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <DialogTitle className="sr-only">{tour.title[locale]}</DialogTitle>
        <DialogDescription className="sr-only">
          {tour.overview[locale]}
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
          {/* Stacked images — all preloaded, crossfade between active slide. */}
          {gallery.map((src, i) => (
            <img
              key={src + i}
              src={src}
              alt={`${tour.title[locale]} ${i + 1}`}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                i === activeImg ? "opacity-100" : "opacity-0",
              )}
              loading="eager"
              decoding="async"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

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

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 text-white z-10 pointer-events-none">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-accent text-accent-foreground border-0">
                <Clock className="h-3 w-3 me-1" />
                {tour.durationDays} {t.sections.tours.days}
              </Badge>
              {dest && (
                <Badge className="bg-white/15 backdrop-blur text-white border-0">
                  <MapPin className="h-3 w-3 me-1" />
                  {dest.name[locale]}, {dest.country[locale]}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow line-clamp-2">
              {tour.title[locale]}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{tour.rating.toFixed(1)}</span>
              <span className="text-white/70">
                ({tour.reviews.toLocaleString()} {t.sections.hotels.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 grid md:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat icon={Clock} label={t.detail.tour.duration} value={`${tour.durationDays} ${t.sections.tours.days}`} />
              <Stat icon={Users} label={t.detail.tour.groupSize} value={tour.groupSize} />
              <Stat icon={Gauge} label={t.detail.tour.difficulty} value={difficultyLabel} />
              <Stat icon={MapPin} label={t.detail.tour.destination} value={dest?.name[locale] ?? "—"} />
            </div>

            <Separator />

            {/* Overview */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">
                {t.detail.tour.overview}
              </h3>
              <p className="text-base leading-relaxed text-foreground/90">
                {tour.overview[locale]}
              </p>
            </section>

            {/* Highlights */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                {t.detail.tour.highlights}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {tour.highlights[locale].map((h, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm"
                  >
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {t.detail.tour.itinerary}
              </h3>
              <ol className="relative border-s-2 border-primary/20 ps-6 space-y-5 rtl:border-e-2 rtl:ps-0 rtl:pe-6 rtl:border-s-0">
                {tour.itinerary.map((day) => (
                  <li key={day.day} className="relative">
                    <span className="absolute -start-[1.6rem] rtl:-start-auto rtl:-end-[1.6rem] top-0 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow">
                      {day.day}
                    </span>
                    <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {t.detail.tour.day} {day.day}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">
                        {day.title[locale]}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {day.description[locale]}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* What's included */}
            <section className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3 flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  {t.detail.tour.whatsIncluded}
                </h3>
                <ul className="space-y-1.5">
                  {tour.includes[locale].map((inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  {t.detail.tour.goodToKnow}
                </h3>
                <ul className="space-y-1.5">
                  {tour.goodToKnow[locale].map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Reviews */}
            {relatedReviews.length > 0 && (
              <>
                <Separator />
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3 flex items-center gap-1.5">
                    <Quote className="h-3.5 w-3.5" />
                    {t.detail.tour.reviews}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedReviews.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border border-border bg-card p-3 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={`bg-gradient-to-br ${r.avatarColor} text-white text-xs font-bold`}
                            >
                              {initials(r.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-bold leading-tight">
                              {r.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {r.flag} {r.country}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 mb-1.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`h-3 w-3 ${
                                idx < r.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          “{r.text[locale]}”
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sticky booking sidebar */}
          <aside className="md:col-span-1">
            <div className="md:sticky md:top-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              {discount > 0 && (
                <Badge className="bg-accent text-accent-foreground border-0 mb-2">
                  {discount}% {t.sections.tours.off}
                </Badge>
              )}
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {t.detail.tour.startingFrom}
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                {tour.oldPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${tour.oldPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  ${tour.price.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                {t.detail.tour.perPerson}
              </div>

              <Button
                onClick={onBook}
                className="w-full h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow"
              >
                {t.detail.tour.bookThisTrip}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>

              <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  {t.booking.summary.guarantee}
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  {t.detail.tour.groupSize}: {tour.groupSize}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3 text-center">
      <Icon className="h-4 w-4 text-primary mx-auto mb-1" />
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="text-sm font-semibold leading-tight mt-0.5">{value}</div>
    </div>
  );
}
