import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ru', 'uz', 'tg', 'ky'],
  defaultLocale: 'ru',
  localePrefix: 'never' // Отключить префикс локали в URL
});
