"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Destination, Tour } from "@/lib/types";

type Detail =
  | { kind: "destination"; destination: Destination }
  | { kind: "tour"; tour: Tour }
  | null;

interface DetailCtx {
  detail: Detail;
  openDestination: (d: Destination) => void;
  openTour: (t: Tour) => void;
  close: () => void;
}

const Ctx = createContext<DetailCtx | null>(null);

export function DetailProvider({ children }: { children: ReactNode }) {
  const [detail, setDetail] = useState<Detail>(null);

  const openDestination = (d: Destination) =>
    setDetail({ kind: "destination", destination: d });
  const openTour = (t: Tour) => setDetail({ kind: "tour", tour: t });
  const close = () => setDetail(null);

  return (
    <Ctx.Provider value={{ detail, openDestination, openTour, close }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDetail() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDetail must be used within DetailProvider");
  return ctx;
}
