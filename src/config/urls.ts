export const urls = {
  nav: {
    app: process.env.NEXT_PUBLIC_APP_URL,
    whitepaper: process.env.NEXT_PUBLIC_WHITEPAPER_URL,
  },
  footer: {
    whitepaper: process.env.NEXT_PUBLIC_WHITEPAPER_URL,
    discord: process.env.NEXT_PUBLIC_DISCORD_URL,
    github: process.env.NEXT_PUBLIC_GITHUB_URL,
    X: process.env.NEXT_PUBLIC_X_URL,
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL,
    terms: process.env.NEXT_PUBLIC_TERMS_URL,
    privacy: process.env.NEXT_PUBLIC_PRIVACY_URL,
  },
} as const;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DotNestedKeys<T> = (T extends object ?
  { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<DotNestedKeys<T[K]>>}` }[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;

export function getUrl(path: DotNestedKeys<typeof urls>): string {
  const parts = path.split('.');
  let result: any = urls;
  for (const part of parts) {
    result = result[part];
  }
  return result || '#';
}

// Validate URLs at runtime in development
if (process.env.NODE_ENV === 'development') {
  const validateNestedUrls = (obj: any, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object') {
        validateNestedUrls(value, `${prefix}${key}.`);
      } else if (!value) {
        console.warn(`Warning: URL for "${prefix}${key}" is not defined in environment variables.`);
      }
    });
  };
  validateNestedUrls(urls);
}

// Helper for external links
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http') || url.startsWith('https');
}

// Helper for safe navigation
export function getSafeUrl(url: string): string {
  if (!url) return '#';
  if (isExternalUrl(url)) {
    try {
      new URL(url);
      return url;
    } catch {
      console.warn(`Invalid URL: ${url}`);
      return '#';
    }
  }
  return url;
} 