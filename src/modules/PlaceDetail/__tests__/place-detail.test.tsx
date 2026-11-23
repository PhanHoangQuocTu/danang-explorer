import { render, screen, within } from '@testing-library/react';
import { createTranslator } from 'next-intl';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PlacePage, { generateMetadata } from '@/app/[locale]/places/[id]/page';
import { createTravelDiagnostics } from '@/lib/travel-data/map';
import { messages } from '@/messages';
import type { Translator } from '@/types/translation';

import { ExploreResults } from '../../Explore/ExploreResults';
import { listing, travelFixture } from '../../Travel/__tests__/fixture';
import { loadTravelDataset } from '../../Travel/loadTravelDataset';
import { PlaceDetailView } from '../PlaceDetailView';

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
  useTranslationsServer: async (namespace: 'travel' | 'common.seo', locale: 'vi' | 'en') => ({
    t: createTranslator({ locale: locale ?? 'vi', namespace, messages: messages[locale ?? 'vi'] }),
  }),
}));
vi.mock('../../Travel/loadTravelDataset', () => ({ loadTravelDataset: vi.fn() }));

const id = '1'.repeat(64);
const otherId = '2'.repeat(64);
const notes = `  Cẩn trọng! <strong>Giữ nguyên</strong> & "chữ".
Dòng thứ hai.

${'Đoạn dài, không cắt bớt. '.repeat(30)}  `;
const place = listing(id, {
  notesText: notes,
  status: 'WARNING',
  address: 'Đường Bạch Đằng\n  Cổng phụ',
  priceText: '50.000đ / lượt\nCuối tuần: 60.000đ',
  openingHoursText: '09:00–17:00\nNghỉ thứ Hai',
  highlightsText: 'Bờ sông\n  Cảnh buổi tối',
  mapsUrl: 'https://maps.app.goo.gl/example?source=workbook',
});
const duplicate = listing(otherId, { sourceSheet: '4_Hai_San_Nha_Hang', notesText: 'Ghi chú riêng.' });

const translator = (locale: 'vi' | 'en') =>
  createTranslator({ locale, namespace: 'travel', messages: messages[locale] }) as Translator<'travel'>;
const props = (id: string, locale = 'vi') => ({ params: Promise.resolve({ locale, id }) });
const diagnostics = createTravelDiagnostics();
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

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(loadTravelDataset).mockResolvedValue({
    ok: true,
    dataset: { ...travelFixture, listings: [place, duplicate] },
    diagnostics,
    source,
  });
});

