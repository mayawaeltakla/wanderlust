"use client";

import {
  BadgePercent,
  Headphones,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { features } from "@/data/travel-data";

const ICONS: Record<string, React.ElementType> = {
  BadgePercent,
  Headphones,
  Users,
  ShieldCheck,
};

export function Features() {
  const { t, locale } = useI18n();

  return (
    <section
      id="about"
      className="py-16 sm:py-24 bg-background relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 start-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 end-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t.sections.features.eyebrow}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {t.sections.features.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {t.sections.features.subtitle}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon] ?? ShieldCheck;
            return (
              <div
                key={f.id}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-xl transition-all fade-up overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute -top-12 -end-12 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="relative">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {f.title[locale]}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description[locale]}
                  </p>
                </div>
                <ArrowRight className="absolute bottom-4 end-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-all" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
