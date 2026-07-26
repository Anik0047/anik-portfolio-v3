'use client';

import { FingerprintPattern, Mail } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';

interface DevToolsDetectedProps {
  children: React.ReactNode;
}

export function DevToolsDetected({ children }: DevToolsDetectedProps) {
  const [detected, setDetected] = useState(false);
  const [visible, setVisible] = useState(false);

  const checkDevTools = useCallback(() => {
    // Method 1: window size differential (most reliable)
    const threshold = 160;
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    if (widthDiff > threshold || heightDiff > threshold) {
      return true;
    }

    // Method 2: console timing trick
    let devtoolsOpen = false;
    const start = performance.now();
    // eslint-disable-next-line no-console
    console.profile();
    // eslint-disable-next-line no-console
    console.profileEnd();
    if (performance.now() - start > 10) {
      devtoolsOpen = true;
    }

    return devtoolsOpen;
  }, []);

  useEffect(() => {
    // Suppress console output when devtools are open
    if (typeof window === 'undefined') return;

    let animationFrame: number;

    const loop = () => {
      const isOpen = checkDevTools();
      if (isOpen && !detected) {
        setDetected(true);
        setTimeout(() => setVisible(true), 50); // slight delay for animation
      } else if (!isOpen && detected) {
        setVisible(false);
        setTimeout(() => setDetected(false), 500); // wait for fade-out
      }
      animationFrame = requestAnimationFrame(loop);
    };

    animationFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrame);
  }, [checkDevTools, detected]);

  if (!detected) return <>{children}</>;

  return (
    <div
      className={cn(
        'fixed inset-0 z-90 flex-center transition-opacity duration-350 bg-background',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <Card
        showBracketsOnHover
        bracketProps={{
          className: 'opacity-100',
          offset: 10,
        }}
        className={cn(
          'transition-all duration-500 flex flex-col items-center gap-6 w-full max-w-sm rounded-none',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        )}
      >
        {/* Clock icon */}
        <div className='flex-center rounded-full size-12 bg-primary'>
          <FingerprintPattern
            className='size-7 text-lemon dark:text-background'
            strokeWidth={1.5}
          />
        </div>

        {/* Headline */}
        <div className='text-center space-y-2'>
          <p className='text-xs typo-label typo-mono typo-subtle'>
            Access Restricted
          </p>
          <h1 className='text-3xl lowercase text-foreground typo-display leading-7'>
            DEV TOOLS{' '}
            <span className='typo-display-outline text-2xl text-primary'>
              detected
            </span>
          </h1>
          <p className='text-sm mt-6 mb-2 typo-body typo-subtle'>
            Curious about how this was built?
            <br />
            Let&apos;s connect and chat about it.
          </p>
        </div>

        {/* CTA Buttons */}
        <Button asChild className='w-full h-10 lg:h-12'>
          <Link href='mailto:anik.barua.dev@gmail.com'>
            <Mail className='size-4' />
            <span>Get in Touch</span>
          </Link>
        </Button>

        {/* Footer */}
        <p className='text-center typo-body text-xs w-full typo-ghost'>
          &copy; {new Date().getFullYear()} Anik Barua
        </p>
      </Card>
    </div>
  );
}
