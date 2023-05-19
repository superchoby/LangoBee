import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next';
const inter = Inter({ subsets: ['latin'] })
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'LangoBee',
  description: 'Learn Japanese FAST',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-RBFW56GGW2" strategy="worker" />
      <Script id="show-banner">
        {`window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-RBFW56GGW2');`}
      </Script>

{/* 
<!-- Google tag (gtag.js) -->
<script async src=""></script>
<script>
  
</script> */}


      <body className={inter.className}>{children}</body>
    </html>
  )
}
