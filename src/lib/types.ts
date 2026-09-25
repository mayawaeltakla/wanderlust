// Centralized type definitions for the travel booking platform

export type Locale = "ar" | "en" | "fr" | "tr" | "ru" | "zh";

export interface LocaleMeta {
  code: Locale;
  label: string;
  labelNative: string;
  dir: "rtl" | "ltr";
  flag: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: "ar", label: "Arabic", labelNative: "العربية", dir: "rtl", flag: "🇸🇦" },
  { code: "en", label: "English", labelNative: "English", dir: "ltr", flag: "🇬🇧" },
  { code: "fr", label: "French", labelNative: "Français", dir: "ltr", flag: "🇫🇷" },
  { code: "tr", label: "Turkish", labelNative: "Türkçe", dir: "ltr", flag: "🇹🇷" },
  { code: "ru", label: "Russian", labelNative: "Русский", dir: "ltr", flag: "🇷🇺" },
  { code: "zh", label: "Chinese", labelNative: "中文", dir: "ltr", flag: "🇨🇳" },
];

export interface Destination {
  id: string;
  slug: string;
  name: Record<Locale, string>;
  country: Record<Locale, string>;
  image: string;
  priceFrom: number;
  rating: number;
  reviews: number;
  tag: "beach" | "city" | "mountain" | "cultural";
  tours: number;
  // Detail data
  overview: Record<Locale, string>;
  bestTime: Record<Locale, string>;
  currency: string;
  capital: Record<Locale, string>;
  language: Record<Locale, string>;
  visa: Record<Locale, string>;
  timezone: string;
  gallery: string[];
}

export interface TourItineraryDay {
  day: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export interface Tour {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  image: string;
  durationDays: number;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: "beach" | "cultural" | "adventure" | "honeymoon";
  includes: Record<Locale, string[]>;
  destinationId: string;
  // Detail data
  overview: Record<Locale, string>;
  itinerary: TourItineraryDay[];
  highlights: Record<Locale, string[]>;
  goodToKnow: Record<Locale, string[]>;
  groupSize: string;
  difficulty: "easy" | "moderate" | "challenging";
  gallery: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: Record<Locale, string>;
  image: string;
  pricePerNight: number;
  rating: number;
  reviews: number;
  stars: number;
  amenities: string[];
  badge?: Record<Locale, string>;
}

export interface Testimonial {
  id: string;
  name: string;
  country: string;
  flag: string;
  rating: number;
  avatarColor: string;
  text: Record<Locale, string>;
  trip: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export interface Stat {
  id: string;
  value: string;
  label: Record<Locale, string>;
}

export interface BookingPayload {
  fullName: string;
  email: string;
  phone: string;
  packageTitle: string;
  destination: string;
  travelDate: string;
  travelers: number;
  notes?: string;
  totalPrice: number;
  locale: Locale;
}
