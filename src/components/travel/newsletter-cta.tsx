"use client";

import { useMemo } from "react";
import { Mail, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-context";
import { toast } from "sonner";

export function NewsletterCTA() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t.booking.errors.email);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone(true);
        toast.success(t.sections.cta.success);
        setEmail("");
      } else {
        toast.error(t.booking.errors.generic);
      }
    } catch {
      toast.error(t.booking.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const sparkle = useMemo(
    () => (locale === "ar" ? "✨" : locale === "fr" ? "✨" : "✨"),
    [locale],
  );

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-20 -start-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-white/5" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
                {sparkle}
                <span>{t.sections.cta.eyebrow}</span>
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                {t.sections.cta.title}
              </h2>
              <p className="mt-3 text-white/85 leading-relaxed max-w-md">
                {t.sections.cta.subtitle}
              </p>
              <p className="mt-3 text-xs text-white/70 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t.sections.cta.noSpam}
              </p>
            </div>

            <div className="lg:justify-self-end w-full lg:max-w-md">
              {done ? (
                <div className="rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 p-6 text-white text-center">
                  <CheckCircle2 className="h-10 w-10 mx-auto mb-3" />
                  <p className="font-bold text-lg">{t.sections.cta.success}</p>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="rounded-2xl bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-white/25 p-2 shadow-xl flex flex-col sm:flex-row gap-2"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute top-1/2 -translate-y-1/2 start-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.sections.cta.placeholder}
                      className="h-12 ps-9 border-0 shadow-none focus-visible:ring-2 focus-visible:ring-primary bg-transparent text-base"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-6 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow"
                  >
                    {loading ? (
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Send className="h-4 w-4 rtl:-scale-x-100" />
                    )}
                    {t.sections.cta.button}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
