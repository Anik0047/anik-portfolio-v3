import { Send } from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";

export default function ContacBlock() {
	return (
		<Card className="rounded-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
			<div>
				<p className="text-xs typo-mono typo-label uppercase tracking-[0.14em] text-muted-foreground">
					Reach out
				</p>
				<h2 className="mt-2 text-3xl typo-display-cond lowercase">
					have questions?
				</h2>
			</div>

			<Link
				href="/#contact"
				className="inline-flex items-center gap-2 border border-dashed px-5 py-3 text-sm hover:border-primary/60 hover:bg-primary/5 transition-colors"
			>
				<Send className="size-4 text-primary" />
				Contact Me
			</Link>
		</Card>
	);
}
