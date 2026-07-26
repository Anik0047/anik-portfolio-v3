'use client';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
  Quote,
  Star,
} from 'lucide-react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  AnimatePresence,
} from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AnimatedCounter from '@/components/common/animated-counter';
import SectionContainer from '@/components/layout/section-container';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { CornerBracket } from '@/components/ui/corner-brackets';
import { projects } from '@/lib/projects';

type ClientLogo = {
  id: string;
  name: string;
  shortName?: string;
};

type Review = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  project: string;
};

const clients: ClientLogo[] = [
  { id: 'client-1', name: 'Auronum', shortName: 'AC' },
  { id: 'client-2', name: 'A-PLUS', shortName: 'AP' },
  { id: 'client-3', name: 'Nerrative', shortName: 'NT' },
  { id: 'client-4', name: 'Smith Gruppe', shortName: 'SG' },
  { id: 'client-5', name: 'TTAP LLC', shortName: 'TL' },
  { id: 'client-6', name: 'NextWave Transport', shortName: 'NW' },
  { id: 'client-7', name: 'Titan Global', shortName: 'TG' },
  { id: 'client-8', name: 'E3COE', shortName: 'E3' },
  { id: 'client-9', name: 'LilyPadCo', shortName: 'LP' },
  { id: 'client-10', name: 'Delta Airlines', shortName: 'DA' },
  { id: 'client-11', name: 'PFL Ltd.', shortName: 'PF' },
];


const clientsLoop = [...clients, ...clients];

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/projects/${project.id}`} className='block group'>
      <motion.div
        className='relative overflow-hidden border  duration-500 cursor-pointer'
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={shouldReduceMotion ? undefined : { y: -4 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      >
        {/* Image area — tall fixed ratio */}
        <div className='relative aspect-4/3 bg-muted/30 overflow-hidden'>
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.thumbnailAlt ?? `${project.name} thumbnail`}
              fill
              className='object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]  grayscale-30 group-hover:grayscale-0'
              sizes='(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw'
            />
          ) : (
            <div className='absolute inset-0 bg-linear-to-br from-primary/15 via-primary/5 to-transparent' />
          )}

          {/* Persistent dark scrim at bottom */}
          <div className='absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent' />

          {/* Index + year pinned to top corners */}
          <div className='absolute top-3 left-3 right-3 flex items-center justify-between'>
            <span className='text-xs typo-mono text-primary/80 bg-background/70 border border-border/60 px-2 py-0.5'>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className='text-[10px] typo-mono uppercase tracking-[0.12em] text-muted-foreground bg-background/70 border border-border/60 px-2 py-0.5'>
              {project.year}
            </span>
          </div>

          {/* Hover reveal: full CTA */}
          <AnimatePresence>
            {hovered && !shouldReduceMotion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className='absolute inset-0 bg-background/60 flex items-center justify-center'
              >
                <span className='inline-flex items-center gap-2 border border-primary/60 bg-background/90 px-4 py-2 text-xs typo-mono uppercase tracking-[0.14em] text-primary'>
                  View Case Study <MoveUpRight className='size-3' />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text content below image */}
        <div className='p-4 sm:p-5 space-y-2 border-t border-border/50'>
          <div className='flex items-start justify-between gap-2'>
            <h3 className='text-lg sm:text-xl font-inter font-semibold leading-tight tracking-tight'>
              {project.name}
            </h3>
            <ArrowUpRight className='size-4 shrink-0 mt-0.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300' />
          </div>
          <p className='text-sm font-inter typo-subtle leading-relaxed line-clamp-2'>
            {project.summary}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Projects() {
  const [activeReview, setActiveReview] = useState(0);
  const [reviewCarouselApi, setReviewCarouselApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);

  const goNextReview = () => reviewCarouselApi?.scrollNext();
  const goPrevReview = () => reviewCarouselApi?.scrollPrev();

  useEffect(() => {
    if (!reviewCarouselApi) return;
    const updateActive = () =>
      setActiveReview(reviewCarouselApi.selectedScrollSnap());
    updateActive();
    reviewCarouselApi.on('select', updateActive);
    reviewCarouselApi.on('reInit', updateActive);
    return () => {
      reviewCarouselApi.off('select', updateActive);
      reviewCarouselApi.off('reInit', updateActive);
    };
  }, [reviewCarouselApi]);

  useEffect(() => {
    if (!reviewCarouselApi || isPaused) return;
    const timer = window.setInterval(
      () => reviewCarouselApi.scrollNext(),
      4500,
    );
    return () => window.clearInterval(timer);
  }, [isPaused, reviewCarouselApi]);

  return (
    <SectionContainer
      id='projects'
      innerClassName='relative flex flex-col gap-4 sm:gap-6'
    >
      {/* ── Section Header ── */}
      <Card className='rounded-none relative overflow-hidden'>
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

        <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-6'>
          <div>
            <p className='text-xs typo-mono typo-code'>
              <span className='text-primary'>$</span>
              <span className='text-muted-foreground'>
                {' '}
                ls projects --featured
              </span>
            </p>
            <h2
              className='mt-2 text-3xl xxs:text-4xl sm:text-5xl typo-display'
              data-animate-heading
            >
              Selected{' '}
              <span className='typo-display-outline text-primary'>
                Projects
              </span>
            </h2>
            <p className='mt-3 text-sm sm:text-base font-inter typo-subtle max-w-2xl leading-relaxed'>
              A shortlist of work focused on performance, reliability, developer
              experience, and clean product execution.
            </p>
          </div>

          {/* Project count badge */}
          <div className='flex flex-col items-start sm:items-end shrink-0'>
            <p
              className='text-4xl sm:text-5xl typo-display text-primary/20 leading-none select-none'
              aria-hidden
            >
              {String(projects.length).padStart(2, '0')}
            </p>
            <p className='text-[10px] typo-mono uppercase tracking-[0.14em] text-muted-foreground mt-1'>
              Projects
            </p>
          </div>
        </div>

        {/* Index strip */}
        <div className='mt-6 border-t border-border/40 pt-4 flex flex-wrap gap-x-6 gap-y-2'>
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className='group flex items-center gap-2 text-xs font-inter text-muted-foreground hover:text-primary transition-colors duration-200'
            >
              <span className='typo-mono text-primary/50 group-hover:text-primary transition-colors'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className='group-hover:underline underline-offset-2'>
                {p.name}
              </span>
            </Link>
          ))}
        </div>

        <span
          className='pointer-events-none absolute top-5 right-8 text-2xl typo-display-outline typo-ghost text-muted-foreground/70'
          data-animate-float
          aria-hidden
        >
          AB_PRJ
        </span>
      </Card>

      {/* ── Project Grid ── */}
      <div
        className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
        data-animate-stagger
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </SectionContainer>
  );
}
