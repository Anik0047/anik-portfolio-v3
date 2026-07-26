"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { getLenisInstance } from "@/lib/lenis";

let pluginRegistered = false;

function ensureScrollPlugin() {
	if (pluginRegistered) return;
	gsap.registerPlugin(ScrollToPlugin);
	pluginRegistered = true;
}

type SmoothScrollTarget = number | string | Element;

type SmoothScrollOptions = {
	duration?: number;
	offset?: number;
	ease?: string;
};

export function smoothScrollTo(
	target: SmoothScrollTarget,
	{ duration = 0.9, offset = 0, ease = "power3.out" }: SmoothScrollOptions = {},
) {
	if (typeof window === "undefined") return;

	const lenis = getLenisInstance();
	if (lenis) {
		const lenisTarget =
			typeof target === "string" || typeof target === "number"
				? target
				: target instanceof HTMLElement
					? target
					: target.parentElement;

		if (!lenisTarget) return;

		lenis.scrollTo(lenisTarget, {
			duration,
			offset: -offset,
			easing: (t) => 1 - (1 - t) ** 3,
		});
		return;
	}

	ensureScrollPlugin();

	gsap.to(window, {
		duration,
		ease,
		scrollTo: {
			y: target,
			offsetY: offset,
			autoKill: true,
		},
		overwrite: "auto",
	});
}
