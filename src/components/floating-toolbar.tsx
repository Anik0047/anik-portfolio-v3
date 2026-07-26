'use client';

// import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePreloaderStore } from '@/stores/preloader-store';
import { NAV_LINKS, type NavItem } from './layout/contents';
import { ThemeToggler } from './ui/theme-toggler';

export type ToolbarItem = NavItem;

interface FloatingToolbarProps {
  items?: ToolbarItem[];
  className?: string;
  onSelect?: (id: string) => void;
}

interface ToolbarItemProps {
  item: ToolbarItem;
  index: number;
  isActive: boolean;
  setHoveredTab: (id: string) => void;
  setActiveTab: (id: string) => void;
}

const ITEM_WIDTH = 36;
const GAP = 8;
const PADDING = 6;

function ToolbarButton({
  item,
  index,
  isActive,
  setHoveredTab,
  setActiveTab,
}: ToolbarItemProps) {
  if (item.type === 'theme') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.88 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            delay: 0.12 + index * 0.04,
            type: 'spring',
            stiffness: 420,
            damping: 24,
          },
        }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 500, damping: 26 }}
        onMouseEnter={() => setHoveredTab(item.id)}
        className="relative z-10 flex size-9 items-center justify-center"
      >
        <ThemeToggler
          className={cn(
            'size-9 rounded-full transition-colors duration-200 outline-none',
            isActive ? 'text-background' : 'text-foreground',
          )}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.88 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          delay: 0.12 + index * 0.04,
          type: 'spring',
          stiffness: 420,
          damping: 24,
        },
      }}
    >
      <Link href={item.href ?? '#'}>
        <motion.button
          type="button"
          onClick={() => setActiveTab(item.id)}
          onMouseEnter={() => setHoveredTab(item.id)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 500, damping: 26 }}
          className={cn(
            'relative flex cursor-pointer items-center justify-center size-9 rounded-full',
            'transition-colors duration-200 outline-none',
            isActive ? 'text-background' : 'text-foreground',
          )}
        >
          <span className="relative z-10">
            <item.icon className="size-5" />
          </span>
        </motion.button>
      </Link>
    </motion.div>
  );
}

