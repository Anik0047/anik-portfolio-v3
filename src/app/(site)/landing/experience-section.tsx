'use client';

import {
  ArrowDown,
  ArrowUp,
  CalendarRange,
  ChevronDown,
  ChevronUp,
  MapPin,
} from 'lucide-react';
import SectionContainer from '@/components/layout/section-container';
import { Card } from '@/components/ui/card';
import { CornerBracket } from '@/components/ui/corner-brackets';
import { useState } from 'react';

type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  type: string;
  location: string;
  period: string;
  highlights: string[];
  stack: string[];
  ghost?: string;
  shortDesc?: string;
};

export const experiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Frontend Engineer',
    company: 'Classic It Ltd.',
    type: 'On-site',
    location: 'Dhaka, Bangladesh',
    period: 'Jul 2025 - Present', // Fixed the 2025 typo
    ghost: 'SaaS',
    shortDesc:
      'Architected scalable, high-performance frontend systems for multi-tenant SaaS and e-commerce platforms, ensuring seamless automated delivery via CI/CD.',
    highlights: [
      'Architected scalable Next.js systems from scratch for 4+ production platforms, reducing developer onboarding time from ~2 weeks to ~1 week via reusable ShadCN UI components.',
      'Built full admin dashboards (Product, POS, Order, Category modules) with role-based route guards, used by 2+ live restaurant merchants and reducing manual tracking time by ~2 hours/day.',
      'Managed frontend delivery for 4 simultaneous e-commerce projects, maintaining 100% on-time delivery across all milestones over 6 months.',
      'Delivered a multi-vendor platform supporting 3 user roles and vendor approval workflows, enabling 10+ vendor onboardings within the launch month.',
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'React',
      'Tailwind CSS',
      'ShadCN UI',
      'TanStack Query',
      'Redux Toolkit',
      'GitHub Actions',
    ],
  },
  {
    id: 'exp-2',
    role: 'React.js / Next.js Intern',
    company: 'XPONENT InfoSystem (PVT) Ltd.',
    type: 'On-site',
    location: 'Chattrogram, Bangladesh',
    period: 'Jan 2025 - Apr 2025', // Fixed the 2025 typo
    ghost: 'INT',
    shortDesc:
      'Contributed to a fashion e-commerce storefront, focusing on component architecture and API integration during an intensive internship.',
    highlights: [
      'Assisted in building a fashion e-commerce storefront and admin dashboard using Next.js and Tailwind CSS.',
      'Gained hands-on experience implementing product CRUD operations and integrating REST APIs with proper error handling.',
    ],
    stack: ['Next.js', 'React', 'Tailwind CSS', 'REST APIs'],
  },

  {
    id: 'exp-3',
    role: 'Frontend Engineer',
    company: 'Freelance Client (Evening/Weekend Contract)',
    type: 'Remote - Freelance',
    location: 'Remote',
    period: 'Oct 2024', // Fixed the 2025 typo
    ghost: 'ECOM',
    shortDesc:
      'Engineered an independent fashion e-commerce storefront and admin dashboard with optimistic UI updates and seamless API integration.',
    highlights: [
      'Built a fashion e-commerce storefront and admin dashboard in Next.js enabling the client to independently manage 200+ SKUs, eliminating developer dependency.',
      'Implemented product CRUD, image uploads, and order management with optimistic UI updates via TanStack Query for a seamless admin experience.',
      'Integrated REST APIs with robust error handling and loading states, ensuring consistent data flow without layout shifts.',
    ],
    stack: ['Next.js', 'React', 'TanStack Query', 'Tailwind CSS', 'REST APIs'],
  },
];

