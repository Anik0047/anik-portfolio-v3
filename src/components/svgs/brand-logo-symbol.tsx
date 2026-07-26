import { cn } from "@/lib/utils";

export default function BrandLogoSymbol({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 135 135"
			className={cn("fill-primary", className)}
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M0 67.22H134.44V134.44H0L134.44 0H67.33L0 67.22Z" />
		</svg>
	);
}
