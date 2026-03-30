const LIKELY_JWT_PREFIX = 'eyJ';
const DEFAULT_BUSINESS_FALLBACK = 'obwzuckfjmayluwmyjqu';

export function normalizeBusinessIdentifier(value: string | null | undefined) {
  return (value || '').trim();
}

export function isLikelyJwt(value: string) {
  return normalizeBusinessIdentifier(value).startsWith(LIKELY_JWT_PREFIX);
}

export function getConfiguredBusinessIdentifier() {
  const configuredId = normalizeBusinessIdentifier(process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID);
  const configuredSlug = normalizeBusinessIdentifier(process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG);

  if (configuredId && !isLikelyJwt(configuredId)) {
    return configuredId;
  }

  if (configuredSlug) {
    return configuredSlug;
  }

  return DEFAULT_BUSINESS_FALLBACK;
}

export function getRequestedOrConfiguredBusinessIdentifier(requested: string | null | undefined) {
  return normalizeBusinessIdentifier(requested) || getConfiguredBusinessIdentifier();
}

export function buildPathWithNegocio(path: string, negocio: string | null | undefined) {
  const normalized = normalizeBusinessIdentifier(negocio);
  return normalized ? `${path}?negocio=${encodeURIComponent(normalized)}` : path;
}
