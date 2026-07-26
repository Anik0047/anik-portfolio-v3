import type * as React from "react";
import { cn } from "@/lib/utils";
import { CornerBracket } from "./corner-brackets";

type BracketOptions = {
	size?: number;
	thickness?: number;
	color?: string;
	offset?: number;
	className?: string;
};

type CardProps = React.ComponentProps<"div"> & {
	showBracketsOnHover?: boolean;
	bracketProps?: BracketOptions;
	children: React.ReactNode;
};

function Card({
	className,
	showBracketsOnHover = false,
	bracketProps = {},
	children,
	...props
}: CardProps) {
	return (
		<div
			data-slot="card"
			className={cn(
				"relative flex flex-col gap-6 border bg-card text-card-foreground shadow-sm p-6 sm:p-8 md:p-10",
				showBracketsOnHover ? "group rounded-none" : "rounded-xl",
				className,
			)}
			{...props}
		>
			{showBracketsOnHover && (
				<>
					<CornerBracket position="top-left" {...bracketProps} />
					<CornerBracket position="top-right" {...bracketProps} />
					<CornerBracket position="bottom-left" {...bracketProps} />
					<CornerBracket position="bottom-right" {...bracketProps} />
				</>
			)}

			{children}
		</div>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
