'use client';

import { useEffect } from 'react';

const SERVICE_WORKER_URL = '/serwist/sw.js';

export function PWARegister() {
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(SERVICE_WORKER_URL, {
          scope: '/',
        })
        .catch((err) => {
          console.debug('Service Worker registration failed:', err);
        });
    }

    // Close any previous service workers in dev mode for hot reload
    if (process.env.NODE_ENV === 'development') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // ignore
          });
        });
      });
    }
  }, []);

  return null;
}
