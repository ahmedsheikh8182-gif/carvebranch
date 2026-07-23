/**
 * Carve i18n & currency architecture.
 *
 * Defaults to PKR / en-PK. The config object is the single place to add
 * new locales — no further refactoring is required elsewhere.
 *
 * Usage:
 *   const { formatPrice } = useLocale();
 *   <span>{formatPrice(product.price)}</span>
 */

export interface LocaleConfig {
  currency: string;
  locale: string;
  currencySymbol: string;
}

const LOCALES: Record<string, LocaleConfig> = {
  "en-PK": {
    currency: "PKR",
    locale: "en-PK",
    currencySymbol: "PKR",
  },
  // Future locales — uncomment and extend as needed:
  // "en-AE": { currency: "AED", locale: "en-AE", currencySymbol: "AED" },
  // "en-US": { currency: "USD", locale: "en-US", currencySymbol: "$" },
};

const DEFAULT_LOCALE = "en-PK";
const STORAGE_KEY = "CARVE_LOCALE";

function getStoredLocale(): LocaleConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALES[stored]) return LOCALES[stored];
  } catch {
    // SSR / private browsing
  }
  return LOCALES[DEFAULT_LOCALE];
}

/**
 * Returns the active locale config and a `formatPrice` helper.
 * Reads from `CARVE_LOCALE` localStorage key; defaults to PKR / en-PK.
 *
 * This is intentionally a simple module-level function (not a React hook)
 * so it can be used outside components too. Call it wherever you need price
 * formatting.
 */
export function useLocale() {
  const config = getStoredLocale();

  function formatPrice(amount: number): string {
    return `${config.currencySymbol}\u00A0${amount.toLocaleString(config.locale)}`;
  }

  return {
    ...config,
    formatPrice,
  };
}

/**
 * Standalone helper for price formatting — usable outside React.
 */
export function formatPrice(amount: number): string {
  const config = getStoredLocale();
  return `${config.currencySymbol}\u00A0${amount.toLocaleString(config.locale)}`;
}
