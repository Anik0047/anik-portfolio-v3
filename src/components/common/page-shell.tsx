"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageShellProps = {
	children: ReactNode;
	className?: string;
};

export default function PageShell({ children, className }: PageShellProps) {
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			className={cn(className)}
			key={pathname}
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.div>
	);
}
