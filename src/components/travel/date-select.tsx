"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";
import { useI18n } from "@/i18n/i18n-context";
import { cn } from "@/lib/utils";

interface DateSelectProps {
  value: string; // ISO YYYY-MM-DD
  onChange: (iso: string) => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

/**
 * Localized custom date selector (day / month / year) — replaces the native
 * <input type="date"> so the labels and month names render in the active locale.
 *
 * Internal state is held as independent day / month / year so each dropdown shows
 * its selection immediately, even before all three are picked.
 */
export function DateSelect({ value, onChange, className, id, ariaLabel }: DateSelectProps) {
  const { t, locale } = useI18n();
  const ds = t.dateSelect;

  // Parse the incoming ISO value (controlled) into the three parts.
  const [py, pm, pd] = value ? value.split("-").map(Number) : [0, 0, 0];

  // Mirror the parsed value in local state so individual dropdowns can display
  // a partial selection while the user is still choosing.
  const [y, setY] = useState<number>(py);
  const [m, setM] = useState<number>(pm);
  const [d, setD] = useState<number>(pd);

  // Keep local state in sync if the parent resets the value (e.g. modal reopen).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setY(py);
    setM(pm);
    setD(pd);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [value, py, pm, pd]);

  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear + i),
    [currentYear],
  );
  const months = ds.months; // 12 localized names
  const daysInMonth = y && m ? new Date(y, m, 0).getDate() : 31;
  const days = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  const emit = (nextY: number, nextM: number, nextD: number) => {
    if (nextY && nextM && nextD) {
      onChange(`${nextY}-${pad(nextM)}-${pad(nextD)}`);
    } else {
      onChange("");
    }
  };

  // Display value for screen readers / a11y
  const display = useMemo(() => {
    if (!value) return null;
    try {
      const date = new Date(`${value}T00:00:00`);
      if (isNaN(date.getTime())) return null;
      return `${pad(date.getDate())} ${ds.months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return null;
    }
  }, [value, ds.months]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)} dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Hidden field carries the ISO value for form/a11y */}
      <input type="hidden" id={id} value={value} readOnly />

      <label className="flex items-center gap-2 px-3 pt-2 text-xs font-semibold text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5 text-primary" />
        {t.hero.search.date}
      </label>
      <div className="flex items-stretch gap-1.5 px-3 pb-2">
        {/* Day */}
        <Select
          value={d ? String(d) : ""}
          onValueChange={(v) => {
            const nd = Number(v);
            setD(nd);
            emit(y, m, nd);
          }}
        >
          <SelectTrigger
            aria-label={`${ds.day}${ariaLabel ? " " + ariaLabel : ""}`}
            className="h-10 flex-1 text-sm"
          >
            <SelectValue placeholder={ds.selectDay} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {days.map((day) => (
              <SelectItem key={day} value={String(day)}>
                {pad(day)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Month */}
        <Select
          value={m ? String(m) : ""}
          onValueChange={(v) => {
            const nm = Number(v);
            setM(nm);
            // Clamp day if it exceeds the new month's length
            const maxD = y ? new Date(y, nm, 0).getDate() : 31;
            const nd = d > maxD ? maxD : d;
            setD(nd);
            emit(y, nm, nd);
          }}
        >
          <SelectTrigger
            aria-label={`${ds.month}${ariaLabel ? " " + ariaLabel : ""}`}
            className="h-10 flex-[1.4] text-sm"
          >
            <SelectValue placeholder={ds.selectMonth} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {months.map((name, idx) => (
              <SelectItem key={idx} value={String(idx + 1)}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={y ? String(y) : ""}
          onValueChange={(v) => {
            const ny = Number(v);
            setY(ny);
            const maxD = m ? new Date(ny, m, 0).getDate() : 31;
            const nd = d > maxD ? maxD : d;
            setD(nd);
            emit(ny, m, nd);
          }}
        >
          <SelectTrigger
            aria-label={`${ds.year}${ariaLabel ? " " + ariaLabel : ""}`}
            className="h-10 flex-1 text-sm"
          >
            <SelectValue placeholder={ds.selectYear} />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {years.map((yr) => (
              <SelectItem key={yr} value={String(yr)}>
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {display && <p className="sr-only">{display}</p>}
    </div>
  );
}
