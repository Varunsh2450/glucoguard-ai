import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import hiTranslation from './locales/hi.json';
import knTranslation from './locales/kn.json';

i18n
  // Detects user's browser language automatically at startup
  .use(LanguageDetector)
  // Passes i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      hi: {
        translation: hiTranslation
      },
      kn: {
        translation: knTranslation
      }
    },
    // English is the default fallback language
    fallbackLng: 'en',
    // We log some details for the console in dev mode
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React handles XSS escaping automatically
    }
  });

export default i18n;