describe('Place Detail', () => {
  it('resolves same-name listings separately and matches only the original ID', async () => {
    const view = render(await PlacePage(props(id)));
    expect(screen.getByRole('heading', { level: 1, name: place.name })).toBeVisible();
    expect(screen.getByText(/Cẩn trọng/)).toHaveProperty('textContent', notes);
    view.rerender(await PlacePage(props(otherId)));
    expect(screen.getByText('Ghi chú riêng.')).toBeVisible();
    await expect(PlacePage(props(place.name))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(PlacePage(props('3'.repeat(64)))).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(PlacePage(props('A'.repeat(64)))).rejects.toThrow('NEXT_NOT_FOUND');
  });

  it.each(['vi', 'en'] as const)('preserves source content and localizes labels in %s', (locale) => {
    const t = translator(locale);
    render(<PlaceDetailView t={t} locale={locale} listing={place} />);
    const heading = locale === 'vi' ? 'Ghi chú & lưu ý' : 'Notes & Important Information';
    const section = screen.getByRole('region', { name: heading });
    expect(within(section).getByText(/Cẩn trọng/).textContent).toBe(notes);
    expect(section.querySelector('strong')).toBeNull();
    expect(screen.getByText(locale === 'vi' ? 'Tạm dừng / Cảnh báo' : 'Paused / Warning')).toBeVisible();
    expect(screen.getByText(t('categories.food-dining'))).toBeVisible();
    expect(screen.getByText('Hải Châu')).toBeVisible();
    expect(screen.queryByText('Sơn Trà')).not.toBeInTheDocument();
    for (const value of [
      place.sourceCategory,
      place.address,
      place.priceText,
      place.openingHoursText,
      place.highlightsText,
      ...Object.values(place.visitProfile ?? {}),
    ]) {
      expect(screen.getByText((_, element) => element?.textContent === value).textContent).toBe(value);
    }
    const map = screen.getByRole('link', { name: /Google Maps/ });
    expect(map.getAttribute('href')).toBe(place.mapsUrl);
    expect(map).toHaveAttribute('target', '_blank');
    expect(map).toHaveAttribute('rel', 'noopener noreferrer');
    expect(
      screen.getByRole('navigation', { name: t('detail.breadcrumb') }).querySelector('[aria-current=page]')
    ).toHaveTextContent(place.name);
  });

  it.each([
    ['ACTIVE', 'Đang hoạt động', 'Active'],
    ['UNVERIFIED', 'Chưa xác minh', 'Unverified'],
    ['WARNING', 'Tạm dừng / Cảnh báo', 'Paused / Warning'],
    ['CLOSED_BANNED', 'Đã đóng / Cấm', 'Closed / Banned'],
    ['UNKNOWN', 'Chưa rõ', 'Unknown'],
  ] as const)('uses the approved %s label in each locale', (status, viLabel, enLabel) => {
    const record = listing(id, { status, statusRaw: 'Source status' });
    const view = render(<PlaceDetailView t={translator('vi')} locale='vi' listing={record} />);
    expect(screen.getByText(viLabel)).toBeVisible();
    view.rerender(<PlaceDetailView t={translator('en')} locale='en' listing={record} />);
    expect(screen.getByText(enLabel)).toBeVisible();
    expect(screen.queryByText('Source status')).not.toBeInTheDocument();
  });

  it('omits optional fields and uses the exact raw visit profile when parsing is unavailable', () => {
    const t = translator('en');
    const raw = 'Thời điểm chưa rõ |  Giá trị khác\nDòng tiếp';
    render(
      <PlaceDetailView
        t={t}
        locale='en'
        listing={listing(id, {
          areaId: 'unknown',
          areaName: 'Non-canonical value',
          address: null,
          sourceCategory: '',
          rating: null,
          notesText: '',
          visitProfile: null,
          visitProfileRaw: raw,
        })}
      />
    );
    expect(screen.queryByText('Non-canonical value')).not.toBeInTheDocument();
    expect(screen.queryByText(t('explore.ratingHeading'))).not.toBeInTheDocument();
    expect(screen.queryByText(t('detail.notes'))).not.toBeInTheDocument();
    expect(screen.queryByText(t('detail.address'))).not.toBeInTheDocument();
    expect(screen.queryByText(t('detail.openingHours'))).not.toBeInTheDocument();
    expect(screen.queryByText(t('detail.highlights'))).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Google Maps/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Thời điểm chưa rõ/).textContent).toBe(raw);
  });

  it('keeps source and parse errors distinct from missing IDs', async () => {
    vi.mocked(loadTravelDataset)
      .mockResolvedValueOnce({
        ok: false,
        error: { code: 'WORKBOOK_SOURCE_NETWORK_ERROR', message: 'private details' },
      })
      .mockResolvedValueOnce({
        ok: false,
        error: { code: 'WORKBOOK_DATA_BUILD_FAILED', message: 'private parser details' },
        errors: [{ code: 'INVALID_WORKBOOK', message: 'private workbook errors' }],
        diagnostics,
        source,
      });
    const view = render(await PlacePage(props(id)));
    expect(screen.getByRole('alert')).toHaveTextContent(translator('vi')('state.error'));
    view.rerender(await PlacePage(props('unknown', 'en')));
    expect(screen.getByRole('alert')).toHaveTextContent(translator('en')('state.error'));
    expect(screen.queryByText(/private/)).not.toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('generates localized canonical metadata and noindexes unavailable records', async () => {
    const viMeta = await generateMetadata(props(id));
    const enMeta = await generateMetadata(props(id, 'en'));
    expect(viMeta.title).toBe(place.name);
    expect(enMeta.title).toBe(place.name);
    expect(viMeta.description).toContain('Hải Châu');
    expect(enMeta.description).toContain('Food & dining');
    expect(viMeta.alternates?.canonical).toBe(`http://localhost:3000/places/${id}`);
    expect(enMeta.alternates?.canonical).toBe(`http://localhost:3000/en/places/${id}`);
    expect(enMeta.alternates?.languages).toMatchObject({
      vi: `http://localhost:3000/places/${id}`,
      en: `http://localhost:3000/en/places/${id}`,
    });
    expect(enMeta.description).not.toContain(notes);
    expect((await generateMetadata(props('missing'))).robots).toMatchObject({ index: false });
  });

  it.each(['grid', 'list', 'table'] as const)('links the two distinct IDs from %s and keeps Maps separate', (view) => {
    render(<ExploreResults view={view} listings={[place, duplicate]} t={translator('en')} locale='en' />);
    expect(screen.getAllByRole('link', { name: place.name }).map((anchor) => anchor.getAttribute('href'))).toEqual([
      `/places/${id}`,
      `/places/${otherId}`,
    ]);
    expect(screen.getByRole('link', { name: /Google Maps/ }).getAttribute('href')).toBe(place.mapsUrl);
  });
});
