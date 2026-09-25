"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plane,
  CalendarDays,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  StickyNote,
  CheckCircle2,
  X,
  ShieldCheck,
  Loader2,
  Tag,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useBooking } from "@/components/providers/booking-context";
import { useI18n } from "@/i18n/i18n-context";
import { toast } from "sonner";
import { DateSelect } from "@/components/travel/date-select";

export function BookingModal() {
  const { open, preset, closeBooking } = useBooking();
  const { t, locale } = useI18n();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  // Reset success state when a new preset opens
  useEffect(() => {
    if (open && preset) setReference(null);
  }, [open, preset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBooking();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeBooking]);

  const basePrice = preset?.price ?? 0;
  const total = useMemo(
    () => basePrice * Math.max(1, travelers),
    [basePrice, travelers],
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !travelDate) {
      toast.error(t.booking.errors.required);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t.booking.errors.email);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          packageTitle: preset?.packageTitle ?? "Custom Trip",
          destination: preset?.destination ?? "",
          travelDate,
          travelers,
          notes,
          totalPrice: total,
          locale,
        }),
      });
      const data = await res.json();
      if (data.ok && data.reference) {
        setReference(data.reference);
        toast.success(t.booking.success.title);
      } else {
        toast.error(t.booking.errors.generic);
      }
    } catch {
      toast.error(t.booking.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setTravelDate("");
    setTravelers(2);
    setNotes("");
    setReference(null);
    closeBooking();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent
        className="max-w-3xl w-[95vw] p-0 overflow-hidden gap-0 max-h-[92vh] overflow-y-auto scroll-pretty"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        {/* Header banner */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-accent p-6 text-white">
          <button
            onClick={resetAndClose}
            aria-label="Close"
            className="absolute top-3 end-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3 pe-10">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur shrink-0">
              <Plane className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-xl font-bold">
                {reference ? t.booking.success.title : t.booking.title}
              </DialogTitle>
              <DialogDescription className="text-white/85 text-sm mt-0.5">
                {reference ? t.booking.success.message : t.booking.subtitle}
              </DialogDescription>
            </div>
          </div>
        </div>

        {reference ? (
          /* Success state */
          <div className="p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary mb-4">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="text-2xl font-bold">{t.booking.success.title}</h3>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              {t.booking.success.message}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-5 py-3">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {t.booking.success.reference}:
              </span>
              <span
                className="font-bold text-lg tracking-wider text-primary"
                dir="ltr"
              >
                {reference}
              </span>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={resetAndClose} variant="outline">
                {t.booking.success.newBooking}
              </Button>
              <Button
                onClick={resetAndClose}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {t.booking.success.close}
              </Button>
            </div>
          </div>
        ) : (
          /* Single wrapping form (so the desktop submit button in the aside works) */
          <form onSubmit={onSubmit} className="grid md:grid-cols-5 gap-0">
            {/* Form fields */}
            <div className="md:col-span-3 p-6 space-y-4">
              {/* Package (read-only) */}
              <div className="rounded-xl border border-border bg-muted/40 p-3">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  {t.booking.fields.package}
                </Label>
                <div className="mt-1 font-semibold text-sm flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                  <span>{preset?.packageTitle ?? "—"}</span>
                </div>
                {preset?.destination && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    📍 {preset.destination}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bk-name" className="flex items-center gap-1.5 text-xs">
                    <User className="h-3 w-3 text-primary" />
                    {t.booking.fields.fullName}
                  </Label>
                  <Input
                    id="bk-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.booking.fields.fullNamePlaceholder}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bk-email" className="flex items-center gap-1.5 text-xs">
                    <Mail className="h-3 w-3 text-primary" />
                    {t.booking.fields.email}
                  </Label>
                  <Input
                    id="bk-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.booking.fields.emailPlaceholder}
                    required
                    dir="ltr"
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bk-phone" className="flex items-center gap-1.5 text-xs">
                    <Phone className="h-3 w-3 text-primary" />
                    {t.booking.fields.phone}
                  </Label>
                  <Input
                    id="bk-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.booking.fields.phonePlaceholder}
                    required
                    dir="ltr"
                    className="h-11"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="bk-date" className="flex items-center gap-1.5 text-xs">
                    <CalendarDays className="h-3 w-3 text-primary" />
                    {t.booking.fields.date}
                  </Label>
                  <div className="rounded-lg border border-input bg-background overflow-hidden">
                    <DateSelect
                      value={travelDate}
                      onChange={setTravelDate}
                      id="bk-date"
                      ariaLabel={t.booking.fields.date}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="bk-trav" className="flex items-center gap-1.5 text-xs">
                    <Users className="h-3 w-3 text-primary" />
                    {t.booking.fields.travelers}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setTravelers((n) => Math.max(1, n - 1))}
                      disabled={travelers <= 1}
                      className="h-11 w-11 text-lg"
                      aria-label="Decrease travelers"
                    >
                      −
                    </Button>
                    <Input
                      id="bk-trav"
                      type="number"
                      min={1}
                      max={20}
                      value={travelers}
                      onChange={(e) =>
                        setTravelers(
                          Math.max(1, Math.min(20, Number(e.target.value) || 1)),
                        )
                      }
                      className="h-11 w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setTravelers((n) => Math.min(20, n + 1))}
                      disabled={travelers >= 20}
                      className="h-11 w-11 text-lg"
                      aria-label="Increase travelers"
                    >
                      +
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {travelers} {t.hero.search.adults}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bk-notes" className="flex items-center gap-1.5 text-xs">
                  <StickyNote className="h-3 w-3 text-primary" />
                  {t.booking.fields.notes}
                </Label>
                <Textarea
                  id="bk-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.booking.fields.notesPlaceholder}
                  rows={3}
                />
              </div>
            </div>

            {/* Summary panel */}
            <aside className="md:col-span-2 bg-muted/40 border-s border-border p-6 flex flex-col">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                {t.booking.summary.title}
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-muted-foreground">
                    {t.booking.summary.package}:
                  </span>
                  <span className="font-medium text-end line-clamp-2 max-w-[60%]">
                    {preset?.packageTitle ?? "—"}
                  </span>
                </div>

                {preset?.destination && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted-foreground">
                      {t.booking.fields.destination}:
                    </span>
                    <span className="font-medium text-end">
                      {preset.destination}
                    </span>
                  </div>
                )}

                {preset?.durationDays ? (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-muted-foreground">
                      {t.sections.tours.days}:
                    </span>
                    <span className="font-medium" dir="ltr">
                      {preset.durationDays} {t.sections.tours.days}
                    </span>
                  </div>
                ) : null}

                <Separator />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">
                    {t.booking.summary.basePrice}
                  </span>
                  <span dir="ltr">${basePrice.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">
                    {t.booking.summary.travelers}
                  </span>
                  <Badge variant="secondary" className="font-bold">
                    ×{travelers}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-end justify-between gap-2 pt-1">
                  <span className="font-bold">{t.booking.summary.total}</span>
                  <span className="text-2xl font-bold text-primary" dir="ltr">
                    ${total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-primary/5 border border-primary/15 p-3 text-xs text-muted-foreground flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{t.booking.summary.guarantee}</span>
              </div>

              <div className="mt-auto pt-6 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2 text-base"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {t.booking.submit}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetAndClose}
                  className="w-full h-10"
                >
                  {t.booking.cancel}
                </Button>
              </div>
            </aside>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
