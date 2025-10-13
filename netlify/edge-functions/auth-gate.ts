const AUTH_COOKIE_NAME = 'audeon_auth';
const AUTH_COOKIE_VALUE = 'true';

const PUBLIC_PATHS = new Set([
  '/gate',
  '/gate/',
  '/gate.html',
  '/test',
  '/favicon.ico',
  '/robots.txt',
  '/.netlify/functions/verify',
]);

const STATIC_PATH_PREFIXES = ['/_', '/.netlify/', '/public/', '/gate-assets/'];

const COOKIE_SEPARATOR = ';';

const redirectResponse = (request: Request): Response => {
  const url = new URL(request.url);
  const target = new URL('/gate', url.origin);
  if (!['/', '/gate', '/gate/'].includes(url.pathname)) {
    target.searchParams.set('redirect', url.pathname + url.search);
  }
  return Response.redirect(target.toString(), 302);
};

const hasAuthCookie = (cookieHeader: string | null): boolean => {
  if (!cookieHeader) return false;
  return cookieHeader
    .split(COOKIE_SEPARATOR)
    .map((segment) => segment.trim())
    .some((segment) => segment === `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`);
};

const isStaticAllowedPath = (pathname: string): boolean => {
  return STATIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const isExplicitlyAllowedPath = (pathname: string): boolean => {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname === '/gate/index.html') return true;
  return false;
};

export default async (request: Request, context: { next: () => Promise<Response>; env?: Record<string, string | undefined> }): Promise<Response> => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const cookie = request.headers.get('cookie');
  const authenticated = hasAuthCookie(cookie);

  if (authenticated) {
    if (pathname === '/gate' || pathname === '/gate/' || pathname === '/gate.html') {
      const requestedTarget = url.searchParams.get('redirect');
      const fallbackTarget = requestedTarget && !requestedTarget.startsWith('/gate') ? requestedTarget : '/';
      const destination = new URL(fallbackTarget, url.origin);
      return Response.redirect(destination.toString(), 302);
    }
    return context.next();
  }

  if (pathname === '/gate' || pathname === '/gate/') {
    const gateHtml = new URL('/gate.html', url.origin);
    return Response.redirect(gateHtml.toString(), 302);
  }

  if (isStaticAllowedPath(pathname) || isExplicitlyAllowedPath(pathname)) {
    return context.next();
  }

  const debugEnabled = context.env?.AUTH_DEBUG === 'true';
  if (debugEnabled) {
    console.log('[auth-gate] redirecting unauthenticated request', {
      path: pathname,
      cookiesPresent: Boolean(cookie),
    });
  }

  return redirectResponse(request);
};

export const config = {
  path: '/*',
};
