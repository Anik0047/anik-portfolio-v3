'use client';

import type { gsap } from 'gsap';
import { motion, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import SectionContainer from '@/components/layout/section-container';
import BrandLogoHalfText from '@/components/svgs/brand-logo-half-text';
import {
  siamImg,
  siamImg1Long,
  siamImg2,
  siamImg3,
  siamImg4,
  siamImg2Long,
  siamImg3Long,
  siamImg4Long,
} from '@/lib/assets';
import { useNavbarStore } from '@/stores/navbar-store';
import { usePreloaderStore } from '@/stores/preloader-store';

const desktopImages: string[] = [siamImg, siamImg2, siamImg3, siamImg4];
const mobileImages: string[] = [siamImg1Long, siamImg2Long, siamImg3Long, siamImg4Long];
const PAUSE_MS = 8000;

interface SlotRefs {
  main: ReturnType<typeof createRef<HTMLDivElement>>;
  red: ReturnType<typeof createRef<HTMLDivElement>>;
  blue: ReturnType<typeof createRef<HTMLDivElement>>;
  scanline: ReturnType<typeof createRef<SVGSVGElement>>;
}

function ScanlineSvg({
  src,
  svgRef,
  slotIndex,
}: {
  src: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
  slotIndex: number;
}) {
  const maskId = `scanline-mask-${slotIndex}`;
  const gradId = `scanline-fade-${slotIndex}`;
  const filterId = `scanline-alpha-${slotIndex}`;

  return (
    <svg
      ref={svgRef}
      className='absolute inset-0 w-full h-full opacity-0 pointer-events-none'
      xmlns='http://www.w3.org/2000/svg'
      // Explicit viewBox so userSpaceOnUse coords map 1:1 to rendered pixels.
      // We use a large fixed space and let SVG scaling handle the rest.
      preserveAspectRatio='none'
      aria-hidden='true'
    >
      <defs>
        {/*
         * Luminance filter: converts image RGB → greyscale so bright subject
         * pixels become white (scanlines visible) and dark areas become black.
         * For true-alpha transparent PNGs swap the matrix to:
         *   "0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 255 0"
         */}
        <filter
          id={filterId}
          colorInterpolationFilters='sRGB'
          x='0'
          y='0'
          width='100%'
          height='100%'
        >
          <feColorMatrix
            type='matrix'
            values='0.2126 0.7152 0.0722 0 0
								0.2126 0.7152 0.0722 0 0
								0.2126 0.7152 0.0722 0 0
								0      0      0      0 1'
          />
        </filter>

        {/*
         * gradientUnits="userSpaceOnUse" with percentage-based x/y/width/height
         * means the gradient maps to the SVG viewport directly — no bounding-box
         * scaling that would misalign with the letterboxed image.
         */}
        <linearGradient
          id={gradId}
          gradientUnits='userSpaceOnUse'
          x1='0'
          y1='100%'
          x2='0'
          y2='0'
        >
          <stop offset='0%' stopColor='white' stopOpacity='1' />
          <stop offset='60%' stopColor='white' stopOpacity='1' />
          <stop offset='100%' stopColor='white' stopOpacity='0' />
        </linearGradient>

        {/*
         * maskUnits="userSpaceOnUse" (the default) — mask coords map 1:1
         * to the SVG viewport. The mask <image> and gradient rect are both
         * set to 100%/100% so they fill the full viewport identically to
         * the foreignObject scanline below.
         *
         * The <image> uses the same preserveAspectRatio as Next.js Image
         * (object-contain + object-bottom = xMidYMax meet) so the mask
         * shape aligns pixel-for-pixel with the rendered photo.
         */}
        <mask id={maskId}>
          <image
            href={src}
            x='0'
            y='0'
            width='100%'
            height='100%'
            preserveAspectRatio='xMidYMax meet'
            filter={`url(#${filterId})`}
          />
          {/*
           * Multiply the image luma by the fade gradient so scanlines only
           * appear where the subject is bright AND within the fade window.
           */}
          <rect
            x='0'
            y='0'
            width='100%'
            height='100%'
            fill={`url(#${gradId})`}
            style={{ mixBlendMode: 'multiply' }}
          />
        </mask>
      </defs>

      {/*
       * foreignObject fills the full SVG viewport — same coordinate space
       * as the mask — so width/height alignment is exact.
       */}
      <foreignObject
        x='0'
        y='0'
        width='100%'
        height='100%'
        mask={`url(#${maskId})`}
      >
        <div
          // @ts-expect-error — xmlns required on foreignObject children
          xmlns='http://www.w3.org/1999/xhtml'
          style={{
            width: '100%',
            height: '100%',
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.45) 2px, rgba(0,0,0,0.45) 4px)',
          }}
        />
      </foreignObject>
    </svg>
  );
}

