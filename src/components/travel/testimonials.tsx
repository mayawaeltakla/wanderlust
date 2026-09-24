"use client";

import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n/i18n-context";
import { testimonials } from "@/data/travel-data";
import { SectionHeading } from "@/components/travel/section-heading";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function Testimonials() {
  const { t, locale } = useI18n();

  // Duplicate for seamless marquee
  const loop = [...testimonials, ...testimonials];

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 bg-gradient-to-b from-muted/40 to-background overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t.sections.testimonials.eyebrow}
          title={t.sections.testimonials.title}
          subtitle={t.sections.testimonials.subtitle}
        />
      </div>

      {/* Marquee */}
      <div className="marquee-pause relative mt-10">
        {/* edge fade */}
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-marquee gap-6 px-4">
          {loop.map((r, i) => (
            <Card
              key={`${r.id}-${i}`}
              className="w-[320px] sm:w-[400px] shrink-0 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback
                      className={`bg-gradient-to-br ${r.avatarColor} text-white font-bold`}
                    >
                      {initials(r.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold leading-tight">{r.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{r.flag}</span>
                      <span>{r.country}</span>
                      <span className="mx-1">·</span>
                      <span className="text-primary font-medium">{r.trip}</span>
                    </div>
                  </div>
                </div>
                <Quote className="h-7 w-7 text-primary/30" />
              </div>

              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`h-4 w-4 ${
                      idx < r.rating
                        ? "fill-amber-500 text-amber-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                “{r.text[locale]}”
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
