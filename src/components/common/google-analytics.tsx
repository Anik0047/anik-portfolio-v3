"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect } from "react";
import { GA_MEASUREMENT_ID, trackPageView } from "@/lib/analytics";

export default function GoogleAnalytics() {
	const pathname = usePathname();

	useEffect(() => {
		if (!GA_MEASUREMENT_ID) return;

		const query = window.location.search.replace(/^\?/, "");
		const url = query ? `${pathname}?${query}` : pathname;
		trackPageView(url);
	}, [pathname]);

	if (!GA_MEASUREMENT_ID) return null;

	return (
		<>
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
				strategy="afterInteractive"
			/>
			<Script id="ga-init" strategy="afterInteractive">
				{`
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					window.gtag = gtag;
					gtag('js', new Date());
					gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
				`}
			</Script>
		</>
	);
}
