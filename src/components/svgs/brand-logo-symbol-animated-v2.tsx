"use client";

import { motion, useAnimation } from "motion/react";
import { cn } from "@/lib/utils";

const PATH = "M0 67.22H134.44V134.44H0L134.44 0H67.33L0 67.22Z";

export default function BrandLogoSymbolAnimated2({
	className,
}: {
	className?: string;
}) {
	const controls = useAnimation();

	const handleHoverStart = () => {
		controls.start({
			clipPath: "inset(0% 0% 0% 0%)",
			transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
		});
	};

	const handleHoverEnd = () => {
		controls.start({
			clipPath: "inset(100% 0% 0% 0%)",
			transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
		});
	};

	return (
		<svg
			width="135"
			height="135"
			viewBox="0 0 134.44 134.44"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("cursor-pointer relative", className)}
			onMouseEnter={handleHoverStart}
			onMouseLeave={handleHoverEnd}
		>
			<path
				d={PATH}
				fill="currentColor"
				className="text-transparent absolute stroke stroke-primary top-0 bottom-0"
			/>
			<motion.path
				d={PATH}
				fill="currentColor"
				className="text-foreground dark:text-primary"
				initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
				animate={controls}
			/>
		</svg>
	);
}
