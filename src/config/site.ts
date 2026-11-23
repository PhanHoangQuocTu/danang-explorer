import { env, isProductionEnv } from '@/constants/env';
import common from '@/messages/vi/common.json';

export type SiteConfig = typeof siteConfig;

export { isProductionEnv };

/**
 * Shared site facts and default-locale branding for the manifest and social images.
 */
export const siteConfig = {
  appUrl: env.APP_URL,
  name: common.seo.siteName,
  shortName: 'Đà Nẵng',
  description: common.seo.description,
  mark: 'Đ',
};
