"use client";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "@/components/layout/contents";
import { smoothScrollTo } from "@/lib/scroll";

export default function Footer() {
	const currentYear = new Date().getFullYear();
	const router = useRouter();

	const crawlableLinks = NAV_LINKS.filter(
		(item): item is (typeof NAV_LINKS)[number] & { href: string } =>
			item.type === "link" && typeof item.href === "string",
	);

	const handleBackToTop = () => {
		smoothScrollTo(0, { duration: 1.1 });
	};

	const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();

		if (href.startsWith("/#")) {
			const targetId = href.replace("/#", "");
			const target = document.getElementById(targetId);

			if (target) {
				smoothScrollTo(target);
				window.history.replaceState(null, "", href);
				return;
			}
		}

		router.push(href);
	};

	return (
		<footer className="FOOTER w-full p-4 pt-8 pb-24 sm:p-8 sm:pb-28 lg:pb-8">
			<Script
				src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js"
				strategy="afterInteractive"
			/>

			<div className="w-full border-t bordentByIder/60 pt-8">
				<div className="flex flex-row items-center justify-between gap-5">
					<p className="text-3xl sm:text-4xl typo-display leading-none tracking-wide">
						Anik{" "}
						<span className="typo-display-outline text-primary">Barua</span>
					</p>

					<button
						type="button"
						onClick={handleBackToTop}
						className="inline-flex cursor-pointer items-center gap-1 border border-border/70 px-2.5 py-1 text-xs typo-mono uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
						title="Back to top"
						aria-label="Back to top"
					>
						Top
						<ArrowUp className="size-3.5" />
					</button>
				</div>
			<nav
				aria-label="Primary site links"
				className="mt-6 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs typo-mono uppercase tracking-[0.12em] text-muted-foreground"
			>
				{crawlableLinks.map((item) => (
					<button
						key={item.id}
						onClick={handleNavClick(item.href)}
						className="border border-border/60 px-2.5 py-1 transition-colors hover:border-primary/50 hover:text-foreground bg-transparent cursor-pointer hover:bg-transparent"
					>
						{item.label}
					</button>
				))}
			</nav>
				<div className="mt-7 flex gap-3 text-xs text-muted-foreground items-center sm:gap-6 justify-between">
					<small className="COPYRIGHT">
						© {currentYear} Anik Barua. All rights reserved.
					</small>

					
				</div>
			</div>
		</footer>
	);
}
