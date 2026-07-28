import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/lib/theme-provider';
import { I18nProvider } from '@/lib/i18n';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/error-boundary';
import { OfflineBanner } from '@/components/offline-banner';
import { WebVitals } from '@/components/web-vitals';

export const metadata: Metadata = {
  title: 'LaVida Health Buddy',
  description: 'AI-powered symptom checker for quick health insights.',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'LaVida Health Buddy',
    description: 'AI-powered symptom checker for quick health insights.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen" suppressHydrationWarning>
        <WebVitals />
        <OfflineBanner />
        <ThemeProvider>
          <I18nProvider>
            <FirebaseClientProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <Toaster />
            </FirebaseClientProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
