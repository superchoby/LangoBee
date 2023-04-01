import { useEffect } from 'react';

import { AppProps } from 'next/app';
import ReactGA from 'react-ga';

import '../styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const setGA = () => {
    ReactGA.initialize('G-9EB5NQ3XVV');
    ReactGA.pageview(window.location.pathname);
  };

  useEffect(() => {
    setGA();
  }, []);

  return <Component {...pageProps} />;
};

export default MyApp;
