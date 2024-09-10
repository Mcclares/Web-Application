import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Импорт переводов
import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';
import et from './locales/et/translation.json';

i18n
  .use(initReactI18next) // инициализация react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      ru: {
        translation: ru
      },
      et: {
        translation: et
      }
    },
    lng: 'en', // Язык по умолчанию
    fallbackLng: 'en', // Язык на случай, если перевод не найден
    interpolation: {
      escapeValue: false // React уже защищает от XSS
    }
  });

export default i18n;