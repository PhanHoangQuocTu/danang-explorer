import { render, screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { generateMetadata } from '@/app/[locale]/insights/page';
import { messages } from '@/messages';
import type { Translator } from '@/types/translation';

import { listing, travelFixture } from '../../Travel/__tests__/fixture';
import { loadTravelDataset } from '../../Travel/loadTravelDataset';
import { InsightsContent } from '../index';
import { InsightsChart } from '../InsightsChart';

vi.mock('next/navigation', () => ({}));
vi.mock('@/components/layouts', () => ({
  MainLayout: ({ children }: ComponentProps<'main'>) => <main>{children}</main>,
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ prefetch: _prefetch, ...props }: ComponentProps<'a'> & { prefetch?: boolean }) => <a {...props} />,
}));
vi.mock('@/hooks/useTranslationsServer', () => ({
  useTranslationsServer: async (namespace: 'travel.insights', locale: 'en' | 'vi') => ({
    t: createTranslator({ locale, namespace, messages: messages[locale] }),
  }),
}));
vi.mock('../../Travel/loadTravelDataset', () => ({ loadTravelDataset: vi.fn() }));
vi.mock('../InsightsChart', () => ({ InsightsChart: vi.fn(() => null) }));

const source = {
  source: 'google-sheets-public-export' as const,
  spreadsheetId: 'test',
  fetchedAt: '',
  contentType: null,
  contentLength: 0,
  etag: null,
  lastModified: null,
  sha256: '',
};

const diagnostics = {
  worksheetCount: 0,
  hiddenWorksheets: 0,
  formulaCells: 0,
  locRows: 0,
  locKeys: 0,
  locMatches: 0,
  parsedRows: 0,
  acceptedRows: 0,
  skippedRows: 0,
  warningRecords: 0,
  perSheet: {},
  warnings: [],
  information: [],
};

const records = [
  listing('a'.repeat(64), { rating: 5, status: 'WARNING' }),
  listing('b'.repeat(64), { rating: 5, areaId: 'unknown', areaName: 'Raw location', status: 'CLOSED_BANNED' }),
  listing('c'.repeat(64), { rating: null }),
];

const mockListings = (listings = records) =>
  vi.mocked(loadTravelDataset).mockResolvedValue({
    ok: true,
    source,
    diagnostics,
    dataset: { ...travelFixture, listings },
  });

const translator = (locale: 'vi' | 'en') =>
  createTranslator({ locale, namespace: 'travel', messages: messages[locale] }) as Translator<'travel'>;

beforeEach(() => {
  vi.clearAllMocks();
  mockListings();
});

describe('Public Travel Insights', () => {
  it.each(['vi', 'en'] as const)('renders localized figures and exact listing identities in %s', async (locale) => {
    const t = translator(locale);
    render(await InsightsContent({ locale, t }));
    expect(loadTravelDataset).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('heading', { name: t('insights.title'), level: 1 })).toBeVisible();
    const charts = vi.mocked(InsightsChart).mock.calls.map(([props]) => props);
    expect(charts.map(({ rows }) => rows.length)).toEqual([5, 9, 5, 4]);
    expect(charts.map(({ rows }) => rows.reduce((total, { count }) => total + count, 0))).toEqual([3, 3, 3, 2]);
    expect(charts[0].rows[0]).toEqual({ id: 'food-dining', label: t('categories.food-dining'), count: 3 });
    expect(charts[1].rows.find(({ id }) => id === 'hai-chau')).toEqual({ id: 'hai-chau', label: 'Hải Châu', count: 2 });
    expect(charts[1].rows.at(-1)).toEqual({ id: 'unknown', label: t('insights.unknownArea'), count: 1 });
    const chartTitles = ['category', 'area', 'status', 'rating'] as const;
    for (const [index, title] of chartTitles.entries()) {
      const region = screen.getByRole('region', { name: t(`insights.distributions.${title}.title`) });
      const table = within(region).getByRole('table');
      expect(within(table).getAllByRole('row')).toHaveLength(charts[index].rows.length + 1);
      for (const { label, count } of charts[index].rows) {
        const row = within(table).getByRole('row', { name: `${label} ${count}` });
        expect(row).toBeVisible();
      }
    }
    const top = screen.getByRole('region', { name: t('insights.top.title') });
    expect(
      within(top)
        .getAllByRole('link', { name: records[0].name })
        .map((a) => a.getAttribute('href'))
    ).toEqual(records.slice(0, 2).map(({ id }) => `/places/${id}`));
    expect(within(top).getByText(t('statuses.WARNING'))).toBeVisible();
    expect(within(top).getByText(t('statuses.CLOSED_BANNED'))).toBeVisible();
    expect(within(top).getByText('Hải Châu')).toBeVisible();
    expect(screen.queryByText('Raw location')).not.toBeInTheDocument();
  });

  it('separates empty data, unrated data, and connector or parser failures', async () => {
    const t = translator('en');
    const props = { locale: 'en' as const, t };
    mockListings([]);
    const view = render(await InsightsContent(props));
    expect(screen.getByRole('status')).toHaveTextContent(t('state.empty'));
    expect(screen.getByText(t('insights.unavailable'))).toBeVisible();
    expect(screen.getByRole('heading', { name: t('insights.method.title') })).toBeVisible();
    expect(InsightsChart).not.toHaveBeenCalled();

    mockListings([records[2]]);
    view.rerender(await InsightsContent(props));
    expect(screen.getByText(t('insights.ratingEmpty'))).toBeVisible();
    expect(screen.getByText(t('insights.top.empty'))).toBeVisible();
    expect(screen.getByText('0%')).toBeVisible();

    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_NETWORK_ERROR', message: 'private details' },
    });
    view.rerender(await InsightsContent(props));
    expect(screen.getByRole('alert')).toHaveTextContent(t('state.error'));
    expect(screen.queryByText('private details')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: false,
      error: { code: 'WORKBOOK_DATA_BUILD_FAILED', message: 'private parser details' },
      errors: [{ code: 'INVALID_WORKBOOK', message: 'private workbook details' }],
      diagnostics,
      source,
    });
    view.rerender(await InsightsContent(props));
    expect(screen.getByRole('alert')).toHaveTextContent(t('state.error'));
    expect(screen.queryByText(/private/)).not.toBeInTheDocument();
  });

  it.each(['vi', 'en'] as const)('registers localized canonical metadata in %s', async (locale) => {
    const prefix = locale === 'vi' ? '' : '/en';
    const meta = await generateMetadata({ params: Promise.resolve({ locale }) });
    expect(meta.title).toBe(translator(locale)('insights.title'));
    expect(new URL(String(meta.alternates?.canonical)).pathname).toBe(`${prefix}/insights`);
    expect(new URL(String(meta.alternates?.languages?.vi)).pathname).toBe('/insights');
    expect(new URL(String(meta.alternates?.languages?.en)).pathname).toBe('/en/insights');
    expect(loadTravelDataset).not.toHaveBeenCalled();
  });
});
