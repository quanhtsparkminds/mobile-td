import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import { storage, StorageKeys } from "@/utils";
import { SupportedLngs } from "./i18n.types";

import { en } from "./en";
import { vi } from "./vi";

export const defaultNS = "common" as const;
export const resources = { en, vi } as const;

const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: async (callback) => {
    const result = storage.getString(StorageKeys.lng) ?? SupportedLngs.en;
    callback(result);
    return result;
  },
  cacheUserLanguage: (lng) => {
    storage.set(StorageKeys.lng, lng);
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      // fallbackLng: SupportedLngs.en,
      compatibilityJSON: "v4",
      defaultNS,
      resources,
      debug: __DEV__,
      cache: { enabled: true },
    });
}

export default i18n;
