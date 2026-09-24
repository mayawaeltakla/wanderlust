"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Tour } from "@/lib/types";

export interface BookingPreset {
  packageTitle: string;
  destination: string;
  price: number; // per-person base price
  durationDays?: number;
}

interface BookingCtx {
  open: boolean;
  preset: BookingPreset | null;
  openBooking: (preset: BookingPreset) => void;
  closeBooking: () => void;
}

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<BookingPreset | null>(null);

  const openBooking = (p: BookingPreset) => {
    setPreset(p);
    setOpen(true);
  };
  const closeBooking = () => setOpen(false);

  return (
    <Ctx.Provider value={{ open, preset, openBooking, closeBooking }}>
      {children}
    </Ctx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}

export function tourToPreset(t: Tour): BookingPreset {
  return {
    packageTitle: t.title.en, // overwritten by localized title at call site
    destination: t.destinationId,
    price: t.price,
    durationDays: t.durationDays,
  };
}
