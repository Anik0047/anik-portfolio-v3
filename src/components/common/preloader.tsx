"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePreloaderStore } from "@/stores/preloader-store";

export default function Preloader() {
	const [visible, setVisible] = useState(true);
	const [logoVisible, setLogoVisible] = useState(true);
	const [scope, animate] = useAnimate();
	const setComplete = usePreloaderStore((s) => s.setComplete);
	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;
		document.documentElement.style.overflow = "hidden";
		document.body.style.overflow = "hidden";

		const run = async () => {
			await new Promise((res) => setTimeout(res, 1000));
			if (!isMounted.current) return;

			setLogoVisible(false);

			if (!isMounted.current || !scope.current) return;
			await animate(
				"#hole-group",
				{ scale: 40 },
				{ duration: 0.35, ease: "easeIn" },
			);

			if (!isMounted.current || !scope.current) return;
			await animate(scope.current, { opacity: 0 }, { duration: 0.2 });

			if (!isMounted.current) return;
			setComplete();
			setVisible(false);
			document.documentElement.style.overflow = "";
			document.body.style.overflow = "";
		};

		run();

		return () => {
			isMounted.current = false;
			// Always restore scroll on unmount (e.g. devtools detection)
			document.documentElement.style.overflow = "";
			document.body.style.overflow = "";
		};
	}, []);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					ref={scope}
					className="fixed inset-0 z-90 pointer-events-none"
					initial={{ opacity: 1 }}
				>
					<svg className="absolute inset-0 w-full h-full">
						<defs>
							<mask id="holeMask">
								<rect width="100%" height="100%" fill="white" />
								<g
									style={{
										transform:
											"translate(calc(50% - 67.22px), calc(50% - 67.22px))",
									}}
								>
									<motion.g
										id="hole-group"
										initial={{ scale: 0 }}
										style={{ transformOrigin: "67.22px 67.22px" }}
									>
										<path
											d="M120.37 67.26L168.8 18.77L187.55 0H161.02H93.91H89.35L86.13 3.22L18.8 70.48L0 89.26H26.58H67.25L18.81 137.65L0 156.44H26.58H161.02H172.02V145.44V78.26V67.26H161.02H120.37Z"
											fill="black"
										/>
									</motion.g>
								</g>
							</mask>
						</defs>
						<rect
							width="100%"
							height="100%"
							className="fill-primary"
							mask="url(#holeMask)"
						/>
					</svg>

					<AnimatePresence>
						{logoVisible && (
							<motion.div
								className="absolute inset-0 flex items-center justify-center"
								exit={{
									scale: 0.6,
									opacity: 0,
									transition: { duration: 0.1, ease: "easeIn" },
								}}
							>
								<svg
									width="135"
									height="135"
									viewBox="0 0 135 135"
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-primary-foreground fill-primary-foreground size-20"
								>
									<motion.path
										d="M0 67.22H134.44V134.44H0L134.44 0H67.33L0 67.22Z"
										strokeWidth="2"
										pathLength="1"
										initial={{ pathLength: 0, fillOpacity: 0 }}
										animate={{ pathLength: 1, fillOpacity: 1 }}
										transition={{
											pathLength: { duration: 0.7, ease: "easeInOut" },
											fillOpacity: {
												delay: 0.7,
												duration: 0.2,
												ease: "easeIn",
											},
										}}
									/>
								</svg>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
