import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CompareProvider } from '@/contexts/CompareContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Property App',
  description: 'Find and compare properties',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <CompareProvider>
            <FavoritesProvider>
              {children}
            </FavoritesProvider>
          </CompareProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
