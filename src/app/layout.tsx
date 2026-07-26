import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import AnimationProvider from '@/components/common/animation-provider';
import { DevToolsDetected } from '@/components/common/devtools-detected';
import GoogleAnalytics from '@/components/common/google-analytics';
import Preloader from '@/components/common/preloader';
import ScrollIndicator from '@/components/common/scroll-indicator';
import SmoothScrollProvider from '@/components/common/smooth-scroll-provider';
import {
  inter,
  jetBrainsMono,
  tarrget,
  tarrget3D,
  tarrgetAcad,
  tarrgetChrome,
  tarrgetCond,
  tarrgetEngrave,
  tarrgetExpand,
  tarrgetGrad,
  tarrgetHalf,
  tarrgetLaser,
  tarrgetLeft,
  tarrgetOut,
  tarrgetPlat,
} from '@/lib/fonts';
import { siteUrl } from '@/lib/site';

import './globals.css';

export const siteConfig = {
  name: 'Anik Barua',
  title: 'Anik Barua | Frontend Engineer',
  description:
    'Frontend Engineer with 1+ years of remote delivery for US and UK clients. Building fast, reliable web applications with TypeScript, Next.js, React, and Node.js — from UI to API, database, and deployment.',
  url: siteUrl,
  author: 'Anik Barua',
  keywords: [
    'Anik Barua',
    'Anik',
    'Barua',
    'anikbarua44',
    'anik-barua',
    'anikbarua',
    'anik0047',
    'anik.barua.dev',
    'Frontend Engineer',
    'Frontend Developer',
    'React Developer',
    'Next.js Developer',
    'Remote Developer',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'PostgreSQL',
    'Tailwind CSS',
    'API Design',
    'Web Developer',
    'Hire Next.js Developer',
    'Remote Developer Bangladesh',
    'Portfolio',
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    // no images needed — Next.js auto-detects app/opengraph-image.png
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: '@TheOne_Siam',
    // no images needed — Next.js auto-detects app/twitter-image.png
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} ${tarrget.variable} ${tarrget3D.variable} ${tarrgetAcad.variable} ${tarrgetChrome.variable} ${tarrgetCond.variable} ${tarrgetEngrave.variable} ${tarrgetExpand.variable} ${tarrgetGrad.variable} ${tarrgetHalf.variable} ${tarrgetLaser.variable} ${tarrgetLeft.variable} ${tarrgetOut.variable} ${tarrgetPlat.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          // enableSystem
          disableTransitionOnChange
        >
          {/* <SmoothScrollProvider> */}
          <AnimationProvider>
            <DevToolsDetected>
              <GoogleAnalytics />
              {children}
              {/* <ScrollIndicator /> */}
              <Preloader />
            </DevToolsDetected>
          </AnimationProvider>
          {/* </SmoothScrollProvider> */}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
