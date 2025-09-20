export const getUserLocale = () =>
  (typeof navigator !== 'undefined' && (navigator as any).language) || 'en-US';

export const fmtMoney = (v: number, ccy: string, locale = getUserLocale()) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: ccy,
    minimumFractionDigits: 2,
  }).format(v);

export const parseMoney = (s: string | number) => {
  if (typeof s === 'number') return s;
  const t = String(s || '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
};

