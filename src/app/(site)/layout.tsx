import PageShell from '@/components/common/page-shell';
import PWAInstallPrompt from '@/components/common/pwa-prompt';
import SiteSchema from '@/components/common/site-schema';

// import { ScrollProgressSidebar } from "@/components/common/scroll-progess-sidebar";
// import { NAV_LINKS } from "@/components/layout/contents";

import { PWARegister } from '@/components/common/pwa-register';
import { TailwindHelper } from '@/components/common/tailwind-helper';
import { FloatingToolbar } from '@/components/floating-toolbar';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { RadialMenu } from '@/components/ui/radical-menu';
import { Toaster } from '@/components/ui/sonner';

// import DynamicFavicon from "../../components/common/dynamic-favicon";

// import { Pointer } from "@/components/ui/pointer";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RadialMenu
      // menuItems={MENU_ITEMS}
      size={240}
      iconSize={16}
      bandWidth={52}
      innerGap={8}
      outerGap={0}
      outerRingWidth={10}
      // onSelect={handleSelect}
    >
      {/* <ScrollProgressSidebar sections={NAV_LINKS} /> */}
      {/* <Pointer className="fill-primary" /> */}
      {/* <SmoothCursor/> */}

      <SiteSchema />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="min-h-svh">
        <PageShell className="space-y-24 lg:space-y-32">{children}</PageShell>
      </main>
      <Footer />
      <FloatingToolbar />
      {/* <PWAInstallPrompt /> */}
      <Toaster />
      <TailwindHelper />
      {/* <PWARegister /> */}
    </RadialMenu>
  );
}
