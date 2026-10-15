import test from 'node:test';
import assert from 'node:assert/strict';
import { createSessionCookie, safeNextPath, signSession, verifyPassword, verifySession } from '../lib/auth.js';

test('validates passwords without exposing the configured value', async () => {
  assert.equal(await verifyPassword('cliente-2026', 'cliente-2026'), true);
  assert.equal(await verifyPassword('incorreta', 'cliente-2026'), false);
});

test('signs and verifies a session against both secrets', async () => {
  const token = await signSession('a'.repeat(32), 'cliente-2026');
  assert.equal(await verifySession(token, 'a'.repeat(32), 'cliente-2026'), true);
  assert.equal(await verifySession(token, 'b'.repeat(32), 'cliente-2026'), false);
  assert.equal(await verifySession(token, 'a'.repeat(32), 'outra-senha'), false);
});

test('accepts only same-origin relative return paths', () => {
  assert.equal(safeNextPath('/#pilares'), '/#pilares');
  assert.equal(safeNextPath('https://example.com'), '/');
  assert.equal(safeNextPath('//example.com'), '/');
  assert.equal(safeNextPath('/\\example.com'), '/');
});

test('creates an HttpOnly production cookie', () => {
  const request = new Request('https://raiox.example.com/');
  const cookie = createSessionCookie('token', request);
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Lax/);
  assert.match(cookie, /Secure/);
  assert.match(cookie, /Max-Age=604800/);
});
