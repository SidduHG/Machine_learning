import type { Metadata } from 'next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { StudyAssistant } from '@/components/study-assistant';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'ML Atlas — Learn machine learning by doing',
    template: '%s | ML Atlas',
  },
  description:
    'An open machine learning school. Explore original lessons, worked math, interactive 3D algorithm labs, and practical AI engineering projects.',
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
      </body>
    </html>
  );
}
