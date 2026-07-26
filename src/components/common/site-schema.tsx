import { NAV_LINKS, SOCIAL_LINKS } from "@/components/layout/contents";
import { siteUrl } from "@/lib/site";

export default function SiteSchema() {
	const navItems = NAV_LINKS.filter(
		(item): item is (typeof NAV_LINKS)[number] & { href: string } =>
			item.type === "link" && typeof item.href === "string",
	).map((item) => ({
		"@type": "SiteNavigationElement",
		name: item.label,
		url: `${siteUrl}${item.href}`,
	}));

	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		"@id": `${siteUrl}#person`,
		name: "Siam Parvez",
		url: siteUrl,
		jobTitle: "Full-Stack Engineer",
		description:
			"Full-Stack Engineer and aspiring SDET specializing in scalable web applications, cloud infrastructure, and modern testing frameworks.",
		sameAs: SOCIAL_LINKS.map((profile) => profile.href),
	};

	const webSiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${siteUrl}#website`,
		name: "Siam Parvez",
		url: siteUrl,
		description:
			"Portfolio website of Siam Parvez, Full-Stack Engineer and aspiring SDET.",
		publisher: {
			"@id": `${siteUrl}#person`,
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@graph": navItems,
					}),
				}}
			/>
		</>
	);
}
