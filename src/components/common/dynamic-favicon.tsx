"use client";
import { useEffect } from "react";

export default function DynamicFavicon() {
	useEffect(() => {
		const updateFavicon = () => {
			const rootStyles = getComputedStyle(document.documentElement);
			const primary = rootStyles.getPropertyValue("--primary").trim();
			const primaryForeground = rootStyles
				.getPropertyValue("--primary-foreground")
				.trim();

			const svg = `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="12" fill="${primary}" />
        <path d="M14 31.92H49.84V49.84H14L49.84 14H31.9494L14 31.92Z" fill="${primaryForeground}" />
      </svg>`;

			const svgDataUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
			let link = document.getElementById("dynamic-favicon") as HTMLLinkElement;
			if (!link) {
				link = document.createElement("link");
				link.id = "dynamic-favicon";
				link.rel = "icon";
				document.head.appendChild(link);
			}
			link.href = svgDataUrl;
		};

		// Run once on mount
		updateFavicon();

		// Watch for class/attribute changes on <html> (where next-themes applies the theme)
		const observer = new MutationObserver(updateFavicon);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme", "style"],
		});

		return () => observer.disconnect();
	}, []);

	return null;
}
