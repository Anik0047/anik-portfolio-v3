"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import {
	AnimatedSpan,
	Terminal,
	TypingAnimation,
} from "@/components/ui/terminal";

export default function Preloader() {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (!visible) return;

		const html = document.documentElement;
		const body = document.body;

		html.style.overflow = "hidden";
		body.style.overflow = "hidden";

		return () => {
			html.style.overflow = "";
			body.style.overflow = "";
		};
	}, [visible]);

	const handleComplete = () => {
		setVisible(false);
	};

	return (
		<AnimatePresence mode="wait">
			{visible && (
				<motion.div
					key="preloader"
					initial={{ opacity: 1 }}
					exit={{
						opacity: 0,
						scale: 0.96,
						filter: "blur(8px)",
						y: -40,
					}}
					transition={{
						duration: 0.5,
						ease: [0.76, 0, 0.24, 1],
					}}
					className="fixed inset-0 z-90 flex items-center justify-center bg-background p-10"
				>
					<Terminal>
						<TypingAnimation className="lg:text-lg">
							$ pnpm dlx siam@latest init
						</TypingAnimation>

						<AnimatedSpan className="lg:text-lg">
							<div>
								<span className="text-green-500">✔</span>
								<span> Checking registry</span>
							</div>
						</AnimatedSpan>

						<AnimatedSpan className="lg:text-lg">
							<div>
								<span className="text-green-500">✔</span>
								<span> Loading something amazing</span>
							</div>
						</AnimatedSpan>

						<AnimatedSpan className="lg:text-lg">
							<div>
								<span className="text-green-500">✔</span>
								<span> Loaded 1 portfolio of:</span>
							</div>
							<span className="pl-4.5 text-muted-foreground">
								- Siam Parvez
							</span>
						</AnimatedSpan>

						<TypingAnimation
							className="mt-3 font-bold text-green-500 lg:text-lg"
							onComplete={handleComplete}
						>
							✔ Initialization complete.
						</TypingAnimation>
					</Terminal>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
