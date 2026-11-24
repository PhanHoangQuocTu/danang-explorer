import type { NextRequest } from 'next/server';

import { json, positiveId, post, publicPosts, upstreamFailure } from '@/api/posts/boundary';
import { POST_KEYS } from '@/api/posts/keys';
import { buildRoute } from '@/constants/routes';

type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  const { id } = await params;
  if (!positiveId.safeParse(id).success || req.nextUrl.search) return json({ message: 'Invalid post request' }, 400);
  try {
    const response = await publicPosts.get(buildRoute(POST_KEYS.GET_POST_DETAIL, { id }), { signal: req.signal });
    const result = post.safeParse(response.data);
    return result.success && result.data.id === Number(id)
      ? json(result.data)
      : json({ message: 'Invalid upstream response' }, 502);
  } catch (error) {
    return upstreamFailure(error);
  }
}
