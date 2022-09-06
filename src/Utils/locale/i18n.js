import i18n from 'i18next';
import { I18nManager } from 'react-native';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  //   en: {
  //     translation: {
  //       "Welcome to React": "Welcome to React and react-i18next"
  //     }
  //   }
  en,
  ar,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3',
    resources,
    lng: I18nManager.isRTL ? 'ar' : 'en',

    // keySeparator: true, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false,
    }
  });

export default i18n;
