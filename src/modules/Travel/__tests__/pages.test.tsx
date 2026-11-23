import { fireEvent, render, screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createTravelDiagnostics } from '@/lib/travel-data/map';
import { messages } from '@/messages';
import type { Translator } from '@/types/translation';

import { ExploreContent } from '../../Explore';
import { HomeContent } from '../../Home';
import { loadTravelDataset } from '../loadTravelDataset';
import { TravelState } from '../TravelState';
import { listing, travelFixture } from './fixture';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ prefetch: _prefetch, ...props }: ComponentProps<'a'> & { prefetch?: boolean }) => <a {...props} />,
  getPathname: ({ locale, href }: { locale: string; href: string }) => (locale === 'vi' ? href : `/${locale}${href}`),
  useRouter: () => ({ push }),
}));
vi.mock('../loadTravelDataset', () => ({ loadTravelDataset: vi.fn() }));

const mockDataset = (dataset = travelFixture) =>
  vi.mocked(loadTravelDataset).mockResolvedValue({
    ok: true,
    dataset,
    diagnostics: createTravelDiagnostics(),
    source: {
      source: 'google-sheets-public-export',
      spreadsheetId: 'test',
      fetchedAt: '2026-01-01T00:00:00Z',
      contentType: null,
      contentLength: 0,
      etag: null,
      lastModified: null,
      sha256: '',
    },
  });
const translator = (locale: 'vi' | 'en') =>
  createTranslator({ locale, namespace: 'travel', messages: messages[locale] }) as Translator<'travel'>;

afterEach(() => vi.resetAllMocks());

describe('Home and Explore', () => {
  it.each([
    ['vi', 'Khám phá Đà Nẵng', '/explore'],
    ['en', 'Discover Đà Nẵng', '/en/explore'],
  ] as const)('renders Home in %s with localized search and original editorial text', async (locale, title, action) => {
    mockDataset();
    const t = translator(locale);
    render(await HomeContent({ locale, t }));
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeVisible();
    const form = screen.getByRole<HTMLFormElement>('search');
    expect(form).toHaveAttribute('action', action);
    fireEvent.change(screen.getByRole('searchbox', { name: t('search.label') }), { target: { value: 'Đà Nẵng' } });
    expect(new FormData(form).get('q')).toBe('Đà Nẵng');
    expect(screen.getByRole('link', { name: `Hải Châu, ${t('explore.results', { count: 2 })}` })).toHaveAttribute(
      'href',
      '/explore?area=hai-chau'
    );
    expect(
      screen.getByRole('link', { name: `${t('categories.food-dining')}, ${t('explore.results', { count: 1 })}` })
    ).toHaveAttribute('href', '/explore?category=food-dining');
    expect(screen.getByText('Thử món địa phương vào buổi tối.')).toBeVisible();
    expect(screen.queryByText('999')).not.toBeInTheDocument();
    expect(loadTravelDataset).toHaveBeenCalledTimes(1);
  });

  it.each(['grid', 'list', 'table'])(
    'shows the same matching listing in %s and uses its original Maps URL',
    async (view) => {
      mockDataset();
      const query = new URLSearchParams({ q: 'Quan Do', view });
      render(await ExploreContent({ locale: 'en', query, t: translator('en') }));
      expect(screen.getByRole('heading', { name: '1 place' })).toBeVisible();
      expect(screen.getByText('Quán Đỗ')).toBeVisible();
      expect(screen.queryByText('Bãi biển Mỹ Khê')).not.toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Google Maps for Quán Đỗ' })).toHaveAttribute(
        'href',
        travelFixture.listings[0].mapsUrl
      );
      const links = within(screen.getByRole('navigation', { name: 'Results view' }));
      expect(links.getByRole('link', { name: 'List' })).toHaveAttribute('href', '/explore?q=Quan+Do&view=list');
      if (view === 'table') expect(screen.getByRole('table', { name: 'Table' })).toBeVisible();
    }
  );

  it('preserves filters in view and page links and resets page when submitting the form', async () => {
    mockDataset({ ...travelFixture, listings: Array.from({ length: 25 }, (_, index) => listing(String(index))) });
    const query = new URLSearchParams({
      q: 'quan do',
      page: '2',
      category: 'food-dining',
      area: 'hai-chau',
      ref: 'test',
      campaign: '',
    });
    render(await ExploreContent({ locale: 'en', query, t: translator('en') }));
    expect(screen.getByText('Page 2 of 2')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Table' })).toHaveAttribute(
      'href',
      '/explore?ref=test&campaign=&q=quan+do&category=food-dining&area=hai-chau&view=table&page=2'
    );
    expect(screen.getByRole('link', { name: 'Previous' })).toHaveAttribute(
      'href',
      '/explore?ref=test&campaign=&q=quan+do&category=food-dining&area=hai-chau'
    );
    expect(screen.getByRole('link', { name: 'Clear all' })).toHaveAttribute('href', '/explore?ref=test&campaign=');
    fireEvent.submit(screen.getByRole('form', { name: 'Filters' }));
    expect(push).toHaveBeenCalledWith('/explore?ref=test&campaign=&q=quan+do&category=food-dining&area=hai-chau');
    expect(screen.queryByRole('link', { name: /Google Maps for/ })).not.toBeInTheDocument();
  });

  it('distinguishes loading, source failure, valid empty data and empty filtered results', async () => {
    const t = translator('vi');
    const view = render(<TravelState t={t} state='loading' />);
    expect(screen.getByRole('status')).toHaveTextContent(t('state.loading'));
    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_NETWORK_ERROR', message: 'Internal error' },
    });
    view.rerender(await ExploreContent({ t, locale: 'vi', query: new URLSearchParams() }));
    expect(screen.getByRole('alert')).toHaveTextContent(t('state.error'));
    expect(screen.queryByText('Internal error')).not.toBeInTheDocument();
    mockDataset({ ...travelFixture, listings: [] });
    view.rerender(await ExploreContent({ t, locale: 'vi', query: new URLSearchParams() }));
    expect(screen.getByRole('status')).toHaveTextContent(t('state.empty'));
    mockDataset();
    view.rerender(await ExploreContent({ t, locale: 'vi', query: new URLSearchParams({ q: 'no matches' }) }));
    expect(screen.getByText(t('explore.empty'))).toBeVisible();
    expect(screen.getAllByRole('link', { name: t('explore.clear') })).toHaveLength(2);
  });
});
