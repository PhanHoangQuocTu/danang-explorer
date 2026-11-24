// @vitest-environment node
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { publicPosts } from '@/api/posts/boundary';
import { GET as detail } from '../[id]/route';
import { GET, POST } from '../route';

const url = 'http://localhost/api/posts';
const body = { userId: 2, title: 'Example', body: 'Public body' };
const row = { ...body, id: 10 };
const send = (text: string, headers: Record<string, string> = {}) =>
  POST(
    new NextRequest(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: text })
  );
const getDetail = (id: string) => detail(new NextRequest(url), { params: Promise.resolve({ id }) });

afterEach(() => vi.restoreAllMocks());

describe('public posts boundary', () => {
  it('forwards only validated pagination and caps upstream work', async () => {
    const get = vi.spyOn(publicPosts, 'get').mockResolvedValue({ data: [row] });
    const res = await GET(new NextRequest(`${url}?_page=1&_limit=20`, { headers: { Authorization: 'private' } }));
    expect(await res.json()).toEqual([row]);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(get).toHaveBeenCalledWith('/posts', { params: { _page: '1', _limit: '20' }, signal: expect.anything() });
    expect(publicPosts.defaults).toMatchObject({ timeout: 8000, maxRedirects: 0, maxContentLength: 1048576 });
  });
  it.each(['?_limit=101', '?url=example', '?_page=1&_page=2'])('rejects invalid query %s offline', async (query) => {
    const get = vi.spyOn(publicPosts, 'get');
    expect((await GET(new NextRequest(url + query))).status).toBe(400);
    expect(get).not.toHaveBeenCalled();
  });
  it('validates detail lookup and upstream identity', async () => {
    const get = vi.spyOn(publicPosts, 'get').mockResolvedValue({ data: row });
    expect((await getDetail('abc')).status).toBe(400);
    expect(get).not.toHaveBeenCalled();
    expect((await getDetail('11')).status).toBe(502);
    expect(await (await getDetail('10')).json()).toEqual(row);
  });
  it('accepts a bounded JSON post', async () => {
    vi.spyOn(publicPosts, 'post').mockResolvedValue({ status: 201, data: row });
    const response = await send(JSON.stringify(body));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(row);
  });
  it('rejects invalid, oversized, cross-origin and non-JSON writes locally', async () => {
    const write = vi.spyOn(publicPosts, 'post');
    expect((await send('{')).status).toBe(400);
    expect((await send('{}')).status).toBe(400);
    expect((await send('a'.repeat(32769))).status).toBe(413);
    expect((await send('{}', { origin: 'https://example.org' })).status).toBe(403);
    expect((await send('{}', { 'content-type': 'text/plain' })).status).toBe(415);
    expect(write).not.toHaveBeenCalled();
  });
  it('handles bad upstream shapes, status and timeout without leaking upstream bodies', async () => {
    const get = vi.spyOn(publicPosts, 'get').mockResolvedValueOnce({ data: 'bad' });
    expect((await GET(new NextRequest(url))).status).toBe(502);
    get.mockRejectedValueOnce({ isAxiosError: true, response: { status: 429, data: { message: 'private' } } });
    const response = await GET(new NextRequest(url));
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ message: 'Upstream request failed' });
    get.mockRejectedValueOnce({ isAxiosError: true, code: 'ETIMEDOUT' });
    expect((await getDetail('10')).status).toBe(504);
  });
});
