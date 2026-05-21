import en from "@/messages/en.json";
import ko from "@/messages/ko.json";
import type { Locale, Messages } from "./types";

export const messagesByLocale: Record<Locale, Messages> = {
  en,
  ko,
};
