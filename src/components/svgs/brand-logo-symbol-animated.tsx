"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function BrandLogoSymbolAnimated({
	className,
}: {
	className?: string;
}) {
	const pathVariants = {
		initial: {
			pathLength: 0,
			fill: "var(--foreground)",
		},
		hover: {
			pathLength: 1,
			fill: "var(--background)",
		},
	};

	return (
		<motion.svg
			width="135"
			height="135"
			viewBox="0 0 135 135"
			xmlns="http://www.w3.org/2000/svg"
			className={cn("stroke-foreground", className)}
			initial="initial"
			whileHover="hover"
		>
			<motion.path
				d="M0 67.22H134.44V134.44H0L134.44 0H67.33L0 67.22Z"
				strokeWidth="2"
				variants={pathVariants}
				transition={{
					pathLength: {
						duration: 1.2,
						ease: "easeInOut",
					},
					fill: {
						delay: 1.2,
						duration: 0.4,
						ease: "easeIn",
					},
				}}
			/>
		</motion.svg>
	);
}
