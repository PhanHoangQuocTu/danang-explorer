import axios from 'axios';
import { z } from 'zod';

import { env } from '@/constants/env';
import { normalizeApiError } from '../interceptors';

// This public example uses a fixed upstream and carries no visitor credentials.
export const publicPosts = axios.create({
  baseURL: env.API_URL,
  timeout: 8000,
  maxRedirects: 0,
  maxContentLength: 1024 * 1024,
  responseType: 'json',
});

const createPost = z.strictObject({
  userId: z.int().positive(),
  title: z.string().min(1).max(500),
  body: z.string().min(1).max(8000),
});
export const post = createPost.extend({ id: z.int().positive() });
export const postList = z.array(post).max(100);
export const positiveId = z.string().regex(/^[1-9]\d{0,8}$/);
export const pagination = z.strictObject({
  _page: positiveId.optional(),
  _limit: positiveId.refine((value) => Number(value) <= 100).optional(),
});

export const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });

export const upstreamFailure = (error: unknown) => {
  const { status, code } = normalizeApiError(error);
  if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') return json({ message: 'Upstream timeout' }, 504);
  return json({ message: 'Upstream request failed' }, status >= 400 && status <= 599 ? status : 502);
};

export async function readPostBody(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return json({ message: 'Origin mismatch' }, 403);
  if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json')
    return json({ message: 'Expected application/json' }, 415);
  const reader = req.body?.getReader();
  if (!reader) return json({ message: 'Missing body' }, 400);
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let text = '';
  try {
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read()) {
      size += chunk.value.byteLength;
      if (size > 32768) {
        await reader.cancel();
        return json({ message: 'Body too large' }, 413);
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    const result = createPost.safeParse(JSON.parse(text + decoder.decode()));
    if (result.success) return result.data;
  } catch {
    // A truncated request, invalid UTF-8 and malformed JSON share a public error.
  } finally {
    reader.releaseLock();
  }
  return json({ message: 'Invalid post body' }, 400);
}
