import { render, screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AreasPage, { generateMetadata as areasMetadata } from '@/app/[locale]/areas/page';
import AreaPage, { generateMetadata as areaMetadata } from '@/app/[locale]/areas/[areaId]/page';
import TripIdeasPage, { generateMetadata as tripMetadata } from '@/app/[locale]/trip-ideas/page';
import sitemap from '@/app/sitemap';
import { createTravelDiagnostics } from '@/lib/travel-data/map';
import type { ITravelDataset } from '@/lib/travel-data/type';
import { messages } from '@/messages';

import { loadTravelDataset } from '../loadTravelDataset';
import { areaDescription, mapsUrl, phaseSixFixture } from './phase-six-fixture';

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn((): never => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next/navigation', () => ({ notFound }));
vi.mock('@/components/layouts', () => ({
  MainLayout: ({ children }: ComponentProps<'main'>) => <main>{children}</main>,
}));
vi.mock('@/i18n/navigation', () => ({
  Link: ({ prefetch: _prefetch, ...props }: ComponentProps<'a'> & { prefetch?: boolean }) => <a {...props} />,
}));
vi.mock('@/hooks/useTranslationsServer', () => ({
  useTranslationsServer: async (namespace: 'travel' | 'common.notFound', locale: 'vi' | 'en') => ({
    t: createTranslator({ locale, namespace, messages: messages[locale] }),
  }),
}));
vi.mock('../loadTravelDataset', () => ({ loadTravelDataset: vi.fn() }));

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
const diagnostics = createTravelDiagnostics();
const mockDataset = (dataset: ITravelDataset = phaseSixFixture) =>
  vi.mocked(loadTravelDataset).mockResolvedValue({ ok: true, dataset, diagnostics, source });
const params = (locale: 'vi' | 'en', areaId = 'son-tra') => ({ params: Promise.resolve({ locale, areaId }) });

beforeEach(() => {
  vi.resetAllMocks();
  notFound.mockImplementation(() => {
    throw new Error('NEXT_NOT_FOUND');
  });
  mockDataset();
});

describe('Areas and Trip Ideas routes', () => {
  it.each(['vi', 'en'] as const)('lists the eight source areas and runtime counts in %s', async (locale) => {
    render(await AreasPage(params(locale)));
    const links = within(screen.getByRole('main')).getAllByRole('link', {
      name: /Sơn Trà|Hải Châu|Thanh Khê|Liên Chiểu|Ngũ Hành Sơn|Cẩm Lệ|Hòa Vang|Gần Đà Nẵng/,
    });
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/areas/son-tra',
      '/areas/hai-chau',
      '/areas/thanh-khe',
      '/areas/lien-chieu',
      '/areas/ngu-hanh-son',
      '/areas/cam-le',
      '/areas/hoa-vang',
      '/areas/near-da-nang',
    ]);
    expect(links[0]).toHaveTextContent('Sơn Trà');
    expect(links[0]).toHaveTextContent('5');
    expect(links[1]).toHaveTextContent('1');
    expect(links[7]).toHaveTextContent('0');
    expect(screen.queryByText('999')).not.toBeInTheDocument();
    expect(loadTravelDataset).toHaveBeenCalledTimes(1);
  });

  it.each(['vi', 'en'] as const)(
    'renders exact membership, original description and independent links in %s',
    async (locale) => {
      render(await AreaPage(params(locale)));
      const t = messages[locale].travel;
      expect(screen.getByRole('heading', { level: 1, name: 'Sơn Trà' })).toBeVisible();
      expect(screen.getByText(/Cảnh quan/).textContent).toBe(areaDescription);
      expect(screen.queryByRole('link', { name: 'Ngoài danh mục' })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Địa điểm Hải Châu' })).not.toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: 'Quán Đỗ' }).map((link) => link.getAttribute('href'))).toEqual(
        phaseSixFixture.listings.slice(0, 2).map(({ id }) => `/places/${id}`)
      );
      for (const label of Object.values(t.statuses)) expect(screen.getByText(label)).toBeVisible();
      const map = screen.getByRole('link', { name: /Google Maps/ });
      expect(map).toHaveAttribute('href', mapsUrl);
      expect(map).toHaveAttribute('target', '_blank');
      expect(map).toHaveAttribute('rel', 'noopener noreferrer');
      expect(screen.getByRole('link', { name: t.areas.explore })).toHaveAttribute('href', '/explore?area=son-tra');
      expect(screen.getByRole('navigation').querySelector('[aria-current=page]')).toHaveTextContent('Sơn Trà');
    }
  );

  it('preserves metadata order, handles zero counts and rejects unsupported IDs', async () => {
    const areas = [...phaseSixFixture.areas].reverse();
    mockDataset({ ...phaseSixFixture, areas });
    const view = render(await AreasPage(params('en')));
    expect(
      screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/areas/'))[0]
    ).toHaveTextContent('Gần Đà Nẵng');
    view.rerender(await AreaPage(params('en', 'near-da-nang')));
    expect(screen.getByRole('status')).toHaveTextContent(messages.en.travel.areas.empty);
    expect(screen.getByRole('link', { name: messages.en.travel.areas.explore })).toHaveAttribute(
      'href',
      '/explore?area=near-da-nang'
    );
    expect(screen.queryByText(/Cảnh quan/)).not.toBeInTheDocument();
    for (const id of ['unknown', 'SON-TRA', 'Sơn Trà', 'missing']) {
      await expect(AreaPage(params('en', id))).rejects.toThrow('NEXT_NOT_FOUND');
    }
  });

  it.each(['vi', 'en'] as const)(
    'renders all 5/11/3/2 entries verbatim in %s without inferred links',
    async (locale) => {
      render(await TripIdeasPage(params(locale)));
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(messages[locale].travel.tripIdeas.title);
      const sections = screen.getAllByRole('region');
      expect(sections.map((section) => within(section).getAllByRole('article').length)).toEqual([5, 11, 3, 2]);
      for (const [index, entries] of Object.values(phaseSixFixture.editorial).entries()) {
        const articles = within(sections[index]).getAllByRole('article');
        for (const [entryIndex, entry] of entries.entries()) {
          const article = articles[entryIndex];
          expect(article.querySelector('h3')?.textContent).toBe(entry.title);
          expect(article.querySelector('p')?.textContent).toBe(entry.content);
          expect(article.querySelector('b, a')).toBeNull();
          expect(article).toHaveAttribute('lang', 'vi');
        }
      }
      expect(loadTravelDataset).toHaveBeenCalledTimes(1);
    }
  );

  it('keeps source and integrity failures distinct from 404s', async () => {
    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_NETWORK_ERROR', message: 'private source detail' },
    });
    const view = render(await AreaPage(params('en', 'unknown')));
    expect(screen.getByRole('alert')).toHaveTextContent(messages.en.travel.state.error);
    expect(screen.queryByText(/private/)).not.toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
    expect(screen.getByRole('heading', { level: 1, name: messages.en.travel.areas.title })).toBeVisible();

    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: false,
      error: { code: 'WORKBOOK_DATA_BUILD_FAILED', message: 'private parser details' },
      errors: [{ code: 'INVALID_WORKBOOK', message: 'private workbook error' }],
      diagnostics,
      source,
    });
    view.rerender(await TripIdeasPage(params('vi')));
    expect(screen.getByRole('alert')).toHaveTextContent(messages.vi.travel.state.error);
    expect(screen.queryByText(/private/)).not.toBeInTheDocument();

    mockDataset({ ...phaseSixFixture, areas: phaseSixFixture.areas.slice(1) });
    view.rerender(await AreaPage(params('en')));
    expect(screen.getByRole('alert')).toHaveTextContent(messages.en.travel.state.error);
    view.rerender(await AreasPage(params('en')));
    expect(screen.getByRole('alert')).toBeVisible();

    mockDataset({
      ...phaseSixFixture,
      editorial: { ...phaseSixFixture.editorial, itinerary: phaseSixFixture.editorial.itinerary.slice(1) },
    });
    view.rerender(await TripIdeasPage(params('vi')));
    expect(screen.getByRole('alert')).toHaveTextContent(messages.vi.travel.state.error);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('keeps non-production sitemaps empty without accessing the workbook', async () => {
    await expect(sitemap()).resolves.toEqual([]);
    expect(loadTravelDataset).not.toHaveBeenCalled();
  });

  it.each(['vi', 'en'] as const)('uses locale-specific metadata and alternates in %s', async (locale) => {
    const prefix = locale === 'en' ? '/en' : '';
    for (const [path, metadata] of [
      ['/areas', await areasMetadata(params(locale))],
      ['/areas/son-tra', await areaMetadata(params(locale))],
      ['/trip-ideas', await tripMetadata(params(locale))],
    ] as const) {
      expect(new URL(String(metadata.alternates?.canonical)).pathname).toBe(prefix + path);
      expect(new URL(String(metadata.alternates?.languages?.vi)).pathname).toBe(path);
      expect(new URL(String(metadata.alternates?.languages?.en)).pathname).toBe(`/en${path}`);
    }
    const detail = await areaMetadata(params(locale));
    expect(detail.title).toBe('Sơn Trà');
    expect(detail.description).toBe(messages[locale].travel.areas.detailMeta.replace('{area}', 'Sơn Trà'));
    expect((await areaMetadata(params(locale, 'unknown'))).robots).toMatchObject({ index: false });
  });
});
