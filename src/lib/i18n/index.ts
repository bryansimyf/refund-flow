import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { appConfig } from "@/config/app";

import { environment } from "@/constants/environment";

import "./types";

import enCommon from "./locales/en/common.json";
import enErrors from "./locales/en/errors.json";
import enOrder from "./locales/en/order.json";
import msCommon from "./locales/ms/common.json";
import msErrors from "./locales/ms/errors.json";
import msOrder from "./locales/ms/order.json";

export const languages = ["en", "ms"] as const;

export type AppLanguage = (typeof languages)[number];

export const fallbackLanguage: AppLanguage = "en";

const resources = {
  en: { common: enCommon, errors: enErrors, order: enOrder },
  ms: { common: msCommon, errors: msErrors, order: msOrder },
} as const;

function isAppLanguage(value: string): value is AppLanguage {
  return languages.includes(value as AppLanguage);
}

function syncDocumentLang(language: string) {
  document.documentElement.lang = language;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: environment.defaultLanguageCode || fallbackLanguage,
    defaultNS: "common",
    ns: ["common", "errors", "order"],
    returnNull: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "sessionStorage"],
      lookupQuerystring: "lang",
      lookupSessionStorage: appConfig.languageStorageKey,
      caches: ["sessionStorage"],
    },
  });

i18n.on("languageChanged", syncDocumentLang);
syncDocumentLang(i18n.language);

export function setAppLanguage(language: AppLanguage) {
  void i18n.changeLanguage(language);
  sessionStorage.setItem(appConfig.languageStorageKey, language);
  syncDocumentLang(language);
}

export function pickLocalized<T>(values: { en: T; ms: T }): T {
  const language = i18n.resolvedLanguage ?? i18n.language;

  return isAppLanguage(language) ? values[language] : values.en;
}

export { i18n };
