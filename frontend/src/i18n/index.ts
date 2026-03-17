import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import esCommon from "./locales/es/common.json";

export const supportedLngs = ["es"] as const;
export type SupportedLng = (typeof supportedLngs)[number];

export const namespaces = ["common"] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: esCommon,
      },
    },
    supportedLngs: [...supportedLngs],
    fallbackLng: "es",
    defaultNS: "common",
    ns: [...namespaces],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },
  });

export default i18n;
