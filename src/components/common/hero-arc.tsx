"use client";

import gsap from "gsap";
import { useEffect, useId, useRef } from "react";

interface HeroArcProps {
	/** Y position of the arc ends in viewBox units (0–100). Default: 62 */
	edgeY?: number;
	/** How many units the arc peak rises above edgeY. Default: 20 */
	peakDepth?: number;
	/** Where the bottom fade begins, 0–1. Default: 0.68 */
	fadeStart?: number;
	/** Play the rise animation. Default: true */
	animate?: boolean;
	/** Seconds before animation starts. Default: 0.1 */
	delay?: number;
	/** Seconds for the rise. Default: 1.1 */
	duration?: number;
	className?: string;
}

function buildArc(edgeY: number, peakDepth: number, offsetY: number): string {
	const ey = edgeY + offsetY;
	const py = edgeY - peakDepth + offsetY;
	return [
		`M -10 ${ey}`,
		`C -10 ${ey}, 50 ${py}, 110 ${ey}`,
		`L 110 130`,
		`L -10 130`,
		`Z`,
	].join(" ");
}

export default function HeroArc({
	edgeY = 62,
	peakDepth = 20,
	fadeStart = 0.68,
	animate = true,
	delay = 0.1,
	duration = 1.1,
	className,
}: HeroArcProps) {
	const uid = useId().replace(/:/g, "");
	const gradId = `arcFade-${uid}`;
	const maskId = `arcMask-${uid}`;
	const arcRef = useRef<SVGPathElement>(null);

	const hidden = buildArc(edgeY, peakDepth, 100);
	const final = buildArc(edgeY, peakDepth, 0);

	useEffect(() => {
		if (!arcRef.current) return;

		if (!animate) {
			arcRef.current.setAttribute("d", final);
			return;
		}

		gsap.fromTo(
			arcRef.current,
			{ attr: { d: hidden } },
			{ attr: { d: final }, duration, delay, ease: "power3.out" },
		);
	}, [animate, delay, duration]);

	const fadePct = `${Math.round(fadeStart * 100)}%`;

	return (
		<svg
			className={`absolute inset-0 w-full h-full pointer-events-none ${className ?? ""}`}
			viewBox="0 0 100 100"
			preserveAspectRatio="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<defs>
				{/*
          --primary-lemon is the correct variable name from your CSS.
          --color-lemon resolves to --primary-lemon via @theme inline,
          but SVG attributes read raw CSS variables, not Tailwind tokens,
          so we reference --primary-lemon directly to be safe.
        */}
				<linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="var(--primary-lemon)" stopOpacity="1" />
					<stop
						offset={fadePct}
						stopColor="var(--primary-lemon)"
						stopOpacity="1"
					/>
					<stop
						offset="100%"
						stopColor="var(--primary-lemon)"
						stopOpacity="0"
					/>
				</linearGradient>

				<mask id={maskId}>
					<path
						ref={arcRef}
						d={animate ? hidden : final}
						fill={`url(#${gradId})`}
					/>
				</mask>
			</defs>

			<rect
				width="120"
				height="140"
				x="-10"
				y="0"
				fill="var(--primary-lemon)"
				mask={`url(#${maskId})`}
			/>
		</svg>
	);
}

// TODO: Priority ( High ) siamparvez 030720261531
