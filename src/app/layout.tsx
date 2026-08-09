import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'MediLens AI | AI Medical Image Analysis & Health Intelligence',
  description: 'Next-generation medical imaging AI platform. Advanced deep learning diagnostics, explainable Grad-CAM heatmaps, automated radiologist reports, and clinical decision support.',
  keywords: ['Medical AI', 'Radiology', 'X-Ray AI', 'MRI Analysis', 'Explainable AI', 'Healthcare SaaS'],
  authors: [{ name: 'MediLens AI Team' }],
  openGraph: {
    title: 'MediLens AI - Medical Image Analysis & Intelligence',
    description: 'Empowering healthcare professionals with explainable AI diagnostic intelligence.',
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
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-200 min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
