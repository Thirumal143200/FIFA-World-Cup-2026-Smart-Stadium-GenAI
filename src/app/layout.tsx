// src/app/layout.tsx
// Root layout — SEO metadata, theme provider, accessibility infrastructure

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FIFA StadiumOS — AI-Powered Smart Stadium Assistant',
    template: '%s | FIFA StadiumOS',
  },
  description:
    'AI-powered operational platform for FIFA World Cup 2026™. Stadium navigation, crowd intelligence, multilingual assistance, accessibility support, emergency response, and real-time decision tools for fans, staff, and organizers.',
  keywords: [
    'FIFA World Cup 2026',
    'Smart Stadium',
    'AI Assistant',
    'Stadium Navigation',
    'Crowd Management',
    'Multilingual',
    'Accessibility',
    'Emergency Response',
  ],
  authors: [{ name: 'FIFA StadiumOS Team' }],
  openGraph: {
    title: 'FIFA StadiumOS — AI-Powered Smart Stadium Assistant',
    description:
      'Navigate stadiums, check crowd density, get multilingual help, and access real-time intelligence for FIFA World Cup 2026™.',
    type: 'website',
    locale: 'en_US',
    siteName: 'FIFA StadiumOS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIFA StadiumOS',
    description: 'AI-Powered Smart Stadium Assistant for FIFA World Cup 2026™',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e40af' },
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Accessibility: Skip to main content link */}
        <a href="#main-content" className="skip-link" tabIndex={0}>
          Skip to main content
        </a>

        <ThemeProvider>
          {/* Live region for screen reader announcements */}
          <div
            id="aria-live-region"
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
            role="status"
          />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
