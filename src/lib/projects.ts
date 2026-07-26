import { prj1Img, prj2Img, prj3Img } from '@/lib/assets';

export interface ProjectItem {
  id: string;
  name: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  summary: string;
  description?: string;
  year: string;
  role: string;
  highlights: string[];
  stack: string[];
  challenge?: string;
  impact?: string;
  link?: string;
  github?: string;
}

// export const projects: ProjectItem[] = [
// 	{
// 		id: "prj-1",
// 		name: "Auronum Website",
// 		thumbnail: prj1Img,
// 		thumbnailAlt: "Auronum website project preview",
// 		year: "2025",
// 		role: "Web Rebranding and Development",
// 		summary:
// 			"Led end-to-end website rebranding with custom theme work and UX-focused performance improvements.",
// 		description:
// 			"Handled a full website rebrand for Auronum, including visual refresh, theme customization, and frontend refinement to better align with brand positioning and user goals.",
// 		challenge:
// 			"Balancing a strong new visual identity with performance, maintainability, and a smooth user experience on a WordPress stack.",
// 		impact:
// 			"Delivered a cleaner and faster experience with improved usability, updated branding consistency, and a more polished user journey.",
// 		highlights: [
// 			"Led complete website rebranding across layout, style, and content presentation.",
// 			"Customized WordPress themes using PHP, CSS, and JavaScript.",
// 			"Improved frontend performance and overall UX.",
// 		],
// 		stack: ["WordPress", "PHP", "CSS", "JavaScript"],
// 		link: "https://auronum.co.uk",
// 	},
// 	{
// 		id: "prj-2",
// 		name: "1440 Media, LLC Website",
// 		thumbnail: prj2Img,
// 		thumbnailAlt: "1440 Media website project preview",
// 		year: "2023",
// 		role: "Frontend Developer",
// 		summary:
// 			"Built the original dynamic and SEO-optimized marketing website with responsive UX and custom motion.",
// 		description:
// 			"Developed the original public website experience for 1440 Media with a focus on responsive design, SEO foundations, and interactive polish.",
// 		challenge:
// 			"Creating a modern, animation-rich marketing site while maintaining SEO quality, performance, and cross-device consistency.",
// 		impact:
// 			"Shipped a strong original website foundation with responsive behavior and polished interactions tailored for a broad audience.",
// 		highlights: [
// 			"Built dynamic page sections and reusable UI components.",
// 			"Implemented responsive layouts across breakpoints.",
// 			"Delivered custom animations without sacrificing usability.",
// 			"Implemented SEO-conscious structure and metadata patterns.",
// 		],
// 		stack: ["Next.js", "Tailwind CSS", "JavaScript", "SEO"],
// 		link: "https://join1440.com",
// 	},
// 	{
// 		id: "prj-3",
// 		name: "Nerrative Technology, Inc. Website",
// 		thumbnail: prj3Img,
// 		thumbnailAlt: "Nerrative website project preview",
// 		year: "2023",
// 		role: "Web and UI Developer",
// 		summary:
// 			"Developed a fully responsive website with interactive UI and custom animations.",
// 		description:
// 			"Built the Nerrative website experience with responsive structure, interaction-driven UI, and animation details aligned to the brand direction.",
// 		challenge:
// 			"Maintaining visual consistency and responsive quality while implementing custom animations and interactive elements.",
// 		impact:
// 			"Delivered a polished, modern frontend experience and contributed to a production-ready website architecture.",
// 		highlights: [
// 			"Implemented responsive layouts and interaction patterns with Next.js.",
// 			"Built custom animations and transitions for key UI sections.",
// 			"Maintained component quality and consistency using Tailwind CSS.",
// 		],
// 		stack: ["Next.js", "Tailwind CSS", "Responsive Design", "UI Animation"],
// 		link: "https://www.nerrative.com",
// 	},
// ];

// Make sure to import your actual thumbnail images at the top of your file
// import restoraImg from '@/assets/restora.png';
// import aladinImg from '@/assets/aladin.png';
// import raadiallImg from '@/assets/raadiall.png';

