"use client";

import { Globe, Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-context";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, locales, setLocale, meta } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className="gap-2 font-medium"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          {!compact && (
            <span className="hidden sm:inline">{meta.labelNative}</span>
          )}
          {!compact && <ChevronDown className="h-3 w-3 opacity-60" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[180px]"
        sideOffset={8}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
          {meta.flag} Language
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => setLocale(l.code)}
            className="cursor-pointer justify-between gap-2"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{l.flag}</span>
              <span className="font-medium">{l.labelNative}</span>
              <span className="text-xs text-muted-foreground">({l.label})</span>
            </span>
            {locale === l.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
