import { render, screen, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { AnchorHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useTranslations } from '@/hooks';
import { messages } from '@/messages';
import { FooterView } from '../FooterView';
import { getCurrentLink } from '../navigation';

vi.mock('@/i18n/navigation', () => ({
  Link: ({ prefetch: _prefetch, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: boolean }) => (
    <a {...props} />
  ),
}));

const Footer = () => {
  const { t } = useTranslations('common');
  const { t: travel } = useTranslations('travel');
  return <FooterView t={t} travel={travel} />;
};

describe('travel shell', () => {
  it.each(['vi', 'en'] as const)('renders the guide and owner links in %s', (locale) => {
    const { shell } = messages[locale].common;
    render(
      <NextIntlClientProvider locale={locale} messages={messages[locale]}>
        <Footer />
      </NextIntlClientProvider>
    );
    expect(
      within(screen.getByRole('navigation', { name: shell.guide }))
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/', '/explore', '/areas', '/trip-ideas', '/insights']);
    expect(screen.getByRole('region', { name: shell.owner })).toHaveTextContent('Phan Hoàng Quốc Tú');
    expect(screen.getByRole('link', { name: 'tuphan694@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:tuphan694@gmail.com'
    );
    for (const [name, href] of [
      ['Facebook', 'https://www.facebook.com/phanhoangquoctu/'],
      ['LinkedIn', 'https://www.linkedin.com/in/phanhoangquoctu/'],
    ] as const) {
      const link = screen.getByRole('link', { name });
      expect(link).toHaveAttribute('href', href);
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('distinguishes the current page from the section containing a detail page', () => {
    expect(getCurrentLink('/areas', '/areas')).toBe('page');
    expect(getCurrentLink('/areas', '/areas/hai-chau')).toBe('location');
    expect(getCurrentLink('/explore', '/places/abc')).toBe('location');
    expect(getCurrentLink('/', '/areas')).toBeUndefined();
    expect(getCurrentLink('/explore', '/areas/hai-chau')).toBeUndefined();
  });
});
