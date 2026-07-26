"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavbarStore } from "@/stores/navbar-store";

const THUMB_HEIGHT = 64;
const TOP_OFFSET = 90;
const BOTTOM_OFFSET = 60;
const LERP_STIFFNESS = 120;
const LERP_DAMPING = 20;

function ScrollIndicatorContent() {
	const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const rafRef = useRef<number | null>(null);
	const isDraggingRef = useRef(false);
	const dragStartYRef = useRef(0);
	const dragStartThumbYRef = useRef(0);

	const rawY = useMotionValue(TOP_OFFSET);
	const smoothY = useSpring(rawY, {
		stiffness: LERP_STIFFNESS,
		damping: LERP_DAMPING,
	});
	const opacity = useMotionValue(0);
	const smoothOpacity = useSpring(opacity, { stiffness: 40, damping: 10 });

	const getTravelRange = useCallback(() => {
		return window.innerHeight - TOP_OFFSET - BOTTOM_OFFSET - THUMB_HEIGHT;
	}, []);

	const thumbYFromScroll = useCallback(() => {
		const docHeight =
			document.documentElement.scrollHeight - window.innerHeight;
		const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
		return TOP_OFFSET + progress * getTravelRange();
	}, [getTravelRange]);

	const scrollFromThumbY = useCallback(
		(thumbY: number) => {
			const clamped = Math.max(
				TOP_OFFSET,
				Math.min(TOP_OFFSET + getTravelRange(), thumbY),
			);
			const progress = (clamped - TOP_OFFSET) / getTravelRange();
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			window.scrollTo({ top: progress * docHeight });
			return clamped;
		},
		[getTravelRange],
	);

	const scheduleHide = useCallback(() => {
		if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		hideTimerRef.current = setTimeout(() => opacity.set(0), 1000);
	}, [opacity]);

	// Scroll → thumb
	useEffect(() => {
		const handleScroll = () => {
			if (isDraggingRef.current) return;
			if (rafRef.current !== null) return;

			rafRef.current = window.requestAnimationFrame(() => {
				rafRef.current = null;
				rawY.set(thumbYFromScroll());
				opacity.set(1);
				scheduleHide();
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafRef.current !== null) {
				window.cancelAnimationFrame(rafRef.current);
				rafRef.current = null;
			}
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		};
	}, [rawY, opacity, thumbYFromScroll, scheduleHide]);

	// Track pointer down — jump thumb to click position, then drag
	const handleTrackPointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.currentTarget.setPointerCapture(e.pointerId);

			isDraggingRef.current = true;
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
			opacity.set(1);

			// Jump thumb to click position (centered on cursor)
			const clickY = e.clientY - THUMB_HEIGHT / 2;
			const snapped = scrollFromThumbY(clickY);

			// Disable spring for 1:1 feel during drag
			rawY.set(snapped);
			smoothY.jump(snapped);

			dragStartYRef.current = e.clientY;
			dragStartThumbYRef.current = snapped;
		},
		[opacity, rawY, smoothY, scrollFromThumbY],
	);

	const handleTrackPointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (!isDraggingRef.current) return;

			const delta = e.clientY - dragStartYRef.current;
			const newThumbY = dragStartThumbYRef.current + delta;
			const clamped = scrollFromThumbY(newThumbY);

			rawY.set(clamped);
			smoothY.jump(clamped); // bypass spring during drag
		},
		[rawY, smoothY, scrollFromThumbY],
	);

	const handleTrackPointerUp = useCallback(() => {
		if (!isDraggingRef.current) return;
		isDraggingRef.current = false;
		scheduleHide();
	}, [scheduleHide]);

	const open = useNavbarStore((s) => s.isMenuOpen);

	if (open) return null;

	return (
		// Invisible track — full height, captures all pointer events
		<div
			className="fixed top-0 right-0 w-4 h-full z-25"
			onPointerDown={handleTrackPointerDown}
			onPointerMove={handleTrackPointerMove}
			onPointerUp={handleTrackPointerUp}
			onPointerCancel={handleTrackPointerUp}
		>
			<motion.div
				style={{ y: smoothY, opacity: smoothOpacity }}
				className="absolute right-0 w-2 h-16 rounded-full bg-primary pointer-events-none"
			/>
		</div>
	);
}

export default function ScrollIndicator() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 1024);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (isMobile) return null;

	return <ScrollIndicatorContent />;
}