function ImageSlot({
  src,
  refs,
  visible,
  slotIndex,
}: {
  src: string;
  refs: SlotRefs;
  visible: boolean;
  slotIndex: number;
}) {
  const imgClass = 'h-full w-full object-bottom object-contain';
  const shouldPrioritize = slotIndex === 0;

  return (
    <div className='absolute inset-0' style={{ opacity: visible ? 1 : 0 }}>
      {/* Red channel ghost */}
      <div
        ref={refs.red}
        className='absolute inset-0 flex items-end justify-center opacity-0 pointer-events-none overflow-hidden'
        style={{
          filter:
            'grayscale(1) sepia(1) hue-rotate(-30deg) saturate(5) brightness(1.2)',
          WebkitFilter:
            'grayscale(1) sepia(1) hue-rotate(-30deg) saturate(5) brightness(1.2)',
          mixBlendMode: 'screen',
        }}
      >
        <Image
          src={src}
          alt='Red channel ghost'
          aria-hidden='true'
          fill
          className={imgClass}
          loading='lazy'
          fetchPriority='low'
          sizes='(max-width: 768px) 100vw, 60vw'
        />
      </div>

      {/* Cyan channel ghost */}
      <div
        ref={refs.blue}
        className='absolute inset-0 flex items-end justify-center opacity-0 pointer-events-none overflow-hidden'
        style={{
          filter:
            'grayscale(1) sepia(1) hue-rotate(130deg) saturate(5) brightness(1.2)',
          mixBlendMode: 'screen',
        }}
      >
        <Image
          src={src}
          alt='Cyan channel ghost'
          aria-hidden='true'
          fill
          className={imgClass}
          loading='lazy'
          fetchPriority='low'
          sizes='(max-width: 768px) 100vw, 60vw'
        />
      </div>

      {/* Main image */}
      <div
        ref={refs.main}
        className='absolute inset-0 flex items-end justify-center grayscale overflow-hidden'
        style={{}}
      >
        <Image
          src={src}
          alt='Siam'
          fill
          className={imgClass}
          priority={shouldPrioritize}
          loading={shouldPrioritize ? 'eager' : 'lazy'}
          fetchPriority={shouldPrioritize ? 'high' : 'low'}
          sizes='(max-width: 768px) 100vw, 60vw'
        />
      </div>

      {/* SVG scanline — only render for visible slot to reduce paint time */}
      {visible && (
        <ScanlineSvg src={src} svgRef={refs.scanline} slotIndex={slotIndex} />
      )}
    </div>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [gsapReady, setGsapReady] = useState(false);
  const [revealReady, setRevealReady] = useState(false);
  const currentRef = useRef(0);
  const isAnimating = useRef(false);
  const gsapRef = useRef<typeof gsap | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isMenuOpen = useNavbarStore((s) => s.isMenuOpen);
  const isCommandMenuOpen = useNavbarStore((s) => s.isCommandMenuOpen);
  const isOverlayOpen = isMenuOpen || isCommandMenuOpen;
  const isOverlayOpenRef = useRef(isOverlayOpen);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    isOverlayOpenRef.current = isOverlayOpen;
  }, [isOverlayOpen]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { gsap } = await import('gsap');
      if (mounted) {
        gsapRef.current = gsap;
        setGsapReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  const slotRefs = useMemo<SlotRefs[]>(
    () =>
      desktopImages.map(() => ({
        main: createRef<HTMLDivElement>(),
        red: createRef<HTMLDivElement>(),
        blue: createRef<HTMLDivElement>(),
        scanline: createRef<SVGSVGElement>(),
      })),
    [],
  );

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  const resetAllSlots = useCallback(() => {
    const gsap = gsapRef.current;
    if (!gsap) return;

    timelineRef.current?.kill();
    timelineRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    isAnimating.current = false;

    for (const [i, refs] of slotRefs.entries()) {
      const isActive = i === 0;
      if (refs.main.current) {
        gsap.set(refs.main.current, {
          opacity: isActive ? 1 : 0,
          x: 0,
          filter: 'grayscale(1) brightness(1)',
        });
      }
      for (const layer of [refs.red.current, refs.blue.current]) {
        if (layer) gsap.set(layer, { opacity: 0, x: 0 });
      }
      if (refs.scanline.current) {
        gsap.set(refs.scanline.current, { opacity: 0, x: 0 });
      }
    }
  }, [slotRefs]);

  useEffect(() => {
    if (!gsapReady) return;
    resetAllSlots();
    setCurrent(0);
    currentRef.current = 0;
  }, [gsapReady, isMobile, resetAllSlots]);

  const runGlitch = useCallback(
    (next: number) => {
      const gsap = gsapRef.current;
      if (!gsap) return;
      if (isOverlayOpenRef.current) return;
      if (isAnimating.current) return;
      isAnimating.current = true;

      const from = slotRefs[currentRef.current];
      const to = slotRefs[next];

      if (!from?.main.current || !to?.main.current) {
        isAnimating.current = false;
        return;
      }

      timelineRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(
            [
              from.main.current,
              from.red.current,
              from.blue.current,
              from.scanline.current,
            ],
            { opacity: 0, x: 0 },
          );
          timelineRef.current = null;
          currentRef.current = next;
          setCurrent(next);
          isAnimating.current = false;
          if (!isOverlayOpenRef.current) {
            timeoutRef.current = setTimeout(() => {
              runGlitch((next + 1) % images.length);
            }, PAUSE_MS);
          }
        },
      });
      timelineRef.current = tl;

      gsap.set(to.main.current, { opacity: 0 });

      tl.to(from.red.current, {
        x: gsap.utils.random(-20, -8),
        opacity: 1,
        duration: 0.15,
        ease: 'none',
      })
        .to(
          from.blue.current,
          {
            x: gsap.utils.random(8, 20),
            opacity: 1,
            duration: 0.15,
            ease: 'none',
          },
          '<',
        )
        .to(from.scanline.current, {
          opacity: 0.7,
          duration: 0.08,
          ease: 'none',
        })
        .to(from.scanline.current, {
          opacity: 0.1,
          duration: 0.06,
          ease: 'none',
        })
        .to(from.scanline.current, {
          opacity: 0.9,
          duration: 0.08,
          ease: 'none',
        })
        .to(from.main.current, {
          filter: 'grayscale(1) brightness(4)',
          duration: 0.08,
          ease: 'none',
        })
        .call(() => {
          gsap.set(from.main.current, {
            opacity: 0,
            filter: 'grayscale(1) brightness(1)',
          });
          gsap.set(to.main.current, { opacity: 1 });
        })
        .to(
          [from.red.current, from.blue.current],
          { x: 0, opacity: 0, duration: 0.2, ease: 'power2.out' },
          '-=0.1',
        )
        .to(from.scanline.current, { opacity: 0.4, duration: 0.06 })
        .to(from.scanline.current, { opacity: 0, duration: 0.2 });
    },
    [slotRefs, images.length],
  );

  const isComplete = usePreloaderStore((s) => s.isComplete);

  useEffect(() => {
    if (!isComplete) {
      setRevealReady(false);
      return;
    }

    if (shouldReduceMotion) {
      setRevealReady(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setRevealReady(true);
    }, 90);

    return () => window.clearTimeout(timer);
  }, [isComplete, shouldReduceMotion]);

  useEffect(() => {
    if (!gsapReady || !isComplete) return;
    timeoutRef.current = setTimeout(() => {
      if (!isOverlayOpenRef.current) {
        runGlitch((currentRef.current + 1) % images.length);
      }
    }, PAUSE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timelineRef.current?.kill();
      timelineRef.current = null;
      isAnimating.current = false;
    };
  }, [isComplete, isMobile, runGlitch, images.length, gsapReady]);

  useEffect(() => {
    if (isOverlayOpen) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      return;
    }

    if (!isComplete || !gsapReady || isAnimating.current || timelineRef.current)
      return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isOverlayOpenRef.current) {
        runGlitch((currentRef.current + 1) % images.length);
      }
    }, PAUSE_MS);
  }, [isOverlayOpen, isComplete, gsapReady, runGlitch, images.length]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timelineRef.current?.kill();
    };
  }, []);

  return (
    <SectionContainer
      id='home'
      className='flex-center pointer-events-none select-none'
    >
      <motion.div
        className='absolute bottom-0 inset-x-0 h-[85%] sm:h-[90%] z-20 mask-b-from-70% mask-b-to-100% overflow-hidden'
        initial={
          shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.985 }
        }
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: revealReady ? 1 : 0,
                y: revealReady ? 0 : 24,
                scale: revealReady ? 1 : 0.985,
              }
        }
        transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      >
        {images.map((src, i) => (
          <ImageSlot
            key={i}
            src={src}
            refs={slotRefs[i]}
            visible={i === current}
            slotIndex={i}
          />
        ))}
      </motion.div>

      <motion.p
        className='absolute top-6 sm:top-10 inset-x-0 z-10 text-center typo-mono typo-label text-xs sm:text-sm uppercase tracking-[0.2em] text-muted-foreground'
        initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: revealReady ? 1 : 0, y: revealReady ? 0 : -12 }
        }
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Frontend Engineer
      </motion.p>

      <motion.div
        className='relative z-10 w-full'
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.84 }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                opacity: revealReady ? 1 : 0,
                scale: revealReady ? 1 : 0.84,
              }
        }
        transition={{ duration: 0.95, delay: 0.36, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 50%' }}
      >
        <BrandLogoHalfText className='w-full h-auto fill-lemon dark:fill-lemon/10 dark:stroke-primary stroke-black stroke-3' />
      </motion.div>
    </SectionContainer>
  );
}