export default function Experience() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <SectionContainer
      id='experience'
      innerClassName='relative flex flex-col gap-4 sm:gap-6'
    >
      <Card className='rounded-none flex flex-col justify-between gap-8 relative'>
        <CornerBracket
          position='top-right'
          className='opacity-100 text-primary'
          offset={10}
        />
        <CornerBracket
          position='bottom-left'
          className='opacity-100 text-primary'
          offset={10}
        />

        <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6'>
          <div>
            <p className='text-sm typo-mono typo-code'>
              <span className='text-primary'>$</span>
              <span className='text-muted-foreground'> timeline --work </span>
            </p>
            <h2
              className='mt-2 text-3xl xxs:text-4xl sm:text-5xl typo-display'
              data-animate-heading
            >
              Career
              <span className='ml-2 typo-display-outline text-primary'>
                Log
              </span>
            </h2>
            <p className='mt-3 text-sm sm:text-base font-inter typo-subtle max-w-3xl leading-relaxed'>
              I focus on building reliable products from idea to deployment,
              covering architecture, implementation, testing, and delivery.
            </p>
          </div>
        </div>
        <span
          className='pointer-events-none absolute top-5 right-8 text-2xl typo-display-outline typo-ghost text-muted-foreground/70'
          data-animate-float
        >
          AB_EXP
        </span>
      </Card>

      <div className='grid grid-cols-1 gap-6' data-animate-stagger>
        {experiences.map((item, index) => (
          <div
            key={item.id}
            className='relative overflow-hidden border bg-card cursor-pointer group select-none'
            onClick={() =>
              setExpandedId(expandedId === item.id ? null : item.id)
            }
          >
            <div className='p-8 flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 border border-foreground/10 px-3 py-1'>
                  <span className='w-1.5 h-1.5 rounded-full bg-lime-400' />
                  <span className='text-[10px] font-semibold tracking-widest uppercase text-foreground/40'>
                    {item.type}
                  </span>
                </div>
                <span className='font-mono text-[10px] text-foreground/15'>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Body */}
              <div className='flex items-end justify-between gap-8 md:gap-4 relative z-10 flex-col md:flex-row'>
                {/* Ghost watermark */}
                <span className='pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-[6rem] typo-display-outline uppercase text-foreground opacity-5 select-none leading-none'>
                  {item.ghost}{' '}
                  {/* add a ghost: string to your ExperienceItem type */}
                </span>
                <div className='flex-1'>
                  <h3 className='text-xl sm:text-3xl font-black uppercase leading-none text-foreground '>
                    {item.role}
                  </h3>
                  <p className='mt-1 font-mono text-[11px] text-foreground/60'>
                    {item.company}
                  </p>
                  <p className='mt-2 text-xs sm:text-sm text-foreground/70 max-w-md leading-relaxed'>
                    {item.shortDesc}
                  </p>

                  <div className='mt-3 flex flex-wrap gap-3'>
                    {item.stack.map((tech) => (
                      <span
                        key={tech}
                        className='flex items-center gap-1.5 text-[9px] font-semibold tracking-widest uppercase text-foreground/70'
                      >
                        <span className='size-1 rounded-full bg-primary' />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className='shrink-0 flex flex-col items-end gap-2'>
                  <div className='flex items-center gap-2 text-[10px] font-semibold tracking-widest uppercase text-foreground/40 group-hover:text-lime-400 transition-colors'>
                    {expandedId === item.id ? (
                      <>
                        <span>Hide Details</span>
                        <div className='size-5 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-lime-400'>
                          <ChevronUp />
                        </div>
                      </>
                    ) : (
                      <>
                        <span>Show Details</span>
                        <div className='size-5 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-lime-400'>
                          <ChevronDown />
                        </div>
                      </>
                    )}
                  </div>
                  <span className='font-mono text-[10px] text-foreground/20'>
                    {item.period} · {item.location}
                  </span>
                </div>
              </div>
              {/* Highlights (toggle open) */}
              {expandedId === item.id && (
                <div className='border-t border-primary/30 pt-4 grid gap-2'>
                  {item.highlights.map((point) => (
                    <div
                      key={point}
                      className='flex gap-2 text-xs text-foreground/80 leading-relaxed'
                    >
                      <span className='text-lime-400 shrink-0'>→</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
