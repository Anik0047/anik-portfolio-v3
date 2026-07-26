'use client';

import { CommandIcon, CornerDownLeft } from 'lucide-react';
import { AnimatePresence, animate, motion, useMotionValue } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getLenisInstance } from '@/lib/lenis';
import { smoothScrollTo } from '@/lib/scroll';
import { cn } from '@/lib/utils';
import { useNavbarStore } from '@/stores/navbar-store';
import BrandLogoFrame from '../svgs/brand-logo-frame';
// import BrandLogoSymbol from "../svgs/brand-logo-symbol";
// import BrandLogoTextAnimated from "../svgs/brand-logo-text-animated";
// import BrandLogoTextOut from "../svgs/brand-logo-text-out";
import { Button } from '../ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '../ui/command';
import { Kbd } from '../ui/kbd';
import { LEGAL_LINKS, NAV_LINKS, SOCIAL_LINKS } from './contents';

const LINK_NAV_ITEMS = NAV_LINKS.filter(
  (item): item is (typeof NAV_LINKS)[number] & { href: string } =>
    item.type !== 'theme' && typeof item.href === 'string',
);

const LINK_LEGAL_ITEMS = LEGAL_LINKS.filter(
  (item): item is (typeof LEGAL_LINKS)[number] & { href: string } =>
    item.type !== 'theme' && typeof item.href === 'string',
);

const HAMBURGER = {
  top: 'M 4 8 L 20 8',
  bottom: 'M 4 16 L 20 16',
};

const CLOSE = {
  top: 'M 5 5 L 19 19',
  bottom: 'M 19 5 L 5 19',
};

const contentFade = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.22 + i * 0.06,
      duration: 0.35,
    },
  }),
  exit: { opacity: 0, transition: { duration: 0.08 } },
};

const spring = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

