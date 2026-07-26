import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SectionContainer from "@/components/layout/section-container";
import { Card } from "@/components/ui/card";
import { CornerBracket } from "@/components/ui/corner-brackets";

export default function NotFound() {
	return (
		<SectionContainer
			fullBleed
			className="min-h-screen flex items-center justify-center px-4 sm:px-8"
		>
			<div className="w-full max-w-3xl">
				<Card className="rounded-none border border-border/70 relative gap-6">
					<CornerBracket
						position="top-right"
						className="opacity-100 text-primary"
						offset={10}
					/>
					<CornerBracket
						position="bottom-left"
						className="opacity-100 text-primary"
						offset={10}
					/>

					<p className="text-sm typo-mono typo-code">
						<span className="text-primary">$</span>
						<span className="text-muted-foreground"> route --resolve </span>
					</p>

					<h1 className="text-4xl xxs:text-5xl sm:text-6xl typo-display leading-[0.95]">
						404
						<span className="ml-2 typo-display-outline text-primary">
							Not Found
						</span>
					</h1>

					<p className="text-base sm:text-lg typo-body typo-subtle max-w-2xl leading-relaxed">
						The page you are looking for does not exist or has moved.
					</p>

					<div className="pt-2">
						<Link
							href="/"
							className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm typo-mono uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors"
						>
							<ArrowLeft className="size-4" />
							Back Home
						</Link>
					</div>

					<span className="pointer-events-none absolute top-5 right-8 text-2xl typo-display-outline typo-ghost text-muted-foreground/70">
						SP_404
					</span>
				</Card>
			</div>
		</SectionContainer>
	);
}
