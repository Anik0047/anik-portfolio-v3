'use client';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import SectionContainer from '@/components/layout/section-container';
import { Card } from '@/components/ui/card';
import { CornerBracket } from '@/components/ui/corner-brackets';

const CanvasRevealEffect = dynamic(
  () =>
    import('@/components/ui/canvas-reveal-effect').then((m) => ({
      default: m.CanvasRevealEffect,
    })),
  { ssr: false, loading: () => null },
);

import {
  awsdarkIcon,
  awsIcon,
  bashDarkIcon,
  bashIcon,
  cloudflareIcon,
  coldfusionIcon,
  cypressdarkIcon,
  cypressIcon,
  dockerIcon,
  expressjsIcon,
  fastapiIcon,
  gactionsIcon,
  goIcon,
  grafanaIcon,
  graphqlIcon,
  jestIcon,
  jwtIcon,
  kubernetesIcon,
  linuxIcon,
  mongodbIcon,
  nestjsIcon,
  nextjsIcon,
  nginxIcon,
  nodejsIcon,
  phpIcon,
  playwrightIcon,
  postgresqlIcon,
  prismaIcon,
  prometheusIcon,
  pythonIcon,
  reactjsIcon,
  redisIcon,
  seleniumIcon,
  supabaseIcon,
  tailwindcss,
  terraformIcon,
  trpcIcon,
  typescriptIcon,
  // javaIcon,
  // csharpIcon,
  // kotlinIcon,
  // rustIcon,
  // javascriptIcon,
  // vitejsIcon,
  // openidIcon,
} from '@/lib/assets';
import { cn } from '@/lib/utils';

type Skill = {
  name: string;
  href?: string;
  color: string;
  colors: [number, number, number][];
  containerClassName?: string;
  icon: string;
  alt: string;
  className?: string;
};

