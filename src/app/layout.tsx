import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cairo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/i18n/i18n-context";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const arabic = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wanderlust — Premium Travel & Tour Booking",
  description:
    "Discover and book handcrafted journeys to 180+ destinations. Best price guarantee, 24/7 multilingual support, expert local guides.",
  keywords: [
    "travel booking",
    "tour packages",
    "honeymoon",
    "vacation",
    "حجوزات سفر",
    "حجز فنادق",
    "réservation voyage",
  ],
  authors: [{ name: "Wanderlust Travel" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Wanderlust — Premium Travel & Tour Booking",
    description: "Handcrafted journeys to the world's most breathtaking destinations.",
    siteName: "Wanderlust",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${arabic.variable} ${mono.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "var(--font-arabic), var(--font-sans), system-ui, sans-serif" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <Toaster />
            <Sonner richColors closeButton position="top-center" />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
