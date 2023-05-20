import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next';
const inter = Inter({ subsets: ['latin'] })
import Script from 'next/script';
import { PROD_URL } from './shared';

export const metadata: Metadata = {
  title: 'LangoBee',
  description: 'Master Japanese quickly and efficiently with our comprehensive learning tools.',
  alternates: {
    canonical: PROD_URL
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-RBFW56GGW2" strategy="worker" />
      <Script 
        id="google-analytics"
        dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RBFW56GGW2');
        `,
        }}
      >
        {``}
      </Script>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
