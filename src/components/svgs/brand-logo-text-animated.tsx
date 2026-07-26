"use client";

import gsap from "gsap";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const TEXT_TOP = 43.5;
const SVG_BOTTOM = 100; // well past viewBox bottom — eliminates all bottom gaps
const WAVE_AMPLITUDE = 1.8;
const WAVE_LENGTH = 25;
const OVERSHOOT = 200; // how far left/right the wave extends past SVG edges

function buildWavePath(y: number, phase: number): string {
	const left = -OVERSHOOT;
	const right = 199 + OVERSHOOT;

	let d = `M ${left} ${SVG_BOTTOM} L ${left} ${y}`;

	for (let x = left; x <= right; x += 1) {
		const wy =
			y + Math.sin(((x + phase) / WAVE_LENGTH) * Math.PI * 2) * WAVE_AMPLITUDE;
		d += ` L ${x} ${wy}`;
	}

	d += ` L ${right} ${SVG_BOTTOM} Z`;
	return d;
}

export default function BrandLogoTextAnimated({
	className,
}: {
	className?: string;
}) {
	const wavePathRef = useRef<SVGPathElement>(null);

	const proxy = useRef({ y: SVG_BOTTOM, phase: 0 });
	const scrollTween = useRef<gsap.core.Tween | null>(null);
	const riseTween = useRef<gsap.core.Tween | null>(null);

	function redraw() {
		wavePathRef.current?.setAttribute(
			"d",
			buildWavePath(proxy.current.y, proxy.current.phase),
		);
	}

	function startScroll() {
		scrollTween.current?.kill();
		scrollTween.current = gsap.to(proxy.current, {
			phase: proxy.current.phase - WAVE_LENGTH * 2,
			duration: 1.8,
			ease: "none",
			repeat: -1,
			onUpdate: redraw,
		});
	}

	function handleMouseEnter() {
		riseTween.current?.kill();
		startScroll();

		riseTween.current = gsap.to(proxy.current, {
			y: TEXT_TOP - WAVE_AMPLITUDE, // rise above TEXT_TOP so wave crest never dips below fill line
			duration: 1.5,
			ease: "power2.out",
			onUpdate: redraw,
		});
	}

	function handleMouseLeave() {
		riseTween.current?.kill();

		riseTween.current = gsap.to(proxy.current, {
			y: SVG_BOTTOM,
			duration: 0.55,
			ease: "power2.in",
			onUpdate: redraw,
			onComplete: () => {
				scrollTween.current?.kill();
				scrollTween.current = null;
			},
		});
	}

	return (
		<svg
			width="199"
			height="68"
			viewBox="0 0 199 68"
			xmlns="http://www.w3.org/2000/svg"
			className={cn(className)}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<defs>
				<clipPath id="wave-reveal">
					<path
						ref={wavePathRef}
						d={`M -${OVERSHOOT} ${SVG_BOTTOM} L ${199 + OVERSHOOT} ${SVG_BOTTOM} Z`}
					/>
				</clipPath>
			</defs>

			{/* ── Top wordmark ── */}
			<path
				d="M0 0H40.79C41.04 0 41.65 0.399997 42.62 1.2C43.59 2 44.66 2.93 45.83 4C47 5.07 48.11 6.15 49.15 7.25C50.2 8.35 50.92 9.19 51.32 9.79H13.74V14.87H51.84V39.6H11.05C10.75 39.6 10.12 39.2 9.15001 38.4C8.18001 37.6 7.12001 36.67 5.98001 35.6C4.83001 34.53 3.74 33.45 2.69 32.35C1.64 31.26 0.920004 30.41 0.520004 29.81H38.1V24.58H0V0Z"
				className="fill-foreground"
			/>
			<path
				d="M55.7305 0H69.6205V39.59H55.7305V0Z"
				className="fill-foreground"
			/>
			<path
				d="M72.0103 39.59L112.13 0H130.51V39.59H112.21L103.77 29.95H116.84V11.87L88.7502 39.58H72.0202L72.0103 39.59Z"
				className="fill-foreground"
			/>
			<path
				d="M159.49 29.28V9.78H148.06V39.59H134.31V0H198.4V39.59H184.73V9.78H173.3V39.59L159.48 29.28H159.49Z"
				className="fill-foreground"
			/>

			{/* ── Bottom tagline: stroke layer (always visible) ── */}
			<g className="fill-none stroke-primary">
				<path d="M0 43.5H30.73V58.85H11.03V52.99H22.09V49.32H8.69V67.22H0.0100098V43.5H0Z" />
				<path d="M63.7604 43.5V67.22H55.0804V58.85H41.8304V67.22H33.1504V43.5H63.7604ZM41.8304 49.31V52.98H55.0804V49.31H41.8304Z" />
				<path d="M66.1802 43.5H96.9102V58.85H87.8902L98.5002 67.22H88.0102L77.1802 58.85V52.99H88.2802V49.32H74.8802V67.22H66.2002V43.5H66.1802Z" />
				<path d="M98.3403 43.5H106.68L114.08 58.54L121.03 43.5H129.41L117.67 67.22H110.31L98.3403 43.5Z" />
				<path d="M130.88 43.5002H163.61C163.56 43.7102 163.51 44.0402 163.46 44.5102C163.41 44.9702 163.35 45.4902 163.27 46.0502C163.19 46.6202 163.11 47.1902 163.02 47.7702C162.93 48.3502 162.82 48.8702 162.7 49.3102H139.56V52.3502H161.68V58.2102H139.56V61.3402H163.3C163.05 61.7002 162.59 62.2102 161.92 62.8602C161.25 63.5202 160.56 64.1702 159.84 64.8102C159.12 65.4502 158.46 66.0102 157.84 66.4902C157.22 66.9702 156.83 67.2102 156.65 67.2102H130.87V43.4902L130.88 43.5002Z" />
				<path d="M198.41 43.5V58.23H174.33V61.36H198.07C197.82 61.72 197.36 62.23 196.69 62.88C196.02 63.54 195.33 64.19 194.61 64.83C193.89 65.47 193.23 66.03 192.61 66.51C191.99 66.99 191.6 67.23 191.42 67.23H165.64V52.41H189.72V49.37H165.98C166.23 49.01 166.69 48.5 167.36 47.85C168.03 47.19 168.72 46.55 169.44 45.9C170.16 45.26 170.82 44.7 171.44 44.22C172.06 43.74 172.45 43.5 172.63 43.5H198.41Z" />
			</g>

			{/* ── Bottom tagline: fill layer (wave-clipped) ── */}
			<g clipPath="url(#wave-reveal)" className="fill-primary">
				<path d="M0 43.5H30.73V58.85H11.03V52.99H22.09V49.32H8.69V67.22H0.0100098V43.5H0Z" />
				<path d="M63.7604 43.5V67.22H55.0804V58.85H41.8304V67.22H33.1504V43.5H63.7604ZM41.8304 49.31V52.98H55.0804V49.31H41.8304Z" />
				<path d="M66.1802 43.5H96.9102V58.85H87.8902L98.5002 67.22H88.0102L77.1802 58.85V52.99H88.2802V49.32H74.8802V67.22H66.2002V43.5H66.1802Z" />
				<path d="M98.3403 43.5H106.68L114.08 58.54L121.03 43.5H129.41L117.67 67.22H110.31L98.3403 43.5Z" />
				<path d="M130.88 43.5002H163.61C163.56 43.7102 163.51 44.0402 163.46 44.5102C163.41 44.9702 163.35 45.4902 163.27 46.0502C163.19 46.6202 163.11 47.1902 163.02 47.7702C162.93 48.3502 162.82 48.8702 162.7 49.3102H139.56V52.3502H161.68V58.2102H139.56V61.3402H163.3C163.05 61.7002 162.59 62.2102 161.92 62.8602C161.25 63.5202 160.56 64.1702 159.84 64.8102C159.12 65.4502 158.46 66.0102 157.84 66.4902C157.22 66.9702 156.83 67.2102 156.65 67.2102H130.87V43.4902L130.88 43.5002Z" />
				<path d="M198.41 43.5V58.23H174.33V61.36H198.07C197.82 61.72 197.36 62.23 196.69 62.88C196.02 63.54 195.33 64.19 194.61 64.83C193.89 65.47 193.23 66.03 192.61 66.51C191.99 66.99 191.6 67.23 191.42 67.23H165.64V52.41H189.72V49.37H165.98C166.23 49.01 166.69 48.5 167.36 47.85C168.03 47.19 168.72 46.55 169.44 45.9C170.16 45.26 170.82 44.7 171.44 44.22C172.06 43.74 172.45 43.5 172.63 43.5H198.41Z" />
			</g>
		</svg>
	);
}