export default function NavMenu() {
  const open = useNavbarStore((s) => s.isMenuOpen);
  const openCommand = useNavbarStore((s) => s.isCommandMenuOpen);
  const setOpen = useNavbarStore((s) => s.setOpen);
  const setCommandMenuOpen = useNavbarStore((s) => s.setCommandMenuOpen);

  const toggleOpen = useNavbarStore((s) => s.toggleOpen);

  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pendingHashRef = useRef<string | null>(null);

  const [btnSize, setBtnSize] = useState(48);
  const [showBg, setShowBg] = useState(false);
  const [viewportSize, setViewportSize] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const isOverlayOpen = open || openCommand;

  const pathname = usePathname();
  const router = useRouter();

  // Memoize so the animation effect doesn't fire on every render
  const openMenuSize = useMemo(() => {
    const inset = viewportSize.width >= 640 ? 32 : 16;
    return {
      width:
        viewportSize.width > 0
          ? Math.min(Math.max(viewportSize.width - inset * 2, btnSize), 460)
          : 460,
      height:
        viewportSize.height > 0
          ? Math.max(viewportSize.height - inset * 2, btnSize)
          : 600,
    };
  }, [viewportSize.width, viewportSize.height, btnSize]);

  const panelWidth = useMotionValue(btnSize);
  const panelHeight = useMotionValue(btnSize);

  // Cancel in-flight animations on re-trigger
  useEffect(() => {
    const targetW = open ? openMenuSize.width : btnSize;
    const targetH = open ? openMenuSize.height : btnSize;
    let cancelled = false;

    if (open) {
      setShowBg(true);
    }

    const ctrlW = animate(panelWidth, targetW, spring);
    const ctrlH = animate(panelHeight, targetH, spring);

    if (!open) {
      void Promise.all([ctrlW.finished, ctrlH.finished])
        .then(() => {
          if (!cancelled) setShowBg(false);
        })
        .catch(() => {
          if (!cancelled) setShowBg(false);
        });
    }

    return () => {
      cancelled = true;
      ctrlW.stop();
      ctrlH.stop();
    };
  }, [open, openMenuSize.width, openMenuSize.height, btnSize]);

  // ResizeObserver for button + window resize for viewport
  useEffect(() => {
    const updateViewport = () =>
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });

    updateViewport();

    const ro = new ResizeObserver(() => {
      if (toggleRef.current) setBtnSize(toggleRef.current.offsetWidth);
    });
    if (toggleRef.current) ro.observe(toggleRef.current);

    window.addEventListener('resize', updateViewport);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setCommandMenuOpen(false);
  }, [pathname, setOpen, setCommandMenuOpen]);

  useEffect(() => {
    if (pathname !== '/' || !pendingHashRef.current) return;

    const targetId = pendingHashRef.current;
    let rafId = 0;
    let attempts = 0;
    const maxAttempts = 30;

    const tryScroll = () => {
      const target = document.getElementById(targetId);
      if (target) {
        smoothScrollTo(target);
        window.history.replaceState(null, '', `/#${targetId}`);
        pendingHashRef.current = null;
        return;
      }

      attempts += 1;
      if (attempts < maxAttempts) {
        rafId = window.requestAnimationFrame(tryScroll);
      }
    };

    rafId = window.requestAnimationFrame(tryScroll);
    return () => window.cancelAnimationFrame(rafId);
  }, [pathname]);

  // Keep page scroll and Escape handling in one place for both overlays.
  useEffect(() => {
    const lenis = getLenisInstance();

    if (!isOverlayOpen) {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      lenis?.start();
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    lenis?.stop();

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openCommand) {
          setCommandMenuOpen(false);
        }
        if (open) {
          setOpen(false);
        }
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      lenis?.start();
      window.removeEventListener('keydown', handler);
    };
  }, [isOverlayOpen, open, openCommand, setCommandMenuOpen, setOpen]);

  // Focus trap
  useEffect(() => {
    if (!open || !menuRef.current) return;

    const focusable = Array.from(
      menuRef.current.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((node) => !node.hasAttribute('disabled'));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleTab);
    first?.focus();
    return () => window.removeEventListener('keydown', handleTab);
  }, [open]); // menuRef is a stable ref object — no need to list it

  const openCommandMenu = () => {
    setOpen(false);
    setCommandMenuOpen(true);
  };

  const handleCommandNavigate = (href: string) => {
    setCommandMenuOpen(false);

    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');

      if (pathname === '/') {
        const target = document.getElementById(targetId);
        if (target) {
          smoothScrollTo(target);
          window.history.replaceState(null, '', href);
          return;
        }
      }

      pendingHashRef.current = targetId;
      router.push('/');
      return;
    }

    router.push(href);
  };

  const handleMenuNavigate = (href: string) => {
    setOpen(false);

    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '');

      if (pathname === '/') {
        const target = document.getElementById(targetId);
        if (target) {
          smoothScrollTo(target);
          window.history.replaceState(null, '', href);
          return;
        }
      }

      pendingHashRef.current = targetId;
      router.push('/');
      return;
    }

    router.push(href);
  };

  const handleCommandSocialOpen = (href: string) => {
    setCommandMenuOpen(false);
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleCommandLegalNavigate = (href: string) => {
    setCommandMenuOpen(false);
    router.push(href);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(false);
        setCommandMenuOpen(!openCommand);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [openCommand, setCommandMenuOpen, setOpen]);

  return (
    <header className="relative z-90">
      <div className="absolute inset-0 grid grid-cols-2 p-4 sm:p-8">
        {/* <BrandLogoTextAnimated className="hidden lg:block lg:h-16 lg:w-fit" /> */}
        {/* <BrandLogoTextOut className="hidden lg:block lg:h-16 lg:w-fit" /> */}

        {/* <BrandLogoSymbol className="h-12 w-fit lg:justify-self-center stroke-black stroke-2 fill-lemon" /> */}
        <Link href="/" className="w-fit">
          <BrandLogoFrame className="size-12 xl:size-14 2xl:size-16 transition-all duration-350" />
        </Link>

        <div className="justify-self-end flex gap-2 lg:gap-4">
          <Link href="/resume" className="hidden md:block">
            <Button
              variant="ghost"
              className="dark:border dark:border-primary text-primary rounded-sm lg:rounded-lg h-12 xl:h-14 2xl:h-16 dark:hover:bg-primary hover:bg-primary hover:text-background text-xl uppercase font-medium tracking-wider transition-colors bg-lemon dark:bg-transparent"
            >
              Resume
            </Button>
          </Link>
          <Button
            onClick={openCommandMenu}
            variant="outline"
            size={'icon'}
            aria-label="Open command menu"
            className="size-12 xl:size-14 2xl:size-16"
          >
            <CommandIcon className="size-5 lg:size-7" />
            <span className="sr-only">Open command menu</span>
          </Button>
          <CommandDialog open={openCommand} onOpenChange={setCommandMenuOpen}>
            <Command>
              <CommandInput placeholder="Type to search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Navigation">
                  {LINK_NAV_ITEMS.map(
                    ({ label, description, href, icon: Icon }) => (
                      <CommandItem
                        key={label}
                        value={`${label} ${description ?? ''}`}
                        onSelect={() => handleCommandNavigate(href)}
                        className="cursor-pointer group"
                      >
                        <Icon className="aspect-square mr-2" />
                        <div className="flex flex-col gap-1">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">
                            {description}
                          </span>
                        </div>
                        <CommandShortcut className="hidden group-hover:flex group-data-[selected=true]:flex">
                          <CornerDownLeft className="typo-ghost" />
                        </CommandShortcut>
                      </CommandItem>
                    ),
                  )}
                </CommandGroup>
                {/* <CommandGroup heading="Legal">
                  {LINK_LEGAL_ITEMS.map(
                    ({ label, description, href, icon: Icon }) => (
                      <CommandItem
                        key={label}
                        value={`${label} ${description ?? ''}`}
                        onSelect={() => handleCommandLegalNavigate(href)}
                        className="cursor-pointer group"
                      >
                        <Icon className="aspect-square mr-2" />
                        <div className="flex flex-col gap-1">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">
                            {description}
                          </span>
                        </div>
                        <CommandShortcut className="hidden group-hover:flex group-data-[selected=true]:flex">
                          <CornerDownLeft className="typo-ghost" />
                        </CommandShortcut>
                      </CommandItem>
                    ),
                  )}
                </CommandGroup> */}
                <CommandGroup heading="Social">
                  {SOCIAL_LINKS.map(
                    ({ label, description, href, icon: Icon }) => (
                      <CommandItem
                        key={label}
                        value={`${label} ${description ?? ''}`}
                        onSelect={() => handleCommandSocialOpen(href)}
                        className="cursor-pointer group"
                      >
                        <Icon className="aspect-square mr-2" />
                        <div className="flex flex-col gap-1">
                          <span>{label}</span>
                          <span className="text-xs text-muted-foreground">
                            {description}
                          </span>
                        </div>
                        <CommandShortcut className="hidden group-hover:flex group-data-[selected=true]:flex">
                          <CornerDownLeft className="typo-ghost" />
                        </CommandShortcut>
                      </CommandItem>
                    ),
                  )}
                </CommandGroup>
              </CommandList>
              <CommandFooter className="flex justify-between gap-4 items-center">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1 items-center">
                    <Kbd className="border">↑↓</Kbd>
                    <span className="text-xs typo-mono">navigate</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Kbd className="border">↵</Kbd>
                    <span className="text-xs typo-mono">select</span>
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <Kbd className="border">esc</Kbd>
                  <span className="text-xs typo-mono">close</span>
                </div>
              </CommandFooter>
            </Command>
          </CommandDialog>
          <Button
            ref={toggleRef}
            size="icon"
            variant="ghost"
            onClick={toggleOpen}
            aria-expanded={open}
            aria-controls="site-menu"
            className={cn(
              'size-12 xl:size-14 2xl:size-16 z-20 text-background hover:text-background dark:hover:text-background group bg-primary hover:bg-primary/80 dark:hover:bg-primary/80',
              open &&
                'bg-transparent hover:bg-transparent dark:hover:bg-transparent',
            )}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="overflow-visible size-5 lg:size-7 group-hover:scale-110 transition-all duration-350"
            >
              <motion.path
                d={open ? CLOSE.top : HAMBURGER.top}
                initial={false}
                strokeWidth="2"
                strokeLinecap="round"
                stroke="currentColor"
                animate={{ d: open ? CLOSE.top : HAMBURGER.top }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              />
              <motion.path
                d={open ? CLOSE.bottom : HAMBURGER.bottom}
                initial={false}
                strokeWidth="2"
                strokeLinecap="round"
                stroke="currentColor"
                animate={{ d: open ? CLOSE.bottom : HAMBURGER.bottom }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              />
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <motion.div
            ref={menuRef}
            id="site-menu"
            style={{ width: panelWidth, height: panelHeight }}
            className={cn(
              showBg && 'bg-primary/80 backdrop-blur-sm',
              'absolute top-4 sm:top-8 right-4 sm:right-8 z-10 overflow-hidden rounded-sm lg:rounded-lg',
            )}
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 flex flex-col"
                >
                  <motion.div
                    custom={0}
                    variants={contentFade}
                    className="flex justify-between px-8 pt-7 pb-5"
                  >
                    <span className="typo-body typo-label text-xs text-background/60">
                      Menu
                    </span>
                  </motion.div>

                  <nav className="flex-1 flex flex-col justify-center px-8 typo-display-cond lowercase">
                    {LINK_NAV_ITEMS.map(({ label, href, id }, i) => (
                      <motion.div
                        key={id}
                        custom={i + 1}
                        variants={contentFade}
                      >
                        <button
                          onClick={() => handleMenuNavigate(href)}
                          className="inline-block py-2 2xl:py-3 transition-transform duration-350 text-background/60 dark:text-background/70 hover:text-background dark:hover:text-background hover:scale-110 transform-gpu text-3xl 2xl:text-4xl text-left bg-transparent border-none cursor-pointer p-0 font-inherit"
                        >
                          {label}
                        </button>
                      </motion.div>
                    ))}
                  </nav>

                  <motion.div
                    custom={LINK_NAV_ITEMS.length + 2}
                    variants={contentFade}
                    className="flex justify-between items-center px-8 pb-7 pt-4 typo-body typo-caption-sm text-background/60 uppercase"
                  >
                    {/* <div className="flex flex-col gap-1 text-xs">
											<a
												href="mailto:hello@siamparvez.com"
												className="hover:text-background"
											>
												hello@siamparvez.com
											</a>
											<a
												href="tel:+8801706176979"
												className="hover:text-background"
											>
												+880 170 617 6979
											</a>
										</div> */}
                    {/* <div className="typo-body typo-label text-xs text-background/60 flex gap-2 items-center">
                      {LINK_LEGAL_ITEMS.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setOpen(false);
                              router.push(item.href);
                            }}
                            className="transition-colors hover:text-background bg-transparent border-none cursor-pointer p-0 font-inherit"
                          >
                            {item.label}
                          </button>
                          {index < LINK_LEGAL_ITEMS.length - 1 ? (
                            <span className="opacity-35">•</span>
                          ) : null}
                        </div>
                      ))}
                    </div> */}
                    <div className="flex items-end justify-center gap-3 text-lg">
                      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                        <button
                          key={label}
                          className="flex items-center gap-1 hover:text-background transition-all duration-200 bg-transparent border-none cursor-pointer p-0"
                          onClick={() => {
                            setOpen(false);
                            window.open(href, '_blank', 'noopener,noreferrer');
                          }}
                          title={label}
                          type="button"
                        >
                          <Icon />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        {/* BACKDROP */}
        {/* DO NOT REMOVE */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
