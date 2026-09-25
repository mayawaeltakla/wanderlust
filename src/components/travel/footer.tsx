"use client";

import { Compass, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";

export function Footer() {
  const { t, locale } = useI18n();
  const y = new Date().getFullYear();

  const quickLinks = [
    { key: "about", href: "#about" },
    { key: "destinations", href: "#destinations" },
    { key: "tours", href: "#tours" },
    { key: "hotels", href: "#hotels" },
    { key: "blog", href: "#" },
    { key: "press", href: "#" },
  ];

  const supportLinks = [
    { key: "help", href: "#" },
    { key: "cancellations", href: "#" },
    { key: "safety", href: "#" },
    { key: "faq", href: "#" },
    { key: "careers", href: "#" },
  ];

  const socials = [
    { Icon: Facebook, label: "Facebook" },
    { Icon: Twitter, label: "Twitter" },
    { Icon: Instagram, label: "Instagram" },
    { Icon: Youtube, label: "YouTube" },
  ];

  return (
    <footer className="mt-auto bg-card border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12 sm:py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                <Compass className="h-5 w-5" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold">Wanderlust</span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {locale === "ar" ? "سفر وسياحة" : locale === "fr" ? "Voyages" : "Travel & Tours"}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.sections.footer.tagline}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              {t.sections.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.key}>
                  <a
                    href={l.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t.sections.footer.links[l.key as keyof typeof t.sections.footer.links]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              {t.sections.footer.support}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((l) => (
                <li key={l.key}>
                  <a
                    href={l.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t.sections.footer.links[l.key as keyof typeof t.sections.footer.links]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
              {t.sections.footer.contact}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span className="text-muted-foreground">
                  {t.sections.footer.links.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`tel:${t.sections.footer.links.phone}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  dir="ltr"
                >
                  {t.sections.footer.links.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`mailto:${t.sections.footer.links.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors break-all"
                  dir="ltr"
                >
                  {t.sections.footer.links.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment + copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs text-muted-foreground me-2">
              {t.sections.footer.payments}:
            </span>
            {["VISA", "Mastercard", "Amex", "PayPal", "ApplePay"].map((p) => (
              <span
                key={p}
                className="rounded-md bg-muted px-2 py-1 text-[10px] font-bold text-muted-foreground tracking-wide"
              >
                {p}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-end">
            © {y} Wanderlust Travel · {t.sections.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
