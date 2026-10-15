export const DEFAULT_CLIENT_PASSWORD = 'gracos123';
export const DEFAULT_SESSION_SECRET = 'raiox-gracos-multiplix-access-2026-v1';

export function getAccessConfig() {
  return {
    password: process.env.CLIENT_PASSWORD || DEFAULT_CLIENT_PASSWORD,
    secret: process.env.SESSION_SECRET || DEFAULT_SESSION_SECRET,
  };
}
