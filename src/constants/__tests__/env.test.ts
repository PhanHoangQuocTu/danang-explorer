import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  for (const name of [
    'APP_ENV',
    'APP_URL',
    'API_URL',
    'OWNER_NAME',
    'OWNER_EMAIL',
    'OWNER_FACEBOOK_URL',
    'OWNER_LINKEDIN_URL',
  ]) {
    vi.stubEnv(`NEXT_PUBLIC_${name}`, undefined);
  }
});
afterEach(() => vi.unstubAllEnvs());

describe('public build environment', () => {
  it('uses the production origin and exact public owner defaults with line-ending whitespace', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', 'production\r\n');
    const { env, isProductionEnv } = await import('../env');
    expect(isProductionEnv).toBe(true);
    expect(env.APP_URL).toBe('https://dn-explorer.phanhoangquoctu.io.vn');
    expect(env.OWNER_NAME).toBe('Phan Hoàng Quốc Tú');
    expect(env.OWNER_EMAIL).toBe('tuphan694@gmail.com');
  });

  it('supports preview origins and explicitly empty contact links', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_ENV', ' staging ');
    vi.stubEnv('NEXT_PUBLIC_APP_URL', ' https://preview.example/ ');
    vi.stubEnv('NEXT_PUBLIC_OWNER_EMAIL', '');
    vi.stubEnv('NEXT_PUBLIC_OWNER_FACEBOOK_URL', ' ');
    const { env, isProductionEnv } = await import('../env');
    expect(isProductionEnv).toBe(false);
    expect(env.APP_URL).toBe('https://preview.example');
    expect(env.OWNER_EMAIL).toBeUndefined();
    expect(env.OWNER_FACEBOOK_URL).toBeUndefined();
  });

  it.each([
    ['OWNER_EMAIL', 'invalid'],
    ['OWNER_LINKEDIN_URL', 'javascript:void(0)'],
    ['API_URL', 'https://name:password@example.com'],
    ['APP_URL', 'https://example.com/path?query=1'],
  ])('rejects invalid %s', async (name, value) => {
    vi.stubEnv(`NEXT_PUBLIC_${name}`, value);
    await expect(import('../env')).rejects.toThrow();
  });
});
