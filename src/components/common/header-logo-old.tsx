"use client";

import { motion, useAnimation } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import BrandLogoSymbol from "../svgs/brand-logo-symbol";
import BrandLogoText from "../svgs/brand-logo-text";

const HIDDEN_X = -120;
const REVEALED_X = 0;
const CLIP_LEFT = 64;
const TEXT_GAP = 8;

export default function HeaderLogo() {
	const controls = useAnimation();
	const hideTimeout = useRef<NodeJS.Timeout | null>(null);
	const isRevealed = useRef(false);

	const reveal = () => {
		if (isRevealed.current) return;
		if (hideTimeout.current) clearTimeout(hideTimeout.current);
		isRevealed.current = true;
		controls.start({
			x: REVEALED_X,
			transition: {
				type: "spring",
				stiffness: 600,
				damping: 28,
				mass: 0.6,
				velocity: 80,
			},
		});
	};

	const scheduleHide = () => {
		hideTimeout.current = setTimeout(() => {
			isRevealed.current = false;
			controls.start({
				x: HIDDEN_X,
				transition: {
					type: "spring",
					stiffness: 400,
					damping: 30,
					mass: 0.5,
				},
			});
		}, 2500);
	};

	useEffect(() => {
		reveal();
		scheduleHide();
		return () => {
			if (hideTimeout.current) clearTimeout(hideTimeout.current);
		};
	}, []);

	return (
		<div className="relative flex items-center">
			<Link href="/" onMouseEnter={reveal} onMouseLeave={scheduleHide}>
				<BrandLogoSymbol className="relative z-10 size-12 lg:size-16" />
			</Link>
			<div
				className="absolute bottom-0 overflow-hidden"
				style={{ left: CLIP_LEFT, width: 300 }}
			>
				<motion.div
					initial={{ x: HIDDEN_X }}
					animate={controls}
					className="h-full flex items-center"
					style={{ paddingLeft: TEXT_GAP }}
				>
					<BrandLogoText className="h-6 lg:h-8 w-auto" />
				</motion.div>
			</div>
			<div className="w-24 lg:w-28" />
		</div>
	);
}
