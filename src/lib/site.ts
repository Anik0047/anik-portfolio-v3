const DEFAULT_SITE_URL = "https://siamparvez.com";

export function getSiteUrl(): string {
	return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL;
}

export const siteUrl = getSiteUrl();
