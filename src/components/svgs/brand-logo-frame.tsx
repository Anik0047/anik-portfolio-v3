import { cn } from "@/lib/utils";

export default function BrandLogoFrame({ className }: { className?: string }) {
	return (
		<svg
			width="64"
			height="64"
			viewBox="0 0 64 64"
			xmlns="http://www.w3.org/2000/svg"
			className={cn(className)}
		>
			<rect width="64" height="64" rx="12" className="fill-lemon stroke" />
			<path
				d="M14 31.92H49.84V49.84H14L49.84 14H31.9494L14 31.92Z"
				className="fill-black"
			/>
		</svg>
	);
}
