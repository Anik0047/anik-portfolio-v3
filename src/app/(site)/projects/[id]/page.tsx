import { ArrowLeft, Code, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SectionContainer from "@/components/layout/section-container";
import { Card } from "@/components/ui/card";
import { CornerBracket } from "@/components/ui/corner-brackets";
import { getAllProjectIds, getProjectById, projects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

interface ProjectPageProps {
	params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
	return getAllProjectIds().map((id) => ({
		id,
	}));
}

export async function generateMetadata({
	params,
}: ProjectPageProps): Promise<Metadata> {
	const { id } = await params;
	const project = getProjectById(id);

	if (!project) {
		return {
			title: "Project Not Found",
			description: "The project you're looking for doesn't exist.",
		};
	}

	const images = project.thumbnail ? [project.thumbnail] : undefined;

	return {
		title: `${project.name} | Projects`,
		description: project.summary,
		openGraph: {
			title: project.name,
			description: project.summary,
			type: "article",
			images,
		},
		twitter: {
			card: "summary_large_image",
			title: project.name,
			description: project.summary,
			images,
		},
	};
}

export default async function ProjectPage({ params }: ProjectPageProps) {
	const { id } = await params;
	const project = getProjectById(id);

	if (!project) {
		return (
			<SectionContainer innerClassName="flex flex-col items-center justify-center min-h-[60vh] gap-6">
				<Card className="rounded-none border border-border/70 max-w-2xl w-full relative">
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
						<span className="text-muted-foreground"> project --lookup </span>
					</p>
					<h1 className="text-3xl typo-display">Project Not Found</h1>
					<p className="text-muted-foreground">
						The project you're looking for doesn't exist.
					</p>
					<span className="pointer-events-none absolute top-5 right-8 text-2xl typo-display-outline typo-ghost text-muted-foreground/70">
						SP_404
					</span>
				</Card>
				<Link
					href="/#projects"
					className="text-primary hover:underline inline-flex items-center gap-1 typo-mono text-sm"
				>
					<ArrowLeft className="size-4" />
					Back to Projects
				</Link>
			</SectionContainer>
		);
	}

	const projectIndex = projects.findIndex((p) => p.id === project.id);
	const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
	const nextProject =
		projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;
	const caseSections = [
		{
			title: "Overview",
			subtitle: "Project context and scope",
			content: project.description,
		},
		{
			title: "Challenge",
			subtitle: "Key constraints and complexity",
			content: project.challenge,
		},
		{
			title: "Highlights",
			subtitle: "Execution snapshots",
			list: project.highlights,
		},
		{
			title: "Impact",
			subtitle: "Outcome and value delivered",
			content: project.impact,
		},
	].filter((section) => section.content || section.list);

	const creativeWorkSchema = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: project.name,
		description: project.summary,
		url: `${siteUrl}/projects/${project.id}`,
		dateCreated: project.year,
		creator: {
			"@id": `${siteUrl}#person`,
		},
		...(project.thumbnail ? { image: `${siteUrl}${project.thumbnail}` } : {}),
		keywords: project.stack.join(", "),
	};

	return (
		<main className="min-h-screen">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
			/>
			<SectionContainer
				innerClassName="mx-auto grid max-w-6xl grid-cols-1 gap-6 py-24"
				data-animate-stagger
			>
				<div className="flex flex-col gap-4">
					<Link
						href="/#projects"
						className="text-xs typo-mono text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 w-fit"
					>
						<ArrowLeft className="size-3" />
						Back to Projects
					</Link>

					<Card className="rounded-none relative overflow-hidden p-0">
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

						<div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
							<div
								className="relative aspect-16/10 lg:aspect-auto lg:min-h-96 border-b lg:border-b-0 lg:border-r border-border/60 bg-muted/30"
								data-animate-parallax
							>
								{project.thumbnail ? (
									<Image
										src={project.thumbnail}
										alt={project.thumbnailAlt ?? `${project.name} cover image`}
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 100vw, 55vw"
									/>
								) : (
									<div className="absolute inset-0 bg-linear-to-br from-primary/15 via-primary/5 to-transparent" />
								)}
								<div className="absolute inset-0 bg-linear-to-t from-background/95 via-background/35 to-transparent" />
								<div className="absolute left-4 right-4 bottom-4 flex flex-wrap items-center gap-2">
									<span className="border border-border/70 bg-background/75 px-2 py-1 text-[10px] typo-mono uppercase tracking-[0.12em] text-primary">
										{project.year}
									</span>
									<span className="border border-border/70 bg-background/75 px-2 py-1 text-[10px] typo-mono uppercase tracking-[0.12em] text-muted-foreground">
										{project.role}
									</span>
								</div>
							</div>

							<div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
								<div className="space-y-4">
									<p className="text-sm typo-mono typo-code">
										<span className="text-primary">$ </span>
										<span className="text-muted-foreground">
											project --inspect {project.id}
										</span>
									</p>
									<h1
										className="text-3xl sm:text-4xl xxs:text-5xl typo-display leading-[0.95]"
										data-animate-heading
									>
										{project.name}
									</h1>
									<p className="text-base sm:text-lg typo-body typo-subtle leading-relaxed">
										{project.summary}
									</p>
								</div>

								<div className="grid grid-cols-2 border-t border-l text-xs typo-mono typo-label text-muted-foreground">
									<div className="border-r border-b p-2">id: {project.id}</div>
									<div className="border-b p-2">
										stack: {project.stack.length}
									</div>
								</div>
							</div>
						</div>

						<span
							className="pointer-events-none absolute top-5 right-8 text-2xl typo-display-outline typo-ghost text-muted-foreground/70"
							data-animate-float
						>
							SP_CASE
						</span>
					</Card>
				</div>

				<div
					className="grid grid-cols-1 lg:grid-cols-12 gap-6"
					data-animate-stagger
				>
					<div className="lg:col-span-8 space-y-6">
						<div className="border border-dashed" data-animate-stagger>
							{caseSections.map((section, index) => (
								<div
									key={section.title}
									className="border-b border-dashed last:border-b-0"
								>
									<div className="px-6 py-6">
										<div className="grid w-full grid-cols-[2.5rem_1fr] items-start gap-3">
											<p className="text-xs typo-mono typo-label text-primary pt-1">
												{String(index + 1).padStart(2, "0")}
											</p>
											<div>
												<h2 className="text-2xl typo-display uppercase leading-none">
													{section.title}
												</h2>
												<p className="mt-2 text-sm text-muted-foreground leading-relaxed">
													{section.subtitle}
												</p>
											</div>
										</div>
									</div>
									<div className="border-t border-dashed p-6 md:px-20 md:py-10 space-y-4">
										{section.content && (
											<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
												{section.content}
											</p>
										)}
										{section.list && (
											<ul className="grid gap-3">
												{section.list.map((highlight) => (
													<li
														key={highlight}
														className="text-sm sm:text-base text-muted-foreground leading-relaxed flex gap-3"
													>
														<span className="size-1.5 bg-primary inline-block mt-2.5 shrink-0" />
														<span>{highlight}</span>
													</li>
												))}
											</ul>
										)}
									</div>
								</div>
							))}
						</div>
					</div>

					<div
						className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-fit"
						data-animate-stagger
					>
						<Card className="rounded-none gap-4 border border-dashed">
							<h3 className="text-sm typo-mono typo-label text-primary uppercase tracking-wide">
								Tech Stack
							</h3>
							<div className="flex flex-wrap gap-2">
								{project.stack.map((tech) => (
									<span
										key={tech}
										className="text-[10px] typo-mono typo-label uppercase tracking-[0.12em] text-muted-foreground border border-dashed px-2 py-1"
									>
										{tech}
									</span>
								))}
							</div>
						</Card>

						{(project.link || project.github) && (
							<Card className="rounded-none gap-4 border border-dashed">
								<h3 className="text-sm typo-mono typo-label text-primary uppercase tracking-wide">
									Links
								</h3>
								<div className="space-y-2">
									{project.link && (
										<a
											href={project.link}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 text-sm typo-body text-primary hover:underline"
										>
											<ExternalLink className="size-3.5" />
											View Live
										</a>
									)}
									{project.github && (
										<a
											href={project.github}
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center gap-2 text-sm typo-body text-primary hover:underline"
										>
											<Code className="size-3.5" />
											View on GitHub
										</a>
									)}
								</div>
							</Card>
						)}
					</div>
				</div>

				{(prevProject || nextProject) && (
					<Card className="rounded-none gap-8 border border-dashed mt-2">
						<h3 className="text-sm typo-mono typo-label text-primary uppercase tracking-wide">
							More Projects
						</h3>
						<div
							className="grid grid-cols-1 md:grid-cols-2 gap-6"
							data-animate-stagger
						>
							{prevProject && (
								<Link
									href={`/projects/${prevProject.id}`}
									className="group flex flex-col gap-3 border border-border/70 hover:border-primary/50 transition-colors rounded-none overflow-hidden"
								>
									<div className="relative aspect-16/10 bg-muted/30">
										{prevProject.thumbnail && (
											<Image
												src={prevProject.thumbnail}
												alt={
													prevProject.thumbnailAlt ??
													`${prevProject.name} preview`
												}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, 50vw"
											/>
										)}
									</div>
									<div className="p-4">
										<span className="text-xs typo-mono text-muted-foreground">
											← Previous
										</span>
										<h4 className="mt-2 text-lg typo-display-cond group-hover:text-primary transition-colors">
											{prevProject.name}
										</h4>
										<p className="mt-1 text-sm typo-body typo-subtle line-clamp-2">
											{prevProject.summary}
										</p>
									</div>
								</Link>
							)}
							{nextProject && (
								<Link
									href={`/projects/${nextProject.id}`}
									className="group flex flex-col gap-3 border border-border/70 hover:border-primary/50 transition-colors rounded-none md:col-start-2 overflow-hidden"
								>
									<div className="relative aspect-16/10 bg-muted/30">
										{nextProject.thumbnail && (
											<Image
												src={nextProject.thumbnail}
												alt={
													nextProject.thumbnailAlt ??
													`${nextProject.name} preview`
												}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, 50vw"
											/>
										)}
									</div>
									<div className="p-4">
										<span className="text-xs typo-mono text-muted-foreground">
											Next →
										</span>
										<h4 className="mt-2 text-lg typo-display-cond group-hover:text-primary transition-colors">
											{nextProject.name}
										</h4>
										<p className="mt-1 text-sm typo-body typo-subtle line-clamp-2">
											{nextProject.summary}
										</p>
									</div>
								</Link>
							)}
						</div>
					</Card>
				)}
			</SectionContainer>
		</main>
	);
}
