import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { StudyAssistant } from '@/components/study-assistant';
import { StudyActions } from '@/components/study-actions';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'ML Atlas — Learn machine learning by doing',
    template: '%s | ML Atlas',
  },
  description:
    'A structured classical machine learning course with detailed theory, worked mathematics, Python implementations, interactive algorithm labs and a 30-question assessment.',
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <StudyAssistant />
        <StudyActions />
      </body>
    </html>
  );
}
