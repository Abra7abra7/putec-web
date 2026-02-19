export const locales = ['sk', 'en'] as const;
export const defaultLocale = 'sk' as const;
export const localePrefix = 'as-needed'; // 'never' prevents creating /sk/, but we need prefix for /en/
