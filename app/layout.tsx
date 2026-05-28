import type { Metadata } from 'next';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileNav from '@/components/layout/mobile-nav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const bricolage = Bricolage_Grotesque({ 
  subsets: ['latin'], 
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'FinCalc - 140+ Free Financial Calculators for Indian Investors',
  description: 'SIP, EMI, F&O Tax, Income Tax, Investment calculators. Built for Indian traders & investors. No signup. No fees.',
  keywords: 'SIP calculator, EMI calculator, income tax, F&O tax, investment calculator, Indian rupee',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${bricolage.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
