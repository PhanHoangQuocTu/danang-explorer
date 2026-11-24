import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE } from '@/i18n/routing';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    lang: DEFAULT_LOCALE,
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F7F2',
    theme_color: '#123B4A',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
      { src: '/brand-mark.png', type: 'image/png', sizes: '512x512' },
      { src: '/apple-icon', type: 'image/png', sizes: '180x180' },
    ],
  };
}