export function FloatingToolbar({
  items = NAV_LINKS,
  className,
  onSelect,
}: FloatingToolbarProps) {
  const getSectionIdFromHref = (href?: string) => {
    if (!href) return undefined;
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return undefined;
    const id = href.slice(hashIndex + 1).trim();
    return id || undefined;
  };

  const sectionItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.type === 'link' &&
          typeof item.href === 'string' &&
          Boolean(getSectionIdFromHref(item.href)),
      ),
    [items],
  );

  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [selectedForAnimation, setSelectedForAnimation] = useState<
    string | undefined
  >(undefined);
  // const [showBackToTop, setShowBackToTop] = useState(false);
  const isPreloadComplete = usePreloaderStore((s) => s.isComplete);
  const pathname = usePathname();

  useEffect(() => {
    if (!sectionItems.length) return;

    let rafId: number | null = null;

    const getCurrentSectionId = () => {
      const viewportHeight = window.innerHeight;
      const viewportProbe = viewportHeight * 0.35;
      let hasSectionOnPage = false;
      let probeMatchId: string | undefined;
      let bestVisibleId: string | undefined;
      let bestVisibleRatio = 0;

      for (const item of sectionItems) {
        const sectionId = getSectionIdFromHref(item.href);
        if (!sectionId) continue;

        const section = document.getElementById(sectionId);
        if (!(section instanceof HTMLElement)) continue;
        hasSectionOnPage = true;
        const rect = section.getBoundingClientRect();

        // Primary: probe line is inside this section.
        if (rect.top <= viewportProbe && rect.bottom > viewportProbe) {
          probeMatchId = item.id;
        }

        // Fallback: choose section with highest visible ratio.
        const visibleTop = Math.max(rect.top, 0);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const ratio = rect.height > 0 ? visibleHeight / rect.height : 0;

        if (ratio > bestVisibleRatio) {
          bestVisibleRatio = ratio;
          bestVisibleId = item.id;
        }
      }

      if (!hasSectionOnPage) return undefined;
      if (probeMatchId) return probeMatchId;
      if (bestVisibleRatio > 0.15) return bestVisibleId;
      return undefined;
    };

    const syncActiveSectionNow = () => {
      const nextId = getCurrentSectionId();

      setActiveTab((prev) => {
        if (prev === nextId) return prev;

        const prevIndex = items.findIndex((item) => item.id === prev);
        const nextIndex = items.findIndex((item) => item.id === nextId);

        if (prevIndex !== -1 && nextIndex !== -1) {
          setDirection(nextIndex > prevIndex ? 1 : -1);
        }

        setSelectedForAnimation(nextId);
        return nextId;
      });
    };

    const syncActiveSection = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        syncActiveSectionNow();
      });
    };

    syncActiveSection();
    window.addEventListener('scroll', syncActiveSection, { passive: true });
    window.addEventListener('resize', syncActiveSection);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      window.removeEventListener('scroll', syncActiveSection);
      window.removeEventListener('resize', syncActiveSection);
    };
  }, [items, sectionItems, pathname]);

  // useEffect(() => {
  // 	const footer = document.querySelector(".FOOTER");

  // 	if (footer instanceof HTMLElement) {
  // 		const observer = new IntersectionObserver(
  // 			([entry]) => {
  // 				setShowBackToTop(Boolean(entry?.isIntersecting));
  // 			},
  // 			{ threshold: 0.15 },
  // 		);

  // 		observer.observe(footer);
  // 		return () => observer.disconnect();
  // 	}

  // 	// Fallback if footer element cannot be detected.
  // 	const toggleBackToTop = () => {
  // 		const scrollPosition = window.scrollY + window.innerHeight;
  // 		const bottomPosition = document.documentElement.scrollHeight;
  // 		setShowBackToTop(bottomPosition - scrollPosition <= 8);
  // 	};

  // 	toggleBackToTop();
  // 	window.addEventListener("scroll", toggleBackToTop, { passive: true });
  // 	window.addEventListener("resize", toggleBackToTop);

  // 	return () => {
  // 		window.removeEventListener("scroll", toggleBackToTop);
  // 		window.removeEventListener("resize", toggleBackToTop);
  // 	};
  // }, []);

  const handleHover = (id: string) => {
    if (hoveredTab !== null) {
      const prevIndex = items.findIndex((item) => item.id === hoveredTab);
      const nextIndex = items.findIndex((item) => item.id === id);
      setDirection(nextIndex > prevIndex ? 1 : -1);
    }
    setHoveredTab(id);
  };

  const handleSelect = (id: string) => {
    const prevIndex = items.findIndex((item) => item.id === activeTab);
    const nextIndex = items.findIndex((item) => item.id === id);
    setDirection(nextIndex > prevIndex ? 1 : -1);
    setActiveTab(id);
    setSelectedForAnimation(id);
    onSelect?.(id);
  };

  const hoveredIndex = items.findIndex((item) => item.id === hoveredTab);
  const hoveredItem = hoveredIndex !== -1 ? items[hoveredIndex] : null;

  const selectedIndex = items.findIndex(
    (item) => item.id === selectedForAnimation,
  );

  const tooltipX = hoveredItem
    ? PADDING + hoveredIndex * (ITEM_WIDTH + GAP) + ITEM_WIDTH / 2
    : 0;

  // Shared x position for hover pill
  const hoverBgX = hoveredItem
    ? PADDING + hoveredIndex * (ITEM_WIDTH + GAP)
    : 0;

  // Shared x position for active pill — always tracks selectedIndex
  const activeBgX =
    selectedIndex !== -1 ? PADDING + selectedIndex * (ITEM_WIDTH + GAP) : 0;

  // const handleGoToTop = () => {
  // 	window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <AnimatePresence>
      {isPreloadComplete && (
        <motion.div
          key="floating-toolbar"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          exit={{ y: 120 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={cn(
            'fixed xs:left-1/2 xs:-translate-x-1/2 bottom-0 z-30 flex-center flex-col gap-3 w-screen xs:w-fit bg-background/70 dark:bg-primary/10 xs:bg-transparent xs:dark:bg-transparent backdrop-blur-2xl xs:backdrop-blur-none py-2 xs:pt-0 xs:bottom-2 sm:bottom-8 xs:max-w-[calc(100vw-12px)] xs:pb-[max(env(safe-area-inset-bottom),8px)] sm:pb-0',
            className,
          )}
        >
          {/* <AnimatePresence>
						{showBackToTop && (
							<motion.button
								type="button"
								onClick={handleGoToTop}
								initial={{ opacity: 0, y: 8, scale: 0.92 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 8, scale: 0.92 }}
								transition={{ type: "spring", stiffness: 420, damping: 30 }}
								className="inline-flex size-10 items-center justify-center rounded-full border border-primary/20 bg-background/70 dark:bg-primary/10 backdrop-blur-2xl text-foreground transition-colors hover:bg-foreground/10 dark:hover:bg-foreground/10 cursor-pointer"
								aria-label="Go to top"
								title="Go to top"
							>
								<ArrowUp className="size-4" />
							</motion.button>
						)}
					</AnimatePresence> */}

          <motion.div
            initial={{ x: -18 }}
            animate={{ x: 0 }}
            exit={{ x: 18 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative flex items-center gap-2 p-1.5 xs:rounded-full xs:bg-background/70 xs:dark:bg-primary/10 xs:backdrop-blur-2xl xs:border xs:border-primary/10"
            onMouseLeave={() => setHoveredTab(null)}
          >
            {/* ── Active pill — slides to whichever item was last clicked ── */}
            {selectedIndex !== -1 && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 left-0 size-9 bg-primary rounded-full"
                animate={{ x: activeBgX }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}

            {/* ── Hover pill — slides to the currently hovered item ── */}
            <AnimatePresence>
              {hoveredItem && (
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 left-0 size-9 bg-foreground/10 rounded-full"
                  initial={{ opacity: 0, x: hoverBgX, scale: 0.95 }}
                  animate={{ opacity: 1, x: hoverBgX, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </AnimatePresence>

            {/* ── Buttons ── */}
            {items.map((item, index) => (
              <ToolbarButton
                key={item.id}
                item={item}
                index={index}
                isActive={activeTab === item.id}
                setHoveredTab={handleHover}
                setActiveTab={handleSelect}
              />
            ))}

            {/* ── Tooltip ── */}
            <AnimatePresence>
              {hoveredItem && (
                <motion.div
                  key="tooltip"
                  className="absolute -top-10 left-0 hidden md:flex items-center gap-2 px-3 py-1.5 bg-background/50 border rounded-md whitespace-nowrap z-40 pointer-events-none overflow-hidden"
                  initial={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                    x: tooltipX,
                    translateX: '-50%',
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: tooltipX,
                    translateX: '-50%',
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.95,
                    transition: { duration: 0.15 },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <AnimatePresence
                    mode="popLayout"
                    initial={false}
                    custom={direction}
                  >
                    <motion.div
                      key={hoveredItem.id}
                      className="flex items-center gap-2"
                      custom={direction}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <span className="text-xs font-medium text-foreground">
                        {hoveredItem.label}
                      </span>
                      {hoveredItem.shortcut && (
                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border">
                          {hoveredItem.shortcut}
                        </span>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