export default function Skills() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const FRONTEND_SKILLS: Skill[] = [
    {
      name: 'TypeScript',
      color: 'text-[#007acc]',
      icon: typescriptIcon,
      alt: 'TypeScript Logo',
      href: 'https://www.typescriptlang.org/',
      colors: [[0, 122, 204]],
    },
    {
      name: 'React.JS',
      color: 'text-[#61dafb]',
      icon: reactjsIcon,
      alt: 'React.js Logo',
      href: 'https://react.dev/',
      colors: [[97, 218, 251]],
    },
    {
      name: 'Next.JS',
      color: 'text-foreground dark:text-[#dfdfe3]',
      icon: nextjsIcon,
      alt: 'Next.js Logo',
      className: 'dark:invert-90',
      href: 'https://nextjs.org/',
      colors: [[223, 223, 227]],
    },

    {
      name: 'Tailwind CSS',
      color: 'text-[#38bdf8]',
      icon: tailwindcss,
      alt: 'Tailwind CSS Logo',
      href: 'https://tailwindcss.com/',
      colors: [[56, 189, 248]],
    },

    // {
    // 	name: "JavaScript",
    // 	color: "text-[#f7df1e]",
    // 	icon: javascriptIcon,
    // 	alt: "JavaScript Logo",
    // 	className: "opacity-50 dark:opacity-40",
    // 	href: "https://ecma-international.org/publications-and-standards/standards/ecma-262/",
    // 	colors: [[247, 223, 30]],
    // },
    // {
    // 	name: "Vite.JS",
    // 	color: "text-[#a151ff]",
    // 	icon: vitejsIcon,
    // 	alt: "Vite.js Logo",
    // 	className: "opacity-50 dark:opacity-80",
    // 	href: "https://vite.dev/",
    // 	colors: [[161, 81, 255]],
    // },
  ];

  const BACKEND_SKILLS: Skill[] = [
    {
      name: 'Node.JS',
      color: 'text-[#59a946]',
      icon: nodejsIcon,
      alt: 'Node.js Logo',
      href: 'https://nodejs.org/',
      colors: [[89, 169, 70]],
    },
    {
      name: 'Express.JS',
      color: 'text-[#398ccb]',
      icon: expressjsIcon,
      alt: 'Express.js Logo',
      href: 'https://expressjs.com/',
      colors: [[57, 140, 203]],
    },
    {
      name: 'FastAPI',
      color: 'text-[#ea2850]',
      icon: fastapiIcon,
      alt: 'FastAPI Logo',
      href: 'https://fastapi.tiangolo.com/',
      colors: [[234, 40, 80]],
    },
    {
      name: 'GraphQL',
      color: 'text-[#f6009b]',
      icon: graphqlIcon,
      alt: 'GraphQL Logo',
      href: 'https://graphql.org/',
      colors: [[246, 0, 155]],
    },
  ];

  const DB_SKILLS: Skill[] = [
    {
      name: 'Supabase',
      color: 'text-[#3ECF8E]',
      icon: supabaseIcon,
      alt: 'Supabase Logo',
      href: 'https://supabase.com//',
      colors: [[62, 207, 142]],
    },
    {
      name: 'PostgreSQL',
      color: 'text-[#336791]',
      icon: postgresqlIcon,
      alt: 'PostgreSQL Logo',
      href: 'https://www.postgresql.org/',
      colors: [[51, 103, 145]],
    },
    {
      name: 'MongoDB',
      color: 'text-[#ff4438]',
      icon: mongodbIcon,
      alt: 'MongoDB Logo',
      href: 'https://mongodb.com/',
      colors: [[89, 169, 70]],
    },
    {
      name: 'Prisma',
      color: 'text-[#4bb2a8]',
      icon: prismaIcon,
      alt: 'Prisma Logo',
      href: 'https://www.prisma.io/',
      colors: [[75, 178, 168]],
    },
  ];

  const CLOUD_SKILLS: Skill[] = [
    {
      name: 'AWS',
      color: 'text-[#ff9900]',
      icon: theme === 'dark' ? awsIcon : awsdarkIcon,
      alt: 'AWS Logo',
      // className: "opacity-50 ",
      href: 'https://aws.amazon.com/',
      colors: [[255, 153, 0]],
    },

    {
      name: 'Docker',
      color: 'text-[#2560ff]',
      icon: dockerIcon,
      alt: 'Docker Logo',
      // className: "opacity-50 dark:opacity-80",
      href: 'https://www.docker.com/',
      colors: [[37, 96, 255]],
    },

    {
      name: 'Kubernetes',
      color: 'text-[#326ce5]',
      icon: kubernetesIcon,
      alt: 'Kubernetes Logo',
      // className: "opacity-50 dark:opacity-40",
      href: 'https://kubernetes.io/',
      colors: [[50, 108, 229]],
    },

    {
      name: 'JWT',
      color: 'text-[#645dff]',
      icon: jwtIcon,
      alt: 'JWT Logo',
      // className: "opacity-40 dark:opacity-50",
      href: 'https://www.jwt.io/',
      colors: [
        [100, 93, 255],
        [62, 198, 235],
        [255, 68, 221],
        [255, 79, 64],
      ],
    },

    // {
    //   name: 'Terraform',
    //   color: 'text-[#5c4ee5]',
    //   icon: terraformIcon,
    //   alt: 'Terraform Logo',
    //   // className: "opacity-50 dark:opacity-70",
    //   href: 'https://developer.hashicorp.com/terraform/',
    //   colors: [[92, 78, 229]],
    // },
  ];

  const DEVOPS_SKILLS: Skill[] = [
    {
      name: 'GitHub Actions',
      color: 'text-[#2088ff]',
      icon: gactionsIcon,
      alt: 'GitHub Actions Logo',
      // className: "opacity-40 dark:opacity-50",
      href: 'https://github.com/features/actions/',
      colors: [
        [32, 136, 255],
        [121, 184, 255],
      ],
    },
    {
      name: 'Linux',
      color: 'text-[#f5bd0d]',
      icon: linuxIcon,
      alt: 'Linux Logo',
      // className: "opacity-40 dark:opacity-50",
      href: 'https://www.linux.org/',
      colors: [[245, 189, 13]],
    },

    {
      name: 'Bash',
      color: 'text-[#4da925]',
      icon: theme === 'dark' ? bashIcon : bashDarkIcon,
      alt: 'Bash Logo',
      // className: "opacity-40",
      href: 'https://www.gnu.org/software/bash/',
      colors: [[77, 169, 37]],
    },

    {
      name: 'Nginx',
      color: 'text-[#009639]',
      icon: nginxIcon,
      alt: 'Nginx Logo',
      // className: "opacity-40 dark:opacity-50",
      href: 'https://nginx.org/',
      colors: [[0, 150, 57]],
    },
  ];

  const SECURITY_SKILLS: Skill[] = [
    {
      name: 'JWT',
      color: 'text-[#645dff]',
      icon: jwtIcon,
      alt: 'JWT Logo',
      // className: "opacity-40 dark:opacity-50",
      href: 'https://www.jwt.io/',
      colors: [
        [100, 93, 255],
        [62, 198, 235],
        [255, 68, 221],
        [255, 79, 64],
      ],
    },
    // {
    // 	name: "OpenID",
    // 	color: "text-[#f8931e]",
    // 	icon: openidIcon,
    // 	alt: "OpenID Logo",
    // 	className: "opacity-60 dark:opacity-50",
    // 	href: "https://openid.net/",
    // 	colors: [
    // 		[248, 147, 30],
    // 		[179, 179, 179],
    // 	],
    // },
    {
      name: 'Cloudflare',
      color: 'text-[#f6821f]',
      icon: cloudflareIcon,
      alt: 'Cloudflare Logo',
      // className: "opacity-60 dark:opacity-50",
      href: 'https://www.cloudflare.com/',
      colors: [
        [246, 130, 31],
        [251, 173, 65],
      ],
    },
    {
      name: 'Prometheus',
      color: 'text-[#e6522c]',
      icon: prometheusIcon,
      alt: 'Prometheus Logo',
      // className: "opacity-40 dark:opacity-50",
      href: 'https://prometheus.io/',
      colors: [[230, 82, 44]],
    },

    {
      name: 'Grafana',
      color: 'text-[#f7ad24]',
      icon: grafanaIcon,
      alt: 'Grafana Logo',
      // className: "opacity-40 dark:opacity-50",
      href: 'https://grafana.com/',
      colors: [
        [247, 173, 36],
        [241, 91, 42],
      ],
    },
  ];
  const TESTING_SKILLS: Skill[] = [
    {
      name: 'Playwright',
      color: 'text-[#25862c]',
      icon: playwrightIcon,
      alt: 'Playwright Logo',
      href: 'https://playwright.dev/',
      colors: [
        [37, 134, 44],
        [214, 83, 72],
      ],
    },
    {
      name: 'Jest',
      color: 'text-[#25862c]',
      icon: jestIcon,
      alt: 'Jest Logo',
      colors: [
        [153, 66, 91],
        [255, 255, 255],
      ],
    },
    {
      name: 'Cypress',
      color: 'text-[#25862c]',
      icon: theme === 'dark' ? cypressIcon : cypressdarkIcon,
      alt: 'Cypress Logo',
      colors: [
        [88, 208, 158],
        [255, 255, 255],
      ],
    },
    {
      name: 'Selenium',
      color: 'text-[#25862c]',
      icon: seleniumIcon,
      alt: 'Selenium Logo',
      colors: [[67, 176, 42]],
    },
  ];

  const EXPLORATION_SKILLS: Skill[] = [
    {
      name: 'Python',
      color: 'text-[#ffd242]',
      icon: pythonIcon,
      alt: 'Python Logo',
      // className: "dark:opacity-50 opacity-70",
      href: 'https://www.python.org/',
      colors: [
        [255, 210, 66],
        [58, 117, 166],
      ],
    },
    {
      name: 'Go',
      color: 'text-[#7badff]',
      icon: goIcon,
      alt: 'Go Logo',
      // className: "opacity-40 dark:opacity-60",
      href: 'https://go.dev/',
      colors: [[123, 173, 255]],
    },
    {
      name: 'PHP',
      color: 'text-[#777bb3]',
      icon: phpIcon,
      alt: 'PHP Logo',
      // className: "opacity-60",
      href: 'https://www.php.net/',
      colors: [[119, 123, 179]],
    },
    {
      name: 'ColdFusion',
      color: 'text-[#7badff]',
      icon: coldfusionIcon,
      alt: 'ColdFusion Logo',
      // className: "opacity-40 dark:opacity-60",
      href: 'https://www.adobe.com/products/coldfusion-family.html',
      colors: [[123, 173, 255]],
    },
    // {
    // 	name: "Java",
    // 	color: "text-[#7badff]",
    // 	icon: javaIcon,
    // 	alt: "Java Logo",
    // 	// className: "opacity-40 dark:opacity-60",
    // 	// href: "https://www.adobe.com/products/coldfusion-family.html",
    // 	colors: [
    // 		[231, 111, 0],
    // 		[83, 130, 161],
    // 	],
    // },
    // {
    // 	name: "Rust",
    // 	color: "text-[#7badff]",
    // 	icon: rustIcon,
    // 	alt: "Rust Logo",
    // 	className: "invert dark:invert-0",
    // 	// href: "https://www.adobe.com/products/coldfusion-family.html",
    // 	colors: [[255, 255, 255]],
    // },
    // {
    // 	name: "C#",
    // 	color: "text-[#7badff]",
    // 	icon: csharpIcon,
    // 	alt: "C# Logo",
    // 	// className: "opacity-40 dark:opacity-60",
    // 	// href: "https://www.adobe.com/products/coldfusion-family.html",
    // 	colors: [
    // 		[40, 0, 104],
    // 		[161, 121, 220],
    // 	],
    // },
    // {
    // 	name: "Kotlin",
    // 	color: "text-[#7badff]",
    // 	icon: kotlinIcon,
    // 	alt: "Kotlin Logo",
    // 	// className: "opacity-40 dark:opacity-60",
    // 	// href: "https://www.adobe.com/products/coldfusion-family.html",
    // 	colors: [[148, 63, 246], [220, 56, 126]],
    // },
  ];

  const categories = [
    { title: 'Frontend', skills: FRONTEND_SKILLS },
    { title: 'Backend & API', skills: BACKEND_SKILLS },
    { title: 'Data Layer', skills: DB_SKILLS },
    // { title: 'Testing', skills: TESTING_SKILLS },
    { title: 'DevOps & Systems', skills: DEVOPS_SKILLS },
    { title: 'Cloud & Infrastructure & Security', skills: CLOUD_SKILLS },
    // { title: 'Observability & Security', skills: SECURITY_SKILLS },
    { title: 'Technology Exposure', skills: EXPLORATION_SKILLS },
  ];

  return (
    <SectionContainer
      id='skills'
      innerClassName='flex flex-col gap-6'
      // innerClassName="gap-6 grid grid-cols-2 xxs:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6"
    >
      <Card className='rounded-none flex justify-between'>
        <CornerBracket
          position='top-right'
          className='opacity-100'
          offset={10}
        />
        <CornerBracket
          position='bottom-left'
          className='opacity-100'
          offset={10}
        />
        <p className='text-sm typo-mono typo-code'>
          <span className='text-primary'>$</span>
          <span className='text-muted-foreground'> ls ~/skills</span>
        </p>

        <div>
          <h2
            className='text-4xl xxs:text-5xl typo-display'
            data-animate-heading
          >
            My Digital{' '}
            <span className='typo-display-outline text-primary'>Palette</span>
          </h2>
        </div>
        <span
          className='text-2xl typo-display-outline top-5 right-8 absolute typo-ghost text-muted-foreground'
          data-animate-float
        >
          AB_SKL
        </span>
        <p className='text-base typo-body typo-subtle'>
          Every great piece starts with the right tools. These are the
          technologies I reach for to bring ideas to life - the stack I use to
          architect, build, and ship work that's clean, fast, and built to last.
        </p>
      </Card>
      <div className='mt-6 grid lg:grid-cols-2 gap-6' data-animate-stagger>
        {categories.map(({ title, skills }) => (
          <div key={title} data-animate-stagger>
            <h2 className='typo-mono typo-label text-base text-muted-foreground bg-foreground/5 p-2 border-t border-x'>
              {title}
            </h2>
            <div
              className='border-r border-t grid grid-cols-2 xs:grid-cols-4 w-full'
              data-animate-stagger
            >
              {skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

const SkillCard: React.FC<{ skill: Skill }> = ({
  skill: {
    name,
    // href,
    color,
    colors,
    containerClassName = 'bg-black',
    icon,
    alt,
    className,
  },
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Card
      // showBracketsOnHover
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      bracketProps={{ className: color }}
      className='group/canvas-card p-8 border-r-0 border-t-0 border-b  border-l rounded-none overflow-hidden w-full'
    >
      {/* Canvas reveal on hover */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className='dark:block absolute inset-0 hidden'
        >
          <CanvasRevealEffect
            animationSpeed={3}
            containerClassName={containerClassName}
            colors={colors}
            dotSize={2}
          />
          <div className='bg-linear-to-b from-transparent from-0 to-black/90 absolute inset-0' />
        </motion.div>
      )}

      <div className='shadow-black size-full relative z-20 flex items-center justify-center shadow-2xl'>
        <Image
          src={icon}
          alt={alt}
          width={100}
          height={100}
          className={cn(
            'size-12 transition-all group-hover/canvas-card:-translate-y-2',
            className,
          )}
        />

        <p className='text-nowrap text-black/80 dark:text-white/80 group-hover/canvas-card:opacity-100 group-hover/canvas-card:translate-y-0 group-hover/canvas-card:text-black dark:group-hover/canvas-card:text-white absolute mt-16 text-xs font-semibold transition-all duration-300 opacity-0'>
          {name}
        </p>
      </div>
    </Card>
  );
};
