import { clearSessionCookie } from '../lib/auth.js';

export default {
  async fetch(request) {
    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL('/login', request.url).toString(),
        'Set-Cookie': clearSessionCookie(request),
        'Cache-Control': 'no-store',
      },
    });
  },
};
