import {
	Briefcase,
	Code2,
	FileText,
	FileUser,
	Folder,
	Home,
	type LucideIcon,
	Send,
	ShieldCheck,
	SunMoon,
	User,
} from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import type { IconType } from "react-icons/lib";

export type NavItem = {
	id: string;
	label: string;
	description?: string;
	icon: LucideIcon;
	href?: string;
	type?: "link" | "theme";
	shortcut?: string;
	hasDot?: boolean;
};

export const NAV_LINKS: NavItem[] = [
	{
		id: "home",
		label: "Home",
		description: "Launch the journey",
		href: "/#home",
		icon: Home,
		type: "link",
	},
	{
		id: "profile",
		label: "Profile",
		description: "Meet the maker",
		href: "/#profile",
		icon: User,
		type: "link",
	},
	{
		id: "experience",
		label: "Experience",
		description: "Battle-tested craft",
		href: "/#experience",
		icon: Briefcase,
		type: "link",
	},
	{
		id: "projects",
		label: "Projects",
		description: "Ideas made real",
		href: "/#projects",
		icon: Folder,
		type: "link",
	},
	{
		id: "skills",
		label: "Skills",
		description: "Tools of trade",
		href: "/#skills",
		icon: Code2,
		type: "link",
	},
	{
		id: "contact",
		label: "Contact",
		description: "Let's build together",
		href: "/#contact",
		icon: Send,
		type: "link",
	},
	{
		id: "resume",
		label: "Resume",
		description: "Career at glance",
		href: "/resume",
		icon: FileUser,
		type: "link",
	},
	{
		id: "theme",
		label: "Switch Theme",
		description: "Flip the vibe",
		icon: SunMoon,
		type: "theme",
	},
];

export const LEGAL_LINKS: NavItem[] = [
	{
		id: "terms",
		label: "Terms",
		description: "Usage terms and conditions",
		href: "/legal/terms",
		icon: FileText,
		type: "link",
	},
	{
		id: "privacy",
		label: "Privacy",
		description: "Privacy and data policy",
		href: "/legal/privacy",
		icon: ShieldCheck,
		type: "link",
	},
];

type SocialLink = {
	label: string;
	description?: string;
	icon: IconType;
	href: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'GitHub',
    description: 'Open-source code and contributions',
    icon: FaGithub,
    href: 'https://github.com/Anik0047',
  },
  {
    label: 'LinkedIn',
    description: 'Professional profile and experience',
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/anik0047',
  },
//   {
//     label: 'X (Twitter)',
//     description: 'Updates, thoughts, and announcements',
//     icon: FaXTwitter,
//     href: 'https://x.com/TheOne_Siam',
//   },
];
