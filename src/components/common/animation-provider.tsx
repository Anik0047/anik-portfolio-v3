"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionConfig, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type AnimationProviderProps = {
	children: ReactNode;
};

export default function AnimationProvider({
	children,
}: AnimationProviderProps) {
	const prefersReducedMotion = useReducedMotion();
	const pathname = usePathname();

	useEffect(() => {
		if (prefersReducedMotion) return;

		gsap.registerPlugin(ScrollTrigger);
		gsap.config({ autoSleep: 60, nullTargetWarn: false });
		ScrollTrigger.config({ ignoreMobileResize: true });
		gsap.ticker.lagSmoothing(1000, 16);
		gsap.defaults({ ease: "power3.out", duration: 0.72 });

		return;
	}, [prefersReducedMotion]);

	useEffect(() => {
		if (prefersReducedMotion) return;

		const ctx = gsap.context(() => {
			const cleanups: Array<() => void> = [];

			const revealTargets = gsap.utils.toArray<HTMLElement>(
				"main [data-animate-section], main [data-slot='card']",
			);

			revealTargets.forEach((target) => {
				if (target.dataset.animated === "true") return;

				target.dataset.animated = "true";
				gsap.set(target, {
					y: 16,
					opacity: 0,
					scale: 0.994,
				});
			});

			ScrollTrigger.batch(revealTargets, {
				start: "top 90%",
				onEnter: (batch) => {
					batch.forEach((node) => {
						(node as HTMLElement).style.willChange = "transform, opacity";
					});

					gsap.to(batch, {
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.68,
						stagger: 0.06,
						ease: "power3.out",
						overwrite: true,
						onComplete: () => {
							batch.forEach((node) => {
								(node as HTMLElement).style.willChange = "auto";
							});
						},
					});
				},
				onLeaveBack: (batch) => {
					gsap.set(batch, { y: 0, opacity: 1 });
				},
			});

			const staggerGroups = gsap.utils.toArray<HTMLElement>(
				"main [data-animate-stagger]",
			);
			staggerGroups.forEach((group) => {
				const children = Array.from(group.children) as HTMLElement[];
				if (children.length === 0) return;

				gsap.set(children, {
					y: 12,
					opacity: 0,
					scale: 0.996,
				});

				gsap.fromTo(
					children,
					{ y: 12, opacity: 0, scale: 0.996 },
					{
						onStart: () => {
							children.forEach((node) => {
								node.style.willChange = "transform, opacity";
							});
						},
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 0.52,
						stagger: 0.05,
						ease: "power3.out",
						onComplete: () => {
							children.forEach((node) => {
								node.style.willChange = "auto";
							});
						},
						scrollTrigger: {
							trigger: group,
							start: "top 90%",
							toggleActions: "play none none none",
						},
					},
				);
			});

			const headingTargets = gsap.utils.toArray<HTMLElement>(
				"main [data-animate-heading]",
			);

			headingTargets.forEach((heading) => {
				gsap.set(heading, {
					y: 10,
					opacity: 0,
				});

				gsap.to(heading, {
					y: 0,
					opacity: 1,
					duration: 0.56,
					ease: "power3.out",
					overwrite: true,
					scrollTrigger: {
						trigger: heading,
						start: "top 90%",
						toggleActions: "play none none none",
					},
				});
			});

			const parallaxTargets = gsap.utils.toArray<HTMLElement>(
				"main [data-animate-parallax]",
			);

			parallaxTargets.forEach((target) => {
				gsap.fromTo(
					target,
					{ y: 10 },
					{
						y: -10,
						ease: "none",
						overwrite: true,
						scrollTrigger: {
							trigger: target,
							start: "top bottom",
							end: "bottom top",
							scrub: 0.7,
						},
					},
				);
			});

			requestAnimationFrame(() => ScrollTrigger.refresh());

			cleanups.push(() => {});

			return () => {
				for (const cleanup of cleanups) {
					cleanup();
				}
			};
		});

		return () => {
			ctx.revert();
		};
	}, [pathname, prefersReducedMotion]);

	return (
		<MotionConfig
			reducedMotion="user"
			transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</MotionConfig>
	);
}
