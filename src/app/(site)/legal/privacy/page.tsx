import { BanknoteX, CalendarDays, Clock3, Mail } from "lucide-react";
import type { Metadata } from "next";
import ContacBlock from "@/components/layout/contact-block";
import SectionContainer from "@/components/layout/section-container";
import { Card } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CornerBracket } from "@/components/ui/corner-brackets";
import { siteUrl } from "@/lib/site";
import { PHILOSOPHY, PRIVACY_SECTIONS, STATS } from "./content";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"Your privacy is paramount. This policy explains how data is collected, used, and protected on this website.",
	alternates: {
		canonical: `${siteUrl}/legal/privacy`,
	},
};

const STAT_ICONS = {
	calendar: CalendarDays,
	ban: BanknoteX,
	clock: Clock3,
	mail: Mail,
} as const;

export default function PrivacyPage() {
	return (
		<SectionContainer
			id="privacy"
			innerClassName="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-24"
		>
			<div>
				<Card className="rounded-none gap-6 relative">
					<CornerBracket
						position="top-right"
						className="opacity-100"
						offset={10}
					/>
					<CornerBracket
						position="bottom-left"
						className="opacity-100"
						offset={10}
					/>
					<span className="pointer-events-none absolute top-5 right-8 text-2xl typo-display-outline typo-ghost text-muted-foreground/70">
						SP_PRV
					</span>

					<p className="text-sm typo-mono typo-code">
						<span className="text-primary">$</span>
						<span className="text-muted-foreground">
							{" "}
							legal --view privacy{" "}
						</span>
					</p>

					<div>
						<h1 className="text-4xl xxs:text-5xl typo-display">
							Privacy{" "}
							<span className="typo-display-outline text-primary">Policy</span>
						</h1>
						<h2 className="typo-mono typo-label text-base text-primary mt-2">
							Legal Notice
						</h2>
					</div>

					<p className="text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
						Your privacy is paramount. This policy explains exactly how data is
						collected, used, and protected. I believe in full transparency and
						minimal data collection.
					</p>
				</Card>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-l border-t">
				{STATS.map(({ key, value, description, icon }) => {
					const Icon = STAT_ICONS[icon];

					return (
						<div key={key}>
							<Card className="rounded-none border-r border-b border-l-0 border-t-0 gap-3 relative overflow-hidden">
								<p className="text-xs typo-mono typo-label text-primary">
									{key}
								</p>
								<p className="text-2xl typo-display-cond lowercase">{value}</p>
								<p className="text-sm text-muted-foreground">{description}</p>
								<Icon className="absolute right-5 top-1/2 -translate-y-1/2 size-16 text-foreground/5" />
							</Card>
						</div>
					);
				})}
			</div>

			<Card className="rounded-none border border-dashed border-l-2 border-l-primary gap-3 sm:flex-row sm:items-start">
				<p className="text-xs typo-mono typo-label uppercase tracking-[0.14em] text-primary">
					Philosophy
				</p>
				<p className="text-sm font-inter text-muted-foreground leading-relaxed">
					{PHILOSOPHY}
				</p>
			</Card>

			<div className="border border-dashed">
				{PRIVACY_SECTIONS.map((section, index) => (
					<div key={section.title}>
						<Collapsible defaultOpen={index === 0}>
							<CollapsibleTrigger className="border-x-0 border-t-0 border-b border-dashed px-6 py-6">
								<div className="grid w-full grid-cols-[2.5rem_1fr] items-start gap-3">
									<p className="text-xs typo-mono typo-label text-primary pt-1">
										{String(index + 1).padStart(2, "0")}
									</p>
									<div>
										<h3 className="text-2xl font-inter font-semibold uppercase leading-none tracking-tight">
											{section.title}
										</h3>
										<p className="mt-2 text-sm font-inter text-muted-foreground leading-relaxed">
											{section.subtitle}
										</p>
									</div>
								</div>
							</CollapsibleTrigger>

							<CollapsibleContent>
								<div className="border-b border-dashed p-6 md:px-20 md:py-12 space-y-6">
									{section.clauses.map((clause) => (
										<div key={clause.heading} className="space-y-2">
											<p className="text-xs font-inter font-semibold uppercase tracking-[0.12em] text-foreground inline-flex items-center gap-2">
												<span className="size-1.5 bg-primary inline-block" />
												{clause.heading}
											</p>
											<p className="text-sm font-inter text-muted-foreground leading-relaxed">
												{clause.body}
											</p>

											{"link" in clause && clause.link ? (
												<a
													href={clause.link.href}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex w-fit text-sm font-inter text-foreground underline underline-offset-4 decoration-foreground/20 hover:text-primary hover:decoration-primary"
												>
													{clause.link.label}
												</a>
											) : null}

											{"pills" in clause && clause.pills ? (
												<div className="flex flex-wrap gap-2 pt-1">
													{clause.pills.map((pill) => (
														<span
															key={pill}
															className="text-[10px] typo-mono typo-label uppercase tracking-[0.12em] text-muted-foreground border border-dashed px-2 py-1"
														>
															{pill}
														</span>
													))}
												</div>
											) : null}
										</div>
									))}
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>
				))}
			</div>

			<ContacBlock />
		</SectionContainer>
	);
}
