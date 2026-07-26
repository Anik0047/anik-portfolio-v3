"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { setLenisInstance } from "@/lib/lenis";

type SmoothScrollProviderProps = {
	children: ReactNode;
};

export default function SmoothScrollProvider({
	children,
}: SmoothScrollProviderProps) {
	const prefersReducedMotion = useReducedMotion();

	useEffect(() => {
		if (prefersReducedMotion) return;

		gsap.registerPlugin(ScrollTrigger);

		const lenis = new Lenis({
			duration: 1.05,
			lerp: 0.085,
			smoothWheel: true,
			syncTouch: true,
			touchMultiplier: 1,
			wheelMultiplier: 0.9,
		});

		setLenisInstance(lenis);

		lenis.on("scroll", () => {
			ScrollTrigger.update();
		});

		const updateLenis = (time: number) => {
			lenis.raf(time * 1000);
		};

		gsap.ticker.add(updateLenis);

		return () => {
			gsap.ticker.remove(updateLenis);
			lenis.destroy();
			setLenisInstance(null);
		};
	}, [prefersReducedMotion]);

	return <>{children}</>;
}
