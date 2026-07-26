export const STATS = [
	{
		key: "upd",
		value: "Jan 2026",
		description: "Last Updated",
		icon: "calendar",
	},
	{
		key: "jur",
		value: "Bangladesh",
		description: "Jurisdiction",
		icon: "globe",
	},
	{
		key: "sts",
		value: "Active",
		description: "Binding Status",
		icon: "shield",
	},
	{
		key: "law",
		value: "DMCA",
		description: "Protected Under",
		icon: "scale",
	},
] as const;

export const TERMS_SECTIONS = [
	{
		title: "General Provisions",
		subtitle:
			"The foundation of our legally binding agreement. By accessing this site, you agree.",
		clauses: [
			{
				heading: "Binding Agreement",
				body: 'These Terms of Use ("Terms") constitute a legally binding contract between you ("User", "You") and Siam Parvez ("Owner", "I", "Me"). By accessing, browsing, or using siamparvez.dev and its subdomains, you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms.',
			},
			{
				heading: "Legal Capacity",
				body: "By using this website, you represent and warrant that you are at least 13 years of age and have the legal capacity to enter into binding agreements. If you do not agree with any provision of these Terms, you must immediately cease all use of this website.",
			},
			{
				heading: "Right to Modify",
				body: "I reserve the exclusive right to modify, amend, or update these Terms at any time without prior notice. The Last Updated date indicates the most recent revision. Your continued use of the site following any changes constitutes acceptance of the modified Terms.",
			},
			{
				heading: "Jurisdiction",
				body: "These Terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts located in Bangladesh.",
			},
		],
	},
	{
		title: "Intellectual Property",
		subtitle:
			"All creative works, designs, code, and assets are protected by copyright and IP laws.",
		clauses: [
			{
				heading: "Exclusive Ownership",
				body: "All content on this website including source code, UI and UX designs, animations, visual elements, graphics, SVGs, typography arrangements, color systems, layout architecture, components, and overall aesthetics are the exclusive intellectual property of Siam Parvez, protected under international copyright laws.",
			},
			{
				heading: "Copyright Protection",
				body: "This work is protected under applicable Bangladeshi copyright laws, the Digital Millennium Copyright Act (DMCA) of 1998, and international copyright treaties including the Berne Convention. Unauthorized reproduction, distribution, or derivative works are prohibited.",
			},
			{
				heading: "Prohibited Actions",
				body: "You are prohibited from copying, cloning, reproducing any part of this website, creating derivative works, redistributing source code or design elements, using components or assets commercially, reverse engineering proprietary techniques, or claiming ownership of any content.",
			},
			{
				heading: "Design Theft Warning",
				body: "This is not an open-source project. Any unauthorized use, reproduction, or distribution of this website's designs, components, animations, or visual assets may result in legal enforcement including DMCA takedown notices and related action.",
				warningLabel: "Warning",
			},
		],
	},
	{
		title: "Copyright Enforcement",
		subtitle:
			"Legal measures and remedies pursued against violations of intellectual property rights.",
		clauses: [
			{
				heading: "DMCA Takedowns",
				body: "Unauthorized reproduction may be subject to DMCA takedown notices filed with hosting providers, domain registrars, and search engines.",
			},
			{
				heading: "Legal Action",
				body: "I reserve the right to pursue available legal remedies, including injunctive relief and damages, to protect intellectual property rights.",
			},
			{
				heading: "Evidence Collection",
				body: "Relevant access and technical records may be preserved in cases of suspected infringement and may be used for legal defense or enforcement.",
			},
		],
	},
	{
		title: "Limited License",
		subtitle:
			"Specific permissions granted for viewing and limited inspiration purposes only.",
		clauses: [
			{
				heading: "Viewing Rights",
				body: "You are granted a limited, non-exclusive, non-transferable, revocable license to view and browse this website for personal, non-commercial purposes only.",
			},
			{
				heading: "Inspiration Guidelines",
				body: "You may study techniques for educational purposes, but may not replicate the overall design, component structure, or distinctive visual styling.",
			},
			{
				heading: "Attribution Requirements",
				body: "Any permissible reuse requires explicit written permission and clear attribution as specified by the owner.",
			},
			{
				heading: "License Termination",
				body: "This license terminates automatically upon violation of these Terms. On termination, all use must cease immediately.",
			},
		],
	},
	{
		title: "Disclaimers and Limitations",
		subtitle: "Important limitations on warranties, liability, and damages.",
		clauses: [
			{
				heading: "No Warranties",
				body: "This website is provided as is and as available without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose, non-infringement, or uninterrupted availability.",
			},
			{
				heading: "Limitation of Liability",
				body: "To the maximum extent permitted by law, Siam Parvez shall not be liable for direct, indirect, incidental, special, consequential, or punitive damages arising from use of this website.",
			},
			{
				heading: "External Links",
				body: "This site may link to third-party services. The content and practices of external services are outside this site's control.",
			},
			{
				heading: "No Professional Advice",
				body: "Nothing on this website constitutes professional legal, financial, or other regulated advice.",
			},
		],
	},
	{
		title: "Indemnification and Disputes",
		subtitle:
			"Your obligations to defend and hold harmless against related claims.",
		clauses: [
			{
				heading: "Indemnification",
				body: "You agree to indemnify and hold harmless Siam Parvez from claims, liabilities, damages, and expenses arising from your use of this website or violation of these Terms.",
			},
			{
				heading: "Dispute Resolution",
				body: "Disputes should first be attempted in good faith negotiation. If unresolved, disputes are handled under applicable Bangladeshi law.",
			},
			{
				heading: "Severability",
				body: "If any provision of these Terms is held invalid or unenforceable, remaining provisions remain in full force.",
			},
		],
	},
] as const;
