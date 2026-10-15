import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CLIENT_PASSWORD, getAccessConfig } from '../lib/config.js';

test('is ready to deploy with the agreed simple password', () => {
  const previousPassword = process.env.CLIENT_PASSWORD;
  const previousSecret = process.env.SESSION_SECRET;
  delete process.env.CLIENT_PASSWORD;
  delete process.env.SESSION_SECRET;

  try {
    const config = getAccessConfig();
    assert.equal(DEFAULT_CLIENT_PASSWORD, 'gracos123');
    assert.equal(config.password, 'gracos123');
    assert.ok(config.secret.length >= 24);
  } finally {
    if (previousPassword === undefined) delete process.env.CLIENT_PASSWORD;
    else process.env.CLIENT_PASSWORD = previousPassword;
    if (previousSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previousSecret;
  }
});
