import { Metadata } from 'next';
import { Toaster } from 'sonner';
import { auth } from '@/app/(auth)/auth';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/custom/theme-provider';
import { ModalProvider } from '@/components/context/modal-context';
import { SubscriptionModal } from '@/components/custom/subscription-modal';
import './globals.css';
import { type User } from 'next-auth';

export const metadata: Metadata = {
  metadataBase: new URL('https://advancers.ai'),
  title: 'Nova | Advancers AI',
  description: 'AI that helps you be most useful for civilization',
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>
            <Toaster position="top-center" />
            <SessionProvider>
              {children}
              {session?.user && <SubscriptionModal user={session.user as User} />}  
            </SessionProvider>
          </ModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
