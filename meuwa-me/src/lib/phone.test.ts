import { describe, expect, it } from 'vitest';
import {
  formatBrazilianNumber,
  isValidBrazilianMobile,
  normalizeBrazilianNumber,
  sanitizeBrazilianDigits,
} from './phone';

describe('sanitizeBrazilianDigits', () => {
  it('removes non-numeric characters and limits to 11 digits', () => {
    expect(sanitizeBrazilianDigits('+55 (84) 99192-64321')).toBe('84991926432');
  });

  it('drops leading country code when present', () => {
    expect(sanitizeBrazilianDigits('55 11 99888-7766')).toBe('11998887766');
  });

  it('returns empty string when no digits are present', () => {
    expect(sanitizeBrazilianDigits('abc')).toBe('');
  });
});

describe('formatBrazilianNumber', () => {
  it('formats digits with a space between DDD and subscriber number', () => {
    expect(formatBrazilianNumber('11998887766')).toBe('11 998887766');
  });

  it('keeps partial input without padding', () => {
    expect(formatBrazilianNumber('11')).toBe('11');
    expect(formatBrazilianNumber('1')).toBe('1');
  });

  it('returns empty string when sanitized digits are empty', () => {
    expect(formatBrazilianNumber('letters')).toBe('');
  });
});

describe('isValidBrazilianMobile', () => {
  it('validates numbers that follow the 9-digit mobile format', () => {
    expect(isValidBrazilianMobile('11 99988-7766')).toBe(true);
  });

  it('rejects numbers without the ninth digit', () => {
    expect(isValidBrazilianMobile('11 9988-7766')).toBe(false);
  });
});

describe('normalizeBrazilianNumber', () => {
  it('prefixes sanitized digits with the country code when digits are present', () => {
    expect(normalizeBrazilianNumber('11 99988-7766')).toBe('5511999887766');
  });

  it('returns empty string when no digits are provided', () => {
    expect(normalizeBrazilianNumber('')).toBe('');
  });
});
