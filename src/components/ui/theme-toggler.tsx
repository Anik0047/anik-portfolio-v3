"use client";
import { Moon, Sun } from "lucide-react";
import { type HTMLMotionProps, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

// import { QuarterDashedCircle } from "../../../public/svg/quarter-dash-circle";

interface ThemeTogglerProps extends HTMLMotionProps<"button"> {
	duration?: number;
	onToggle?: () => void;
}

export const ThemeToggler = ({
	className,
	duration = 400,
	onToggle,
	...props
}: ThemeTogglerProps) => {
	const { theme, setTheme } = useTheme();
	const buttonRef = useRef<HTMLButtonElement>(null);

	const toggleTheme = useCallback(async () => {
		if (!buttonRef.current) return;

		const newTheme = theme === "dark" ? "light" : "dark";

		await document.startViewTransition(() => {
			flushSync(() => {
				setTheme(newTheme);
			});
		}).ready;

		const { top, left, width, height } =
			buttonRef.current.getBoundingClientRect();
		const x = left + width / 2;
		const y = top + height / 2;
		const maxRadius = Math.hypot(
			Math.max(left, window.innerWidth - left),
			Math.max(top, window.innerHeight - top),
		);

		document.documentElement.animate(
			{
				clipPath: [
					`circle(0px at ${x}px ${y}px)`,
					`circle(${maxRadius}px at ${x}px ${y}px)`,
				],
			},
			{
				duration,
				easing: "ease-in-out",
				pseudoElement: "::view-transition-new(root)",
			},
		);

		onToggle?.();
	}, [theme, setTheme, duration, onToggle]);

	return (
		<motion.button
			ref={buttonRef}
			onClick={toggleTheme}
			whileTap={{ rotate: 90 }}
			className={cn(className, "cursor-pointer transition-colors flex-center")}
			{...props}
		>
			{theme === "dark" ? (
				<Moon className="size-5" />
			) : (
				<Sun className="size-5" />
			)}
			{/* <QuarterDashedCircle className="dark:rotate-90 transition-all m-auto size-10" /> */}
			<span className="sr-only">Toggle theme</span>
		</motion.button>
	);
};
