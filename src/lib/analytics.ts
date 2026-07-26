export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
	}
}

export function trackPageView(url: string) {
	if (!isAnalyticsEnabled) return;
	if (typeof window === "undefined" || typeof window.gtag !== "function")
		return;

	window.gtag("event", "page_view", {
		page_location: window.location.href,
		page_path: url,
		page_title: document.title,
	});
}

export function trackEvent(
	action: string,
	params?: Record<string, string | number | boolean>,
) {
	if (!isAnalyticsEnabled) return;
	if (typeof window === "undefined" || typeof window.gtag !== "function")
		return;

	window.gtag("event", action, params ?? {});
}