export const projects: ProjectItem[] = [
  {
    id: 'prj-1',
    name: 'Restora — SaaS Restaurant Platform',
    thumbnail: prj1Img, // Replace with your actual import
    thumbnailAlt: 'Restora SaaS platform project preview',
    year: '2026',
    role: 'Frontend Engineer',
    summary:
      'Architected a multi-tenant SaaS POS and restaurant management system powering daily operations for 10+ live merchants.',
    description:
      'Built a scalable frontend architecture from scratch for a multi-tenant SaaS platform. Developed comprehensive admin dashboards for product, POS, order, and category management, featuring role-based route guards and real-time data synchronization.',
    challenge:
      'Designing a highly scalable and reusable component architecture that allows rapid onboarding of new restaurant merchants while handling complex real-time order states across multiple tenants.',
    impact:
      'Reduced manual order tracking time by ~2 hours per day per restaurant. The scalable architecture reduced new developer onboarding time from ~2 weeks to ~1 week.',
    highlights: [
      'Established scalable Next.js architecture and reusable ShadCN UI components from scratch.',
      'Built a full admin dashboard with role-based route guards for POS, Products, and Orders.',
      'Integrated Socket.IO for real-time order tracking and live POS updates.',
      'Optimized state management using TanStack Query for complex, high-frequency data fetching.',
    ],
    stack: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'ShadCN UI',
      'Radix UI',
      'Socket.IO',
      'TanStack Query',
    ],
    link: 'https://restora.com.bd/', // Replace with your actual link
  },
  {
    id: 'prj-2',
    name: 'Aladin — Multi-Vendor E-Commerce',
    thumbnail: prj2Img, // Replace with your actual import
    thumbnailAlt: 'Aladin multi-vendor e-commerce project preview',
    year: '2026',
    role: 'Frontend Engineer',
    summary:
      'Delivered a complete multi-vendor marketplace supporting 3 user roles and an automated vendor onboarding workflow.',
    description:
      'Engineered a multi-vendor e-commerce platform featuring distinct dashboards and workflows for Admins, Vendors, and Customers. Handled complex client-side state for vendor approval workflows, product catalogs, and order processing.',
    challenge:
      'Managing complex state across 3 distinct user roles with varying permissions, while ensuring a seamless and optimistic UX for vendors managing their store inventory.',
    impact:
      'Enabled the client to successfully onboard their first 10+ vendors within the first month of launch. Eliminated ongoing developer dependency for daily store management.',
    highlights: [
      'Developed a 3-role system (Admin, Vendor, Customer) with protected routes.',
      'Implemented vendor approval workflows and automated commission tracking UI.',
      'Used optimistic UI updates via TanStack Query for seamless product CRUD operations.',
      'Integrated REST APIs with robust error handling and loading states to prevent layout shifts.',
    ],
    stack: [
      'Next.js',
      'Redux Toolkit',
      'TanStack Query',
      'Tailwind CSS',
      'JWT',
    ],
    link: 'https://www.alladin.com.bd/', // Replace with your actual link
  },
  {
    id: 'prj-3',
    name: 'Raadiall — Real-Time Bus Ticket Booking',
    thumbnail: prj3Img, // Replace with your actual import
    thumbnailAlt: 'Raadiall bus ticket booking project preview',
    year: '2025',
    role: 'Frontend Developer',
    summary:
      'Developed a real-time seat booking system with dynamic availability and a seamless transactional flow.',
    description:
      'Built a highly interactive bus ticket booking platform featuring a real-time seat selection interface. Implemented dynamic availability logic to prevent double-booking and a complete transactional flow for user management.',
    challenge:
      'Ensuring absolute data consistency for seat availability in a real-time environment where multiple users might be selecting the same seats simultaneously.',
    impact:
      'Delivered a frictionless booking experience with zero layout shifts during state updates, successfully handling concurrent user interactions via WebSockets.',
    highlights: [
      'Developed a dynamic, real-time seat booking interface using Socket.IO.',
      'Implemented transactional flow for ticket booking, payments, and user auth.',
      'Managed complex real-time UI states without layout shifts.',
      'Built responsive UI components using Tailwind CSS and Radix UI.',
    ],
    stack: [
      'React',
      'TypeScript',
      'Socket.IO',
      'TanStack Query',
      'Tailwind CSS',
      'Radix UI',
    ],
    link: 'https://raadiall.com/', // Replace with your actual link
  },
];

export function getProjectById(id: string): ProjectItem | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectBySlug(slug: string): ProjectItem | undefined {
  // Support both ID and slugified name
  const slugified = slug.toLowerCase().replace(/-/g, ' ');
  return projects.find(
    (project) =>
      project.id === slug ||
      project.name.toLowerCase() === slugified ||
      project.name.toLowerCase().replace(/\s+/g, '-') === slug,
  );
}

export function getAllProjectIds(): string[] {
  return projects.map((project) => project.id);
}
