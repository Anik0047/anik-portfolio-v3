"use client";

import { ChevronDown } from "lucide-react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

function Collapsible({
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

function CollapsibleTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Trigger>) {
	return (
		<CollapsiblePrimitive.Trigger
			data-slot="collapsible-trigger"
			className={cn(
				"group flex w-full items-center justify-between gap-3 border border-dashed px-4 py-3 text-left typo-mono text-sm transition-colors hover:border-primary/60 hover:text-foreground",
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDown className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
		</CollapsiblePrimitive.Trigger>
	);
}

function CollapsibleContent({
	className,
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Content>) {
	return (
		<CollapsiblePrimitive.Content
			data-slot="collapsible-content"
			className={cn(
				"data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 overflow-hidden",
				className,
			)}
			{...props}
		/>
	);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
