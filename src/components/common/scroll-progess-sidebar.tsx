"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { smoothScrollTo } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { useNavbarStore } from "@/stores/navbar-store";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = {
	label: string;
	href: string;
};

type ScrollProgressSidebarProps = {
	sections: Section[];
};

function getSectionElement(href: string): HTMLElement | null {
	const rawId = href.replace(/^#/, "");
	if (!rawId) return null;
	return (
		document.getElementById(rawId) ??
		document.getElementById(rawId.toLowerCase())
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ScrollProgressSidebar({
	sections,
}: ScrollProgressSidebarProps) {
	const sidebarRef = useRef<HTMLDivElement>(null);
	const fillRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const retryAttemptsRef = useRef(0);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [triggerInitKey, setTriggerInitKey] = useState(0);
	const isNavbarOpen = useNavbarStore((state) => state.isMenuOpen);
	const shouldShow = isVisible && !isNavbarOpen;

	// Show after first scroll
	useEffect(() => {
		const onScroll = () => setIsVisible(window.scrollY > 60);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Drive fill scaleY from scroll progress
	useEffect(() => {
		const updateFill = () => {
			const scrollTop = window.scrollY;
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
			if (fillRef.current) {
				fillRef.current.style.transform = `scaleY(${progress})`;
			}
		};
		window.addEventListener("scroll", updateFill, { passive: true });
		updateFill();
		return () => window.removeEventListener("scroll", updateFill);
	}, []);

	// Active section detection
	useGSAP(() => {
		const triggers: ScrollTrigger[] = [];

		sections.forEach((section, i) => {
			const el = getSectionElement(section.href);
			if (!el) return;

			const trigger = ScrollTrigger.create({
				trigger: el,
				start: "top center",
				end: "bottom center",
				onEnter: () => setActiveIndex(i),
				onEnterBack: () => setActiveIndex(i),
			});

			triggers.push(trigger);
		});

		ScrollTrigger.refresh();

		return () => {
			triggers.forEach((t) => {
				t.kill();
			});
		};
	}, [sections, triggerInitKey]);

	// Retry trigger setup when a section element mounts late.
	useEffect(() => {
		const hasMissingSections = sections.some(
			(section) => !getSectionElement(section.href),
		);

		if (!hasMissingSections) {
			retryAttemptsRef.current = 0;
			return;
		}

		if (retryAttemptsRef.current >= 8) return;

		retryAttemptsRef.current += 1;
		const delay = 120 * retryAttemptsRef.current;
		const timer = window.setTimeout(() => {
			setTriggerInitKey((prev) => prev + 1);
		}, delay);

		return () => window.clearTimeout(timer);
	}, [sections, triggerInitKey]);

	// Sidebar fade in/out
	useGSAP(() => {
		gsap.to(sidebarRef.current, {
			opacity: shouldShow ? 1 : 0,
			x: shouldShow ? 0 : -10,
			pointerEvents: shouldShow ? "auto" : "none",
			duration: 0.4,
			ease: "power2.out",
		});
	}, [shouldShow]);

	const scrollTo = (id: string) => {
		const el = getSectionElement(id);
		if (!el) return;
		smoothScrollTo(el, { offset: 80, duration: 1.05 });
	};

	const ITEM_HEIGHT = 44;
	const trackHeight = sections.length * ITEM_HEIGHT;

	return (
		<div
			ref={sidebarRef}
			className="group/sidebar fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 items-start xl:flex"
			style={{ opacity: 0, pointerEvents: "none" }}
		>
			{/* ── Track ── */}
			<div
				ref={trackRef}
				className="relative w-px shrink-0"
				style={{
					height: `${trackHeight}px`,
				}}
			>
				<div className="absolute inset-0 bg-primary/5" />

				<div
					ref={fillRef}
					className="absolute inset-0 origin-top will-change-transform bg-primary/10"
					style={{
						transform: "scaleY(0)",
					}}
				/>

				{/* Dots */}
				{sections.map((section, i) => (
					<DotWithLabel
						key={section.href}
						label={section.label}
						topPx={i * ITEM_HEIGHT + ITEM_HEIGHT / 2}
						isActive={i === activeIndex}
						onClick={() => scrollTo(section.href)}
					/>
				))}
			</div>
		</div>
	);
}

// ─── Dot + Hover Label ────────────────────────────────────────────────────────

function DotWithLabel({
	label,
	topPx,
	isActive,
	onClick,
}: {
	label: string;
	topPx: number;
	isActive: boolean;
	onClick: () => void;
}) {
	return (
		<div
			className="group/item absolute left-1/2 z-2 flex -translate-x-1/2 -translate-y-1/2 items-center"
			style={{
				top: `${topPx}px`,
			}}
		>
			<button
				type="button"
				className="-m-2 cursor-pointer rounded-full border-0 bg-transparent p-2 flex items-center"
				onClick={onClick}
				aria-label={`Go to ${label}`}
			>
				<div
					className={cn(
						"rounded-full transition-all duration-300 ease-out",
						"group-hover/item:scale-125",
						isActive
							? "size-2 border-[1.5px] border-primary/50 bg-primary/95"
							: "size-1.5 border border-primary/10 bg-primary/10 group-hover/item:bg-primary/50",
					)}
				/>
				<span
					className={cn(
						"absolute left-4 select-none whitespace-nowrap",
						"font-jetbrains-mono text-[10px] uppercase tracking-[0.14em]",
						"opacity-50 transition-all duration-200 ease-out",
						"group-hover/item:opacity-100",
						isActive
							? "font-bold text-primary/90 opacity-100"
							: "font-normal text-primary/55",
					)}
				>
					{label}
				</span>
			</button>
		</div>
	);
}
