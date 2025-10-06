const BRAZIL_MOBILE_REGEX = /^[1-9]{2}9\d{8}$/;

export const sanitizeBrazilianDigits = (value: string) => {
  const digits = value.replace(/\D/g, '');
  const withoutCountry = digits.startsWith('55') ? digits.slice(2) : digits;
  return withoutCountry.slice(0, 11);
};

export const formatBrazilianNumber = (value: string) => {
  const digits = sanitizeBrazilianDigits(value);
  if (!digits) return '';
  if (digits.length <= 2) {
    return digits;
  }
  const ddd = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  return subscriber ? `${ddd} ${subscriber}` : ddd;
};

export const isValidBrazilianMobile = (value: string) => {
  const digits = sanitizeBrazilianDigits(value);
  return BRAZIL_MOBILE_REGEX.test(digits);
};

export const normalizeBrazilianNumber = (value: string) => {
  const digits = sanitizeBrazilianDigits(value);
  return digits ? `55${digits}` : '';
};
