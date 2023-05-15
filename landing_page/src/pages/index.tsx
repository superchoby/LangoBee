import React, { useEffect, useState } from 'react';

import About from '../components/About';
import Analytics from '../components/Analytics';
import Canvas from '../components/Canvas';
import Contact from '../components/Contact';
import Features from '../components/Features';
import Header from '../components/Header';
import LazyShow from '../components/LazyShow';
import MainHero from '../components/MainHero';
import MainHeroImage from '../components/MainHeroImage';
import Pricing from '../components/Pricing';
import Product from '../components/Product';

const inDevMode =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const App = () => {
  const [checkedForToken, changeCheckedForToken] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !checkedForToken && !inDevMode) {
      const reduxPersistLocalStorage = localStorage.getItem('persist:root');
      if (reduxPersistLocalStorage != null) {
        const tokenInfo = JSON.parse(
          JSON.parse(reduxPersistLocalStorage).token
        );
        const { access } = tokenInfo as {
          access: string;
          refresh: string;
        };
        if (access != null && access.length > 0) {
          window.location.href = '/home';
        } else {
          changeCheckedForToken(true);
          localStorage.clear();
        }
      } else {
        changeCheckedForToken(true);
      }
    } else {
      changeCheckedForToken(true);
    }
  }, [checkedForToken]);

  return (
    <div
      className={`bg-background grid gap-y-16 overflow-hidden`}
      style={{ display: checkedForToken ? 'block' : 'none' }}
    >
      <div className={`relative bg-background`}>
        <div className="max-w-7xl mx-auto">
          <div
            className={`relative z-10 pb-8 bg-background sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32`}
          >
            <Header />
            <MainHero />
          </div>
        </div>
        <MainHeroImage />
      </div>
      <Canvas />
      <LazyShow>
        <>
          <Product />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          <Features />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          <Pricing />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          <Contact />
          <Canvas />
        </>
      </LazyShow>
      <LazyShow>
        <>
          {/* <Canvas /> */}
          <About />
        </>
      </LazyShow>
      <Analytics />
    </div>
  );
};

export default App;
