const DEFAULT_APP_URL = 'https://www.netenpoche.fr';

function stripTrailingSlash(value: string) {
    return value.replace(/\/+$/, '');
}

export function getConfiguredAppUrl() {
    return stripTrailingSlash(process.env.NEXT_PUBLIC_APP_URL?.trim() || DEFAULT_APP_URL);
}

export function getBrowserAppUrl() {
    if (typeof window !== 'undefined') {
        return stripTrailingSlash(window.location.origin);
    }

    return getConfiguredAppUrl();
}

export function getRequestAppUrl(request: Request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';

    if (forwardedHost) {
        return stripTrailingSlash(`${forwardedProto}://${forwardedHost}`);
    }

    return stripTrailingSlash(new URL(request.url).origin);
}

export function createAppUrl(path: string, baseUrl = getConfiguredAppUrl()) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return new URL(normalizedPath, `${stripTrailingSlash(baseUrl)}/`).toString();
}

export function sanitizeNextPath(next: string | null | undefined, fallback = '/dashboard') {
    if (!next || !next.startsWith('/') || next.startsWith('//')) {
        return fallback;
    }

    return next;
}

