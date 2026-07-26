'use client';
import {
  CheckCircle,
  Copy,
  Download,
  FileUser,
  Info,
  Mail,
  Moon,
  Phone,
  Share2,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import BrandLogoSymbol from '../svgs/brand-logo-symbol';

const CONTACT_EMAIL = 'anikbrua98@gmail.com';
const CONTACT_PHONE = '+8801890873395';
const RESUME_PATH = '/Anik_Barua_Resume.pdf';

// Type for PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// PWA install prompt state (set at app level)
let deferredPrompt: BeforeInstallPromptEvent | null = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
}

async function copyToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === 'undefined') {
    throw new Error('Clipboard not available');
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function triggerEasterEgg() {
  const animations = [
    {
      name: 'spin',
      keyframes: `
        @keyframes easter-egg-spin {
          0% { transform: rotateZ(0deg) scale(1); }
          50% { transform: rotateZ(5deg) scale(1.02); }
          100% { transform: rotateZ(0deg) scale(1); }
        }
      `,
      timing: '3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    {
      name: 'bounce',
      keyframes: `
        @keyframes easter-egg-bounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-10px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-5px); }
        }
      `,
      timing: '2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
    {
      name: 'pulse',
      keyframes: `
        @keyframes easter-egg-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `,
      timing: '2.5s cubic-bezier(0.4, 0.0, 0.2, 1)',
    },
  ];

  const animation = animations[Math.floor(Math.random() * animations.length)];
  const root = document.documentElement;
  root.style.animation = `${animation.name} ${animation.timing} infinite`;

  const style = document.createElement('style');
  style.textContent = animation.keyframes;
  document.head.appendChild(style);

  const messages = [
    '✨ You found the Easter egg!',
    '🎉 Surprise!',
    '🚀 Something fun happened!',
    '😄 Got you!',
    '🌟 Magic!',
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  toast.success(randomMessage, { icon: <Sparkles className='size-4' /> });

  setTimeout(() => {
    root.style.animation = '';
    style.remove();
  }, 3000);
}

async function runDefaultMenuAction(
  item: MenuItem,
  position?: { x: number; y: number },
  setTheme?: (theme: string) => void,
) {
  if (typeof window === 'undefined') return;

  switch (item.id) {
    case 'toggle-theme': {
      const isDark = document.documentElement.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';

      if (document.startViewTransition && setTheme) {
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            setTheme(newTheme);
          });
        });

        transition.ready.then(() => {
          // Use provided position or fallback to viewport center
          const x = position?.x ?? window.innerWidth / 2;
          const y = position?.y ?? window.innerHeight / 2;
          const maxRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y),
          );

          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            } as unknown as Keyframe[],
            {
              duration: 400,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            } as unknown as KeyframeAnimationOptions,
          );
        });
      } else if (setTheme) {
        setTheme(newTheme);
      }

      const message =
        newTheme === 'dark'
          ? 'Switched to Dark Mode'
          : 'Switched to Light Mode';
      const icon =
        newTheme === 'dark' ? (
          <Moon className='size-4' />
        ) : (
          <Sun className='size-4' />
        );
      toast.success(message, { icon });
      return;
    }
    case 'copy-link': {
      await copyToClipboard(window.location.href);
      toast.success('Website link copied', {
        icon: <Copy className='size-4' />,
      });
      return;
    }
    case 'share': {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'Siam Parvez Portfolio',
          text: "Check out Siam Parvez's portfolio",
          url: window.location.href,
        });
        toast.success('Shared successfully', {
          icon: <Share2 className='size-4' />,
        });
        return;
      }

      await copyToClipboard(window.location.href);
      toast.info('Share not available, copied link instead', {
        icon: <Info className='size-4' />,
      });
      return;
    }
    case 'email': {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
      toast.success('Opening email', { icon: <Mail className='size-4' /> });
      return;
    }
    case 'call': {
      window.location.href = `tel:${CONTACT_PHONE}`;
      toast.success('Opening phone', { icon: <Phone className='size-4' /> });
      return;
    }
    case 'resume': {
      openInNewTab(RESUME_PATH);
      toast.success('Opening resume', {
        icon: <FileUser className='size-4' />,
      });
      return;
    }
    case 'install-pwa': {
      // Enhanced standalone detection
      const isChrome = /chrome|chromium|crios/i.test(navigator.userAgent);
      const isEdge = /edg/i.test(navigator.userAgent);
      const isFirefox = /firefox/i.test(navigator.userAgent);

      // Multiple ways to detect if app is already installed
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches;
      const isNativeStandalone =
        (navigator as unknown as Navigator & { standalone?: boolean })
          .standalone === true;
      const canInstall = isChrome || isEdge;

      // Check if running in standalone mode (app already installed)
      if (isStandalone || isNativeStandalone) {
        toast.success('App already installed!', {
          icon: <CheckCircle className='size-4' />,
        });
      }
      // Try native install prompt if available
      else if (deferredPrompt && canInstall) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
            toast.success('Portfolio app installed!', {
              icon: <CheckCircle className='size-4' />,
            });
          } else {
            toast.info('Installation cancelled', {
              icon: <Info className='size-4' />,
            });
          }
          deferredPrompt = null;
        });
      }
      // iOS or other browsers without native prompt
      else if (
        isFirefox ||
        /iphone|ipad|ipod/i.test(navigator.userAgent) ||
        !canInstall
      ) {
        toast.info('Use the browser menu to install this app', {
          icon: <Info className='size-4' />,
        });
      }
      // App not installable on this device/browser
      else {
        toast.info(
          'App not available for installation on this device/browser',
          {
            icon: <Info className='size-4' />,
          },
        );
      }
      return;
    }
    case 'easter-egg': {
      triggerEasterEgg();
      return;
    }
    default: {
      toast.info(`${item.label} clicked`);
    }
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export interface RadialMenuProps {
  children?: React.ReactNode;
  menuItems?: MenuItem[] | undefined;
  /** Overall diameter of the radial menu in pixels. Default: 240 */
  size?: number;
  /** Pixel size of the icon rendered inside each wedge. Default: 18 */
  iconSize?: number;
  /** Thickness of the main wedge band. Default: 50 */
  bandWidth?: number;
  /** Gap between inner circle and band. Default: 0 */
  innerGap?: number;
  /** Gap between band and outer ring. Default: 8 */
  outerGap?: number;
  /** Width of the decorative outer ring. Default: 12 */
  outerRingWidth?: number;
  onSelect?: (item: MenuItem) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface RadialMenuContextValue {
  open: boolean;
  position: { x: number; y: number };
  activeIndex: number | null;
  setActiveIndex: (i: number | null) => void;
  close: () => void;
  menuItems?: MenuItem[] | undefined;
  size: number;
  iconSize: number;
  bandWidth: number;
  innerGap: number;
  outerGap: number;
  outerRingWidth: number;
  onSelect?: (item: MenuItem) => void;
  setTheme?: (theme: string) => void;
}

const RadialMenuContext = createContext<RadialMenuContextValue | null>(null);

function useRadialMenu() {
  const ctx = useContext(RadialMenuContext);
  if (!ctx) throw new Error('useRadialMenu must be inside RadialMenuProvider');
  return ctx;
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
): string {
  const s = startAngle;
  const e = endAngle;

  const o1 = polarToCartesian(cx, cy, outerR, s);
  const o2 = polarToCartesian(cx, cy, outerR, e);
  const i1 = polarToCartesian(cx, cy, innerR, e);
  const i2 = polarToCartesian(cx, cy, innerR, s);

  const largeArc = e - s > 180 ? 1 : 0;

  return [
    `M ${o1.x} ${o1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i1.x} ${i1.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${i2.x} ${i2.y}`,
    'Z',
  ].join(' ');
}

// ─── Wedge SVG ───────────────────────────────────────────────────────────────

function RadialWedge({
  item,
  index,
  total,
  cx,
  cy,
  innerR,
  outerR,
  outerRingWidth,
  iconSize,
  outerGap,
}: {
  item: MenuItem;
  index: number;
  total: number;
  cx: number;
  cy: number;
  innerR: number;
  outerR: number;
  outerRingWidth: number;
  iconSize: number;
  outerGap: number;
}) {
  const { activeIndex, setActiveIndex, close, onSelect, position, setTheme } =
    useRadialMenu();

  const sliceAngle = 360 / total;
  const startAngle = index * sliceAngle;
  const endAngle = startAngle + sliceAngle;
  const midAngle = startAngle + sliceAngle / 2;

  const isActive = activeIndex === index;
  const isAnyActive = activeIndex !== null;

  // icon position — middle of band
  const iconR = (innerR + outerR) / 2;
  const iconPos = polarToCartesian(cx, cy, iconR, midAngle);

  // outer ring arc
  const ringInnerR = outerR + outerGap;
  const ringOuterR = ringInnerR + outerRingWidth;

  const wedgePath = describeArc(cx, cy, innerR, outerR, startAngle, endAngle);
  const ringPath = describeArc(
    cx,
    cy,
    ringInnerR,
    ringOuterR,
    startAngle,
    endAngle,
  );

  const handleClick = async () => {
    if (item.disabled) return;

    if (onSelect) {
      onSelect(item);
    } else {
      try {
        await runDefaultMenuAction(item, position, setTheme);
      } catch {
        toast.error('Action failed');
      }
    }

    close();
  };

  return (
    <g
      className='group cursor-pointer select-none'
      onClick={handleClick}
      onMouseEnter={() => !item.disabled && setActiveIndex(index)}
      onMouseLeave={() => setActiveIndex(null)}
      style={{ outline: 'none' }}
      role='menuitem'
      aria-label={item.label}
      aria-disabled={item.disabled}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
    >
      {/* Main wedge */}
      <path
        d={wedgePath}
        className={cn(
          'transition-all duration-200 ease-out',
          item.disabled
            ? 'fill-muted stroke-border cursor-not-allowed'
            : isActive
              ? 'fill-primary stroke-primary'
              : isAnyActive
                ? 'fill-muted/40 stroke-primary/10'
                : 'fill-muted stroke-border hover:fill-accent',
        )}
        strokeWidth='1'
      />

      {/* Outer ring segment */}
      <path
        d={ringPath}
        className={cn(
          'transition-all duration-200 ease-out',
          item.disabled
            ? 'fill-muted/30'
            : isActive
              ? 'fill-primary/60'
              : 'fill-muted/60',
        )}
        strokeWidth='0'
      />

      {/* Icon */}
      <foreignObject
        x={iconPos.x - iconSize / 2}
        y={iconPos.y - iconSize / 2}
        width={iconSize}
        height={iconSize}
        className='pointer-events-none overflow-visible'
      >
        <div
          className={cn(
            'flex items-center justify-center w-full h-full transition-all duration-200',
            item.disabled
              ? 'text-muted-foreground/40'
              : isActive
                ? 'text-primary-foreground'
                : 'text-muted-foreground',
          )}
          style={{ fontSize: iconSize }}
        >
          {item.icon}
        </div>
      </foreignObject>
    </g>
  );
}

// ─── Label tooltip that follows the active item ───────────────────────────────

function ActiveLabel({ cx, cy }: { cx: number; cy: number }) {
  const { activeIndex, menuItems } = useRadialMenu();

  if (activeIndex === null || !menuItems) return null;
  const item = menuItems[activeIndex];
  if (!item) return null;

  return (
    <foreignObject
      x={cx - 48}
      y={cy - 12}
      width={96}
      height={24}
      className='pointer-events-none'
    >
      <div className='flex items-center justify-center h-full'>
        <span className='text-[10px] font-medium text-foreground/70 whitespace-nowrap rounded px-1.5 py-0.5'>
          {item.label}
        </span>
      </div>
    </foreignObject>
  );
}

// ─── The floating SVG menu ────────────────────────────────────────────────────

function RadialMenuOverlay() {
  const {
    open,
    position,
    activeIndex,
    menuItems,
    size,
    iconSize,
    bandWidth,
    innerGap,
    outerGap,
    outerRingWidth,
    close,
  } = useRadialMenu();

  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(e.target as Node)
      ) {
        close();
      }
    };
    window.addEventListener('mousedown', handle);
    return () => window.removeEventListener('mousedown', handle);
  }, [open, close]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [open, close]);

  if (!open || !menuItems) return null;

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - outerGap - outerRingWidth - 2;
  const innerR = outerR - bandWidth;

  // clamp so menu stays in viewport
  const vw = typeof window !== 'undefined' ? window.innerWidth : 9999;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 9999;
  const left = Math.min(Math.max(position.x - cx, 8), vw - size - 8);
  const top = Math.min(Math.max(position.y - cy, 8), vh - size - 8);

  return (
    <div
      ref={overlayRef}
      className='fixed z-45 pointer-events-auto'
      style={{
        left,
        top,
        width: size,
        height: size,
      }}
    >
      {/* Entry animation wrapper */}
      <div
        className='w-full h-full rounded-full bg-background/70 dark:bg-primary/10 backdrop-blur-2xl overflow-hidden'
        style={{
          animation:
            'radial-menu-in 180ms cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label='Radial context menu'
        >
          {/* Background circle */}
          <circle
            cx={cx}
            cy={cy}
            r={innerR - innerGap}
            className='fill-background stroke-border'
            strokeWidth='1'
          />

          {/* Wedges */}
          {menuItems.map((item, i) => (
            <RadialWedge
              key={item.id}
              item={item}
              index={i}
              total={menuItems.length}
              cx={cx}
              cy={cy}
              innerR={innerR - innerGap}
              outerR={outerR}
              outerRingWidth={outerRingWidth}
              iconSize={iconSize}
              outerGap={outerGap}
            />
          ))}

          {/* Center logo */}
          {activeIndex === null && (
            <>
              <circle cx={cx} cy={cy} r={12} className='fill-transparent' />
              <foreignObject
                x={cx - 12}
                y={cy - 12}
                width={24}
                height={24}
                className='pointer-events-none'
              >
                <div className='flex items-center justify-center size-full'>
                  <BrandLogoSymbol className='size-6' />
                </div>
              </foreignObject>
            </>
          )}

          {/* Center label */}
          <ActiveLabel cx={cx} cy={cy} />
        </svg>
      </div>

      <style>{`
        @keyframes radial-menu-in {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

export function RadialMenu({
  children,
  menuItems: menuItemsProp,
  size = 240,
  iconSize = 18,
  bandWidth = 50,
  innerGap = 0,
  outerGap = 8,
  outerRingWidth = 12,
  onSelect,
}: RadialMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  // Build menu items with dynamic theme label/icon
  const MENU_ITEMS: MenuItem[] = [
    { id: 'copy-link', label: 'Copy Link', icon: <Copy size={16} /> },
    { id: 'share', label: 'Share Website', icon: <Share2 size={16} /> },
    { id: 'email', label: 'Email Me', icon: <Mail size={16} /> },
    { id: 'call', label: 'Call Me', icon: <Phone size={16} /> },
    { id: 'resume', label: 'Resume', icon: <FileUser size={16} /> },
    {
      id: 'toggle-theme',
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
    },
    { id: 'install-pwa', label: 'Install App', icon: <Download size={16} /> },
    { id: 'easter-egg', label: 'Surprise Me!', icon: <Sparkles size={16} /> },
  ];

  const menuItems = menuItemsProp ?? MENU_ITEMS;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(null);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setOpen(true);
  }, []);

  return (
    <RadialMenuContext.Provider
      value={{
        open,
        position,
        activeIndex,
        setActiveIndex,
        close,
        menuItems,
        size,
        iconSize,
        bandWidth,
        innerGap,
        outerGap,
        outerRingWidth,
        onSelect,
        setTheme,
      }}
    >
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        onKeyDown={(e) => {
          if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
            e.preventDefault();
            const rect = e.currentTarget.getBoundingClientRect();
            setPosition({
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            });
            setOpen(true);
          }
        }}
        aria-haspopup='menu'
        className='w-full h-full p-0 m-0 border-0 bg-transparent text-left'
      >
        {children ?? (
          <div className='flex items-center justify-center w-full h-full min-h-50 rounded-xl border border-dashed border-border bg-muted/20 text-sm text-muted-foreground select-none'>
            Right click anywhere here
          </div>
        )}
      </div>

      <RadialMenuOverlay />
    </RadialMenuContext.Provider>
  );
}
