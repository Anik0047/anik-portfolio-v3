import type { MetadataRoute } from "next";
import { getAllProjectIds } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

const SECTION_ANCHORS = [
	"home",
	"profile",
	"experience",
	"projects",
	"skills",
	"contact",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	const projectEntries: MetadataRoute.Sitemap = getAllProjectIds().map((id) => ({
		url: `${siteUrl}/projects/${id}`,
		lastModified,
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	const sectionEntries: MetadataRoute.Sitemap = SECTION_ANCHORS.map((anchor) => ({
		url: `${siteUrl}/#${anchor}`,
		lastModified,
		changeFrequency: "weekly",
		priority: 0.65,
	}));

	return [
		{
			url: `${siteUrl}/`,
			lastModified,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteUrl}/resume`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/legal/privacy`,
			lastModified,
			changeFrequency: "yearly",
			priority: 0.4,
		},
		{
			url: `${siteUrl}/legal/terms`,
			lastModified,
			changeFrequency: "yearly",
			priority: 0.4,
		},
		...projectEntries,
		...sectionEntries,
	];
}
