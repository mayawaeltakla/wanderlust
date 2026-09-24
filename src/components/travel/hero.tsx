"use client";

import { useState } from "react";
import { Search, MapPin, Users, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n/i18n-context";
import { destinations, HERO_IMAGE, stats } from "@/data/travel-data";
import { toast } from "sonner";
import { DateSelect } from "@/components/travel/date-select";

export function Hero() {
  const { t, locale } = useI18n();
  const [destinationId, setDestinationId] = useState<string>("all");
  const [date, setDate] = useState<string>("");
  const [guests, setGuests] = useState<string>("2");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const dest = destinations.find((d) => d.id === destinationId);
    if (!dest) {
      toast.success(
        locale === "ar"
          ? "نعرض لك أفضل العروض لجميع الوجهات!"
          : locale === "fr"
            ? "Voici nos meilleures offres pour toutes les destinations !"
            : "Here are our best deals across all destinations!",
      );
    } else {
      toast.success(
        locale === "ar"
          ? `نعرض لك أفضل العروض إلى ${dest.name.ar}!`
          : locale === "fr"
            ? `Meilleures offres vers ${dest.name.fr} !`
            : `Best deals to ${dest.name.en}!`,
      );
    }
    document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col overflow-hidden"
    >
      {/* Background image with overlays */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Tropical paradise"
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent rtl:bg-gradient-to-l" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        <div className="pt-28 sm:pt-32 lg:pt-40 pb-10 sm:pb-16 max-w-3xl">
          <div className="fade-up inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-sm text-white">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{t.hero.badge}</span>
          </div>

          <h1
            className="fade-up mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]"
            style={{ animationDelay: "80ms" }}
          >
            {t.hero.title}{" "}
            <span className="block bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              {t.hero.titleAccent}
            </span>
          </h1>

          <p
            className="fade-up mt-5 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed"
            style={{ animationDelay: "160ms" }}
          >
            {t.hero.subtitle}
          </p>
        </div>

        {/* Search card */}
        <form
          onSubmit={onSearch}
          className="fade-up relative z-10 mt-auto mb-6 sm:mb-10"
          style={{ animationDelay: "240ms" }}
        >
          <div className="rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-white/30 shadow-2xl shadow-black/20 p-3 sm:p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3">
              {/* Destination */}
              <div className="md:col-span-4">
                <label className="flex items-center gap-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {t.hero.search.destination}
                </label>
                <Select value={destinationId} onValueChange={setDestinationId}>
                  <SelectTrigger className="h-12 border-0 shadow-none focus:ring-0 bg-transparent hover:bg-accent/5 text-base">
                    <SelectValue placeholder={t.hero.search.destinationPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t.sections.destinations.viewAll}
                    </SelectItem>
                    {destinations.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name[locale]} — {d.country[locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date — localized custom day/month/year selector */}
              <div className="md:col-span-4 md:border-s border-border">
                <DateSelect
                  value={date}
                  onChange={setDate}
                  ariaLabel={t.hero.search.date}
                />
              </div>

              {/* Guests */}
              <div className="md:col-span-2 md:border-s border-border">
                <label className="flex items-center gap-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  {t.hero.search.guests}
                </label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="h-12 border-0 shadow-none focus:ring-0 bg-transparent hover:bg-accent/5 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["1", "2", "3", "4", "5", "6"].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n} {Number(n) > 1 ? t.hero.search.adults : t.hero.search.adults.replace(/s$/, "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search button */}
              <div className="md:col-span-2 flex items-stretch">
                <Button
                  type="submit"
                  className="h-12 w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg gap-2 text-base"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.hero.search.button}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Stats strip */}
        <div className="fade-up grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 pb-8 sm:pb-12" style={{ animationDelay: "320ms" }}>
          {stats.map((s) => (
            <div
              key={s.id}
              className="text-center sm:text-start rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-3 sm:px-4 sm:py-4"
            >
              <div className="text-2xl sm:text-3xl font-bold text-white">{s.value}</div>
              <div className="text-xs sm:text-sm text-white/70 font-medium mt-0.5">
                {s.label[locale]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <button
        onClick={() =>
          document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })
        }
        className="absolute bottom-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
        aria-label={t.hero.scroll}
      >
        <span className="text-xs uppercase tracking-wider">{t.hero.scroll}</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
}
