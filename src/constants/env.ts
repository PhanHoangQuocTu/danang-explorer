import { z } from 'zod';

import { AppEnv } from '@/enums/enum';

const appEnv = process.env.NEXT_PUBLIC_APP_ENV?.trim() || undefined;
const webUrl = z.url({ protocol: /^https?$/ });
const publicOrigin = webUrl.refine((value) => {
  const url = new URL(value);
  return !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash;
}, 'Expected a public HTTP(S) origin without credentials, path, query or fragment');
const profileUrl = z
  .url({ protocol: /^https$/ })
  .refine((value) => {
    const url = new URL(value);
    return !url.username && !url.password;
  }, 'Expected a public HTTPS profile URL without credentials')
  .optional();

// Unset contact values use the public site defaults. An explicitly blank value hides that link.
const publicContact = (value: string | undefined, fallback: string) => (value?.trim() ?? fallback) || undefined;

const envSchema = z.object({
  APP_ENV: z.enum(AppEnv).default(AppEnv.DEVELOPMENT),
  /** Public origin of this app. Used for canonical URLs, sitemap and Open Graph. */
  APP_URL: publicOrigin.default(
    appEnv === AppEnv.PRODUCTION ? 'https://dn-explorer.phanhoangquoctu.io.vn' : 'http://localhost:3000'
  ),
  /** Backend origin the BFF route handlers and the `/proxy/*` rewrite forward to. */
  API_URL: publicOrigin.default('https://jsonplaceholder.typicode.com'),
  OWNER_NAME: z.string().min(1).default('Phan Hoàng Quốc Tú'),
  OWNER_EMAIL: z.email().optional(),
  OWNER_FACEBOOK_URL: profileUrl,
  OWNER_LINKEDIN_URL: profileUrl,
  /** Injected by `next.config.ts` from package.json. */
  APP_VERSION: z.string().default('0.0.0'),
});

/**
 * Typed, validated environment.
 *
 * Next.js only inlines `NEXT_PUBLIC_*` values on a literal `process.env.NAME` access,
 * so every variable is listed explicitly instead of spreading `process.env`.
 */
export const env = envSchema.parse({
  APP_ENV: appEnv,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') || undefined,
  API_URL: process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '') || undefined,
  OWNER_NAME: process.env.NEXT_PUBLIC_OWNER_NAME?.trim() || undefined,
  OWNER_EMAIL: publicContact(process.env.NEXT_PUBLIC_OWNER_EMAIL, 'tuphan694@gmail.com'),
  OWNER_FACEBOOK_URL: publicContact(
    process.env.NEXT_PUBLIC_OWNER_FACEBOOK_URL,
    'https://www.facebook.com/phanhoangquoctu/'
  ),
  OWNER_LINKEDIN_URL: publicContact(
    process.env.NEXT_PUBLIC_OWNER_LINKEDIN_URL,
    'https://www.linkedin.com/in/phanhoangquoctu/'
  ),
  APP_VERSION: process.env.APP_VERSION?.trim() || undefined,
});

export const isProductionEnv = env.APP_ENV === AppEnv.PRODUCTION;
export const isDevelopmentEnv = env.APP_ENV === AppEnv.DEVELOPMENT;
export const isServer = typeof window === 'undefined';
