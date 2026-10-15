const encoder = new TextEncoder();
const COOKIE_NAME = 'raiox_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const toHex = (buffer) => [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

export async function signSession(secret, password) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`raiox:v1:${password}`));
  return toHex(signature);
}

export async function verifySession(token, secret, password) {
  if (!token || !secret || !password) return false;
  const expected = await signSession(secret, password);
  return timingSafeEqual(token, expected);
}

export async function verifyPassword(received, expected) {
  if (typeof received !== 'string' || typeof expected !== 'string' || !expected) return false;
  const [receivedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(received)),
    crypto.subtle.digest('SHA-256', encoder.encode(expected)),
  ]);
  return timingSafeEqual(toHex(receivedHash), toHex(expectedHash));
}

export function timingSafeEqual(a, b) {
  const left = String(a || '');
  const right = String(b || '');
  const max = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < max; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

export function readSessionCookie(request) {
  const raw = request.headers.get('cookie') || '';
  const item = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return item ? decodeURIComponent(item.slice(COOKIE_NAME.length + 1)) : '';
}

export function createSessionCookie(token, request, maxAge = SESSION_MAX_AGE) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

export function clearSessionCookie(request) {
  return createSessionCookie('', request, 0);
}

export function safeNextPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return '/';
  return value;
}
