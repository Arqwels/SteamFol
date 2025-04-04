type FormatNumberOptions = {
  locale?: string; // Локаль, по умолчанию 'ru-RU'
  currency?: string; // Код валюты, если нужен
};

export const formatNumber = (
  number: number,
  options: FormatNumberOptions = {}
): string => {
  const { locale = 'ru-RU', currency = 'RUB' } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: currency ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: 0, // Минимальное количество знаков после запятой (0)
    maximumFractionDigits: 2,
  });

  return formatter.format(number);
};
