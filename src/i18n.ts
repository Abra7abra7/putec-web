import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !['sk', 'en'].includes(locale)) {
    locale = 'sk';
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
