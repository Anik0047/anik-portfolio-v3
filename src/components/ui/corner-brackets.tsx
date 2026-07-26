import { cn } from "@/lib/utils";

type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface CornerBracketProps {
	position: CornerPosition;
	size?: number;
	thickness?: number;
	offset?: number;
	className?: string;
}

export function CornerBracket({
	position,
	size = 18,
	thickness = 2,
	offset = -1,
	className,
}: CornerBracketProps) {
	const isTop = position.startsWith("top");
	const isLeft = position.endsWith("left");

	return (
		<div
			className={cn(
				"absolute z-10 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100",
				className,
			)}
			style={{
				width: size + thickness,
				height: size + thickness,
				...(isTop ? { top: offset } : { bottom: offset }),
				...(isLeft ? { left: offset } : { right: offset }),
			}}
		>
			{/* Horizontal arm */}
			<div
				className={cn("absolute bg-current")}
				style={{
					width: size,
					height: thickness,
					top: isTop ? 0 : undefined,
					bottom: isTop ? undefined : 0,
					left: isLeft ? 0 : undefined,
					right: isLeft ? undefined : 0,
				}}
			/>

			{/* Vertical arm */}
			<div
				className={cn("absolute bg-current")}
				style={{
					width: thickness,
					height: size,
					top: isTop ? 0 : undefined,
					bottom: isTop ? undefined : 0,
					left: isLeft ? 0 : undefined,
					right: isLeft ? undefined : 0,
				}}
			/>
		</div>
	);
}
