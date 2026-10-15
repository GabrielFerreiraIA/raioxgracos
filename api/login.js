import { createSessionCookie, safeNextPath, signSession, verifyPassword } from '../lib/auth.js';
import { getAccessConfig } from '../lib/config.js';

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
});

export default {
  async fetch(request) {
    if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });

    const { password: expectedPassword, secret: sessionSecret } = getAccessConfig();

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: 'invalid_request' }, 400);
    }

    if (!(await verifyPassword(payload.password, expectedPassword))) {
      return json({ ok: false, error: 'invalid_credentials' }, 401);
    }

    const token = await signSession(sessionSecret, expectedPassword);
    const nextPath = safeNextPath(payload.next);
    return json(
      { ok: true, next: nextPath },
      200,
      { 'Set-Cookie': createSessionCookie(token, request) },
    );
  },
};
