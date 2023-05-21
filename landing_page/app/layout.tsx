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
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-RBFW56GGW2" strategy="afterInteractive" />
      <Script 
        id="google-analytics"
        strategy="afterInteractive"
      >
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RBFW56GGW2');
        `}
      </Script>
      <Script id='hotjoar' strategy='afterInteractive'>
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3501001,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
