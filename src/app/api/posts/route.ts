import type { NextRequest } from 'next/server';

import { json, pagination, post, postList, publicPosts, readPostBody, upstreamFailure } from '@/api/posts/boundary';
import { POST_KEYS } from '@/api/posts/keys';

/**
 * BFF proxy example.
 *
 * Browser -> /api/posts (this handler) -> backend /posts
 *
 * Why proxy: the real backend URL stays on the server, there is no CORS, and the
 * response can be reshaped before it reaches the client.
 */
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams;
  const query = pagination.safeParse(Object.fromEntries(search));
  if (!query.success || search.size !== Object.keys(query.data).length)
    return json({ message: 'Invalid pagination' }, 400);
  try {
    const response = await publicPosts.get(POST_KEYS.GET_POSTS, { params: query.data, signal: req.signal });
    const result = postList.safeParse(response.data);
    return result.success ? json(result.data) : json({ message: 'Invalid upstream response' }, 502);
  } catch (error) {
    return upstreamFailure(error);
  }
}

export async function POST(req: NextRequest) {
  const input = await readPostBody(req);
  if (input instanceof Response) return input;
  try {
    const response = await publicPosts.post(POST_KEYS.GET_POSTS, input, { signal: req.signal });
    const result = post.safeParse(response.data);
    return result.success ? json(result.data, response.status) : json({ message: 'Invalid upstream response' }, 502);
  } catch (error) {
    return upstreamFailure(error);
  }
}
