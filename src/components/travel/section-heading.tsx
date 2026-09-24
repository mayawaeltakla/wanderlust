"use client";

import { useI18n } from "@/i18n/i18n-context";

interface Props {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  const alignCls =
    align === "center" ? "text-center mx-auto" : "text-start";
  return (
    <div className={`max-w-2xl ${alignCls}`}>
      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        <span className="h-px w-6 bg-primary/40" />
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
