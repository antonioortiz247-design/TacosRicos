const LIKELY_JWT_PREFIX = 'eyJ';

function normalize(value: string | undefined) {
  return (value || '').trim();
}

export function isLikelyJwt(value: string) {
  return normalize(value).startsWith(LIKELY_JWT_PREFIX);
}

export function getConfiguredBusinessIdentifier() {
  const configuredId = normalize(process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_ID);
  const configuredSlug = normalize(process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG);

  if (configuredId && !isLikelyJwt(configuredId)) {
    return configuredId;
  }

  if (configuredSlug) {
    return configuredSlug;
  }

  return '';
}

