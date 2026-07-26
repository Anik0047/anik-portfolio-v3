import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { createElement } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerOwnProps<T extends ElementType> {
	children: ReactNode;
	as?: T;
	fullBleed?: boolean;
	innerClassName?: string;
}

type SectionContainerProps<T extends ElementType> =
	SectionContainerOwnProps<T> &
		Omit<ComponentPropsWithoutRef<T>, keyof SectionContainerOwnProps<T>>;

export default function SectionContainer<T extends ElementType = "section">({
	children,
	className,
	innerClassName,
	as,
	fullBleed = false,
	...rest
}: SectionContainerProps<T>) {
	const Component: ElementType = as ?? "section";
	const content = fullBleed ? (
		children
	) : (
		<div
			className={cn(
				"mx-auto w-full max-w-6xl 2xl:max-w-screen-2xl",
				innerClassName,
			)}
		>
			{children}
		</div>
	);

	return createElement(
		Component,
		{
			...(rest as ComponentPropsWithoutRef<ElementType>),
			"data-animate-section": true,
			className: cn(
				"relative min-h-svh w-full py-4 md:py-8 px-8 scroll-mt-24 md:scroll-mt-28",
				className,
			),
		},
		content,
	);
}
