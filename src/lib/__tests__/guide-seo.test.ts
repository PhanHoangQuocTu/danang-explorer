import { createTranslator } from 'next-intl';

import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { createTravelDiagnostics } from '@/lib/travel-data/map';
import { messages } from '@/messages';
import { phaseSixFixture } from '@/modules/Travel/__tests__/phase-six-fixture';
import { loadTravelDataset } from '@/modules/Travel/loadTravelDataset';
import type { Namespace } from '@/types/translation';
import { getExploreSeo } from '../guide-seo';
import { getSocialImage } from '../og-image';
import { getRobots } from '../seo';

vi.mock('@/constants/env', () => ({ isProductionEnv: true, env: { APP_URL: 'https://guide.example' } }));
vi.mock('@/modules/Travel/loadTravelDataset', () => ({ loadTravelDataset: vi.fn() }));
vi.mock('@/hooks/useTranslationsServer', () => ({
  useTranslationsServer: (namespace: Namespace, locale: 'en' | 'vi') => ({
    t: createTranslator({ locale, namespace, messages: messages[locale] }),
  }),
}));
// Exercise route input, source lookup and cache policy separately from the Next.js PNG renderer.
vi.mock('next/og', () => ({
  ImageResponse: class extends Response {
    constructor(_element: unknown, options: ResponseInit) {
      super(null, options);
    }
  },
}));

const image = (query: string) => getSocialImage(new Request(`https://guide.example/opengraph-image${query}`));
const source = {
  source: 'google-sheets-public-export' as const,
  spreadsheetId: 'fixture',
  fetchedAt: '',
  contentType: null,
  contentLength: 0,
  etag: null,
  lastModified: null,
  sha256: '',
};
beforeEach(() => {
  vi.mocked(loadTravelDataset)
    .mockReset()
    .mockResolvedValue({
      ok: true,
      dataset: { ...phaseSixFixture, listings: Array.from({ length: 25 }, () => phaseSixFixture.listings[0]!) },
      source,
      diagnostics: createTravelDiagnostics(),
    });
});

describe('production crawl policy', () => {
  it('publishes localized, deduplicated sitemap URLs for real areas and places', async () => {
    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: true,
      dataset: phaseSixFixture,
      source,
      diagnostics: createTravelDiagnostics(),
    });
    const entries = await sitemap();
    const paths = entries.map(({ url }) => new URL(url).pathname);
    const routes = [
      '/insights',
      '/areas',
      '/trip-ideas',
      ...phaseSixFixture.areas.map(({ areaId }) => `/areas/${areaId}`),
      ...phaseSixFixture.listings.map(({ id }) => `/places/${id}`),
    ];
    expect(paths).toEqual(expect.arrayContaining(routes.flatMap((route) => [route, `/en${route}`])));
    expect(paths.filter((path) => /\/(areas|trip-ideas)\b/.test(path))).toHaveLength(20);
    expect(new Set(paths).size).toBe(paths.length);
    expect(entries.every((entry) => !entry.lastModified && entry.alternates?.languages?.['x-default'])).toBe(true);
  });

  it('signals a temporary sitemap failure when the source is unavailable', async () => {
    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_NETWORK_ERROR', message: 'private details' },
    });
    await expect(sitemap()).rejects.toThrow('temporarily unavailable');
  });

  it('allows public pages and omits API endpoints from the crawl space', () => {
    expect(robots()).toMatchObject({
      rules: { allow: '/', disallow: ['/api/', '/proxy/'] },
      sitemap: 'https://guide.example/sitemap.xml',
    });
    expect(getRobots()).toMatchObject({ index: true, follow: true });
    expect(getRobots(true, true)).toMatchObject({ index: false, follow: true });
  });

  it('self-canonicalizes a real page of unfiltered results', async () => {
    expect(await getExploreSeo('en', {})).toMatchObject({ path: '/explore', noIndex: false });
    expect(await getExploreSeo('en', { page: '2' })).toMatchObject({ path: '/explore?page=2', noIndex: false });
    expect(await getExploreSeo('vi', { page: '3' })).toMatchObject({ path: '/explore', noIndex: true });
  });

  it.each([{ page: '1' }, { page: '02' }, { page: ['2', '3'] }, { q: 'Đà' }, { page: '2', view: 'list' }])(
    'keeps query variant %j out of the index without reading the workbook',
    async (query) => {
      expect(await getExploreSeo('vi', query)).toMatchObject({ path: '/explore', noIndex: true });
      expect(loadTravelDataset).not.toHaveBeenCalled();
    }
  );
});

describe('social preview routes', () => {
  it.each(['?locale=fr', '?locale=en&locale=vi', '?title=arbitrary', `?path=${'a'.repeat(513)}`])(
    'rejects malformed query %s without a source read',
    async (query) => {
      const response = await image(query);
      expect(response.status).toBe(400);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(loadTravelDataset).not.toHaveBeenCalled();
    }
  );

  it('serves trusted page images and distinguishes missing IDs from upstream failure', async () => {
    expect((await image('?locale=en&path=/explore')).headers.get('cache-control')).toContain('s-maxage=300');
    expect((await image('?locale=vi&path=/unknown')).status).toBe(404);
    expect((await image(`?path=/places/${'f'.repeat(64)}`)).status).toBe(404);
    expect((await image('?locale=vi&path=/areas/son-tra')).status).toBe(200);
    vi.mocked(loadTravelDataset).mockResolvedValue({
      ok: false,
      error: { code: 'WORKBOOK_SOURCE_NETWORK_ERROR', message: 'fixture' },
    });
    const response = await image('?path=/areas/son-tra');
    expect(response.status).toBe(503);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
});
