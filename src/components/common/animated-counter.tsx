"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type AnimatedCounterProps = {
	to: number;
	durationMs?: number;
	decimals?: number;
	minDigits?: number;
	prefix?: string;
	suffix?: string;
};

export default function AnimatedCounter({
	to,
	durationMs = 1100,
	decimals = 0,
	minDigits = 0,
	prefix = "",
	suffix = "",
}: AnimatedCounterProps) {
	const ref = useRef<HTMLSpanElement | null>(null);
	const isInView = useInView(ref, { once: true, amount: 0.6 });
	const [value, setValue] = useState(0);

	useEffect(() => {
		if (!isInView) return;

		const start = performance.now();
		let rafId = 0;

		const tick = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(1, elapsed / durationMs);
			const eased = 1 - (1 - progress) ** 3;
			setValue(to * eased);

			if (progress < 1) {
				rafId = window.requestAnimationFrame(tick);
			}
		};

		rafId = window.requestAnimationFrame(tick);

		return () => {
			window.cancelAnimationFrame(rafId);
		};
	}, [isInView, to, durationMs]);

	const formatValue = () => {
		if (decimals > 0) {
			return value.toFixed(decimals);
		}

		const rounded = Math.round(value);
		return minDigits > 0
			? rounded.toString().padStart(minDigits, "0")
			: rounded.toString();
	};

	return (
		<span ref={ref}>
			{prefix}
			{formatValue()}
			{suffix}
		</span>
	);
}
