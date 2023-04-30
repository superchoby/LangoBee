import { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/main.css';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <title>LangoBee - the Best Way to Learn Japanese</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default MyApp;
