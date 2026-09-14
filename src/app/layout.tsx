import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'sonner';
import VersionCheck from "@/components/VersionCheck";
import PWADriver from "@/components/PWADriver";
import NotificationListener from "@/components/NotificationListener";
import FCMNotificationHandler from "@/components/FCMNotificationHandler";
import QueryProvider from "@/components/QueryProvider";
import { Suspense } from 'react';
import VercelAnalytics from "@/components/VercelAnalytics";
import GlobalSplashScreen from "@/components/GlobalSplashScreen";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#030303",
  viewportFit: "cover",
  // Prevents Android keyboard from resizing the layout viewport
  // so fixed/sticky headers don't get pushed off screen
  interactiveWidget: "resizes-visual",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // prevents invisible text during font load
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// NOTE: force-dynamic / revalidate=0 removed from root layout.
// Setting these globally kills all Next.js RSC caching across every route.
// Add them only on the specific page/route that needs fresh data.

export const metadata: Metadata = {
  metadataBase: new URL('https://levelonedev.tech'),
  title: {
    default: "LevelOne | Next-Gen Web Development Bootcamp & Engineering Cohort",
    template: "%s | LevelOne Dev"
  },
  applicationName: "LevelOne",
  description: "Master modern full-stack web development with LevelOne. Intensive project-based engineering cohort, interactive browser sandbox, guaranteed internships for top performers, and battle-tested curriculum.",
  keywords: [
    "levelone", 
    "levelone dev", 
    "levelonedev.tech", 
    "levelone webdev", 
    "levelone bootcamp", 
    "full stack web development", 
    "react nextjs cohort", 
    "aayush sharma",
    "web development internship",
    "coding bootcamp india"
  ],
  authors: [{ name: "Aayush Sharma", url: "https://levelonedev.tech/team" }],
  creator: "Aayush Sharma",
  publisher: "LevelOne",
  alternates: {
    canonical: 'https://levelonedev.tech',
  },
  openGraph: {
    title: "LevelOne | Next-Gen Web Development Bootcamp",
    description: "Learn Full-Stack Web Development through intense structured challenges, live mentoring, and guaranteed internship opportunities.",
    url: "https://levelonedev.tech",
    siteName: "LevelOne",
    images: [
      {
        url: "/icon-ninja-round.webp",
        width: 800,
        height: 800,
        alt: "LevelOne Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LevelOne | Web Development Engineering Cohort",
    description: "LevelOne Web Development Bootcamp — Build production apps, master backend & frontend, and compete for top internships.",
    images: ["/icon-ninja-round.webp"],
  },
  icons: {
    icon: '/icon-ninja-round.webp',
    apple: '/icon-ninja-round.webp',
    shortcut: '/icon-ninja-round.webp',
  },
  verification: {
    google: 'IaUidusALWKBeNQoaPCMPGKLQj_gDsU5K-fyZW_co_g',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest?v=3" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "EducationalOrganization",
                  "@id": "https://levelonedev.tech/#organization",
                  "name": "LevelOne",
                  "url": "https://levelonedev.tech",
                  "logo": "https://levelonedev.tech/icon-ninja-round.webp",
                  "description": "LevelOne is a competitive, phase-based web development engineering cohort. We structure the best open and industry-curated learning resources into milestone-driven progressive phases with live coding benchmarks and guaranteed internships for top 3 rankers.",
                  "founder": {
                    "@type": "Person",
                    "@id": "https://levelonedev.tech/#founder",
                    "name": "Aayush Sharma",
                    "jobTitle": "Founder & Lead Architect",
                    "description": "Full Stack Developer, Cybersecurity Engineer, and Creator of LevelOne and Acropolis Attendance Management System.",
                    "url": "https://itsaayushsharma.vercel.app/",
                    "sameAs": [
                      "https://www.linkedin.com/in/aayush-sharma-2013d",
                      "https://github.com/mraayush978blip"
                    ]
                  },
                  "sameAs": [
                    "https://github.com/mraayush978blip/levelone"
                  ]
                },
                {
                  "@type": "Course",
                  "name": "LevelOne Full-Stack Web Development Cohort",
                  "description": "Intensive milestone-driven cohort covering HTML, CSS, JavaScript, React, and Full-Stack Engineering using curated resources and competitive 20-day phase pacing with guaranteed internships for top 3 rankers.",
                  "provider": {
                    "@id": "https://levelonedev.tech/#organization"
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": "149",
                    "priceCurrency": "INR",
                    "availability": "https://schema.org/InStock",
                    "validFrom": "2026-09-01"
                  }
                }
              ]
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function hE(e) {
                  var m = (e.message || (e.reason && e.reason.message) || '').toLowerCase();
                  if (m.includes('chunkloaderror') || m.includes('failed to fetch dynamically imported module') || m.includes('unexpected token \\'<\\'')) {
                    if (sessionStorage.getItem('lv1_sync') === '1') return;
                    sessionStorage.setItem('lv1_sync', '1');
                    var u = new URL(window.location.href);
                    u.searchParams.set('sync', Date.now().toString());
                    window.location.href = u.toString();
                  }
                }
                window.addEventListener('error', hE, true);
                window.addEventListener('unhandledrejection', function(e) { hE(e); });
              })();
            `
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          <GlobalSplashScreen />
          <AuthProvider>
            {/* Background utilities each get their own Suspense — they don't block each other or the page */}
            <Suspense fallback={null}>
              <VersionCheck />
            </Suspense>
            <Suspense fallback={null}>
              <PWADriver />
            </Suspense>
            <Suspense fallback={null}>
              <NotificationListener />
            </Suspense>
            <Suspense fallback={null}>
              <FCMNotificationHandler />
            </Suspense>

            {/* Page content with its own loading state */}
            <Suspense fallback={
              <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050507] z-[9999]">
                <div className="relative flex flex-col items-center animate-fade-in-up">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/30 blur-[60px] rounded-full animate-pulse" />

                  {/* Glowing LevelOne Emblem */}
                  <div className="w-28 h-28 relative z-10 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-[2px] shadow-[0_0_50px_rgba(59,130,246,0.4)] animate-float">
                    <div className="w-full h-full bg-[#0b0d14] rounded-[22px] flex items-center justify-center">
                      <span className="text-4xl font-black text-blue-500 font-mono tracking-tighter">&gt;_</span>
                    </div>
                  </div>

                  <h1 className="mt-8 text-3xl font-black tracking-[-0.05em] text-white relative z-10">
                    LEVELONE
                  </h1>
                  <div className="mt-4 flex gap-2 relative z-10">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            }>
              {children}
            </Suspense>

            <VercelAnalytics />
            <SpeedInsights />
            <Toaster richColors position="top-center" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
