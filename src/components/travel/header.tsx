"use client";

import { useEffect, useState } from "react";
import { Compass, Menu, X, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useI18n } from "@/i18n/i18n-context";
import { LanguageSwitcher } from "@/components/travel/language-switcher";
import { ThemeToggle } from "@/components/travel/theme-toggle";
import { useBooking } from "@/components/providers/booking-context";
import { cn } from "@/lib/utils";

const NAV_KEYS = ["destinations", "tours", "hotels", "about", "contact"] as const;

export function Header() {
  const { t, locale } = useI18n();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };

  return (
    <header
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 shrink-0"
          >
            <span className="relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
              <Compass className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
            <span className="flex flex-col leading-none">
              <span
                className={cn(
                  "text-lg sm:text-xl font-bold tracking-tight",
                  scrolled ? "text-foreground" : "text-white drop-shadow-sm",
                )}
              >
                Wanderlust
              </span>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-[0.18em] font-medium",
                  scrolled ? "text-muted-foreground" : "text-white/80",
                )}
              >
                {locale === "ar" ? "سفر وسياحة" : locale === "fr" ? "Voyages" : "Travel & Tours"}
              </span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => scrollTo(key)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-white/10",
                  scrolled
                    ? "text-foreground/80 hover:text-foreground hover:bg-accent/10"
                    : "text-white/90 hover:text-white",
                )}
              >
                {t.nav[key]}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              size="sm"
              className="hidden sm:inline-flex bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
              onClick={() =>
                openBooking({
                  packageTitle: "Custom Trip",
                  destination: "",
                  price: 0,
                })
              }
            >
              <Plane className="h-4 w-4" />
              {t.nav.bookNow}
            </Button>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={locale === "ar" ? "right" : "left"}
                className="w-[300px] sm:w-[360px] p-0"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <SheetTitle className="flex items-center gap-2 text-base font-bold">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                      <Compass className="h-4 w-4" />
                    </span>
                    Wanderlust
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" aria-label="Close">
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col p-2">
                  {NAV_KEYS.map((key) => (
                    <button
                      key={key}
                      onClick={() => scrollTo(key)}
                      className="text-start px-4 py-3 text-base font-medium rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      {t.nav[key]}
                    </button>
                  ))}
                </nav>
                <div className="p-4 border-t border-border mt-auto">
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => {
                      setMobileOpen(false);
                      openBooking({
                        packageTitle: "Custom Trip",
                        destination: "",
                        price: 0,
                      });
                    }}
                  >
                    <Plane className="h-4 w-4" />
                    {t.nav.bookNow}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
