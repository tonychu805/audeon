import type { Handler } from '@netlify/functions';
import crypto from 'crypto';

const AUTH_COOKIE_NAME = 'audeon_auth';
const AUTH_COOKIE_VALUE = 'true';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day
const FAILURE_DELAY_MS = 200;

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const timingSafeEquals = (a: string, b: string): boolean => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferA, bufferB);
};

const resolveOrigin = (event: Parameters<Handler>[0]): string => {
  if (event.headers.origin) return event.headers.origin;
  if (event.headers.Origin) return event.headers.Origin;

  const proto = event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'https';
  const host = event.headers.host || event.headers.Host || 'localhost';

  return `${proto}://${host}`;
};

const handler: Handler = async (event) => {
  const origin = resolveOrigin(event);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '600',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        Allow: 'POST, OPTIONS',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const expectedPassword = process.env.ACCESS_PASSWORD;

  if (!expectedPassword) {
    console.error('[verify] ACCESS_PASSWORD is not configured');
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({ error: 'Server misconfiguration' }),
    };
  }

  let suppliedPassword = '';

  try {
    const payload = JSON.parse(event.body || '{}');
    suppliedPassword = typeof payload.password === 'string' ? payload.password : '';
  } catch (error) {
    console.error('[verify] Failed to parse request body', error);
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({ error: 'Invalid request payload' }),
    };
  }

  if (!suppliedPassword) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({ error: 'Password is required' }),
    };
  }

  await wait(FAILURE_DELAY_MS);

  const passwordMatches = timingSafeEquals(suppliedPassword, expectedPassword);

  if (!passwordMatches) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const proto = event.headers['x-forwarded-proto'] || event.headers['X-Forwarded-Proto'] || 'https';
  const cookieParts = [
    `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`,
    `Path=/`,
    `Max-Age=${COOKIE_MAX_AGE_SECONDS}`,
    'HttpOnly',
    'SameSite=Lax',
  ];

  if (proto === 'https') {
    cookieParts.push('Secure');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Set-Cookie': cookieParts.join('; '),
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true }),
  };
};

export { handler };
