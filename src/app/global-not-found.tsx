import type { Metadata } from 'next';

import { siteConfig } from '@/config/site';
import { DEFAULT_LOCALE } from '@/i18n/routing';
import common from '@/messages/vi/common.json';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.appUrl),
  title: `${common.notFound.title} | ${siteConfig.name}`,
  robots: { index: false, follow: false },
};

// Fallback for URLs outside any locale segment (the locale layout is not available here).
export default function RootNotFound() {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'grid', placeItems: 'center', minHeight: '100dvh' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
          <p>{common.notFound.title}</p>
        </div>
      </body>
    </html>
  );
}
