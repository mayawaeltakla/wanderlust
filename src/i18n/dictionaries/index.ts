import type { Locale } from "@/lib/types";
import en, { type Dict } from "./en";
import ar from "./ar";
import fr from "./fr";
import tr from "./tr";
import ru from "./ru";
import zh from "./zh";

export type { Dict };

export const dictionaries: Record<Locale, Dict> = {
  en,
  ar,
  fr,
  tr,
  ru,
  zh,
};

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? en;
}

export { default as en } from "./en";
export { default as ar } from "./ar";
export { default as fr } from "./fr";
export { default as tr } from "./tr";
export { default as ru } from "./ru";
export { default as zh } from "./zh";
