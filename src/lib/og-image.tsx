import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { z } from 'zod';

import { OG_IMAGE_SIZE } from '@/constants/const';
import { ROUTES } from '@/constants/routes';
import { useTranslationsServer } from '@/hooks/useTranslationsServer';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/routing';
import { AREA_IDS } from '@/lib/travel-data/const';
import { resolveArea } from '@/modules/Areas/areas';
import { isPlaceId, resolvePlace } from '@/modules/PlaceDetail/resolvePlace';
import { getExploreSeo, getGuideCopy, getPlaceDescription, guideSections } from './guide-seo';

const imageQuery = z.strictObject({
  locale: z.enum(LOCALES).default(DEFAULT_LOCALE),
  path: z.string().max(120).default('/'),
});

interface ImageCopy {
  title: string;
  description: string;
}

async function resolveImageCopy(locale: Locale, path: string): Promise<ImageCopy | 404 | 503> {
  if (Object.hasOwn(guideSections, path)) return getGuideCopy(locale, path as keyof typeof guideSections);
  if (path === ROUTES.HEALTH) {
    const { t } = await useTranslationsServer('health', locale);
    return { title: t('title'), description: t('description') };
  }
  const page = /^\/explore\?page=([1-9]\d{0,8})$/u.exec(path)?.[1];
  if (page) {
    const copy = await getExploreSeo(locale, { page });
    return copy.noIndex ? 404 : copy;
  }
  const [, group, id, ...extra] = path.split('/');
  if (!path.startsWith('/') || extra.length || !id) return 404;
  const { t } = await useTranslationsServer('travel', locale);
  if (group === 'places' && isPlaceId(id)) {
    const result = await resolvePlace(id);
    if (result.kind === 'source-error') return 503;
    if (result.kind === 'not-found') return 404;
    return { title: result.listing.name, description: getPlaceDescription(result.listing, t) };
  }
  if (group === 'areas' && Object.values<string>(AREA_IDS).includes(id)) {
    const result = await resolveArea(id);
    if (result.kind === 'source-error') return 503;
    if (result.kind === 'not-found') return 404;
    return { title: result.area.areaName, description: t('areas.detailMeta', { area: result.area.areaName }) };
  }
  return 404;
}

/** Both social endpoints render only localized pages known to this guide. */
export async function getSocialImage(request: Request) {
  const { searchParams, search } = new URL(request.url);
  const invalidQuery = () => new Response(null, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  if (search.length > 512 || new Set(searchParams.keys()).size !== searchParams.size) return invalidQuery();
  const result = imageQuery.safeParse(Object.fromEntries(searchParams));
  if (!result.success) return invalidQuery();
  const { locale, path } = result.data;
  const copy = await resolveImageCopy(locale, path);
  if (typeof copy === 'number') {
    return new Response(null, { status: copy, headers: { 'Cache-Control': 'no-store' } });
  }
  const [{ t }, mark] = await Promise.all([
    useTranslationsServer('common.seo', locale),
    readFile(join(process.cwd(), 'public', 'brand-mark.png')),
  ]);
  const { title } = copy;
  const fontSize = Math.max(44, Math.min(76, 102 - title.length * 0.65));
  return new ImageResponse(
    <div
      lang={locale}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '52px 72px 56px',
        background: '#F8F7F2',
        borderBottom: '16px solid #006B70',
        color: '#102E38',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 29, fontWeight: 700 }}>
        {/* biome-ignore lint/performance/noImgElement: ImageResponse renders this embedded PNG on the server. */}
        <img alt='' width={66} height={66} src={`data:image/png;base64,${mark.toString('base64')}`} />
        {t('siteName')}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
        <div
          style={{
            fontSize,
            fontWeight: 700,
            lineHeight: 1.09,
            letterSpacing: -2,
            lineClamp: 3,
            overflow: 'hidden',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            lineHeight: 1.3,
            maxWidth: 1030,
            color: '#34535B',
            lineClamp: 3,
            overflow: 'hidden',
          }}
        >
          {copy.description}
        </div>
      </div>
      <div style={{ display: 'flex', height: 6, width: 124, background: '#CF8C48' }} />
    </div>,
    {
      ...OG_IMAGE_SIZE,
      headers: { 'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600' },
    }
  );
}
