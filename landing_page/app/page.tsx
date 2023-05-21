'use client'

import About from './(root)/About';
import Analytics from './(root)/Analytics';
import Canvas from './(root)/Canvas';
import Contact from './(root)/Contact';
import Features from './(root)/Features';
import Header from './(root)/Header';
import LazyShow from './(root)/LazyShow';
import MainHero from './(root)/MainHero';
import MainHeroImage from './(root)/MainHeroImage';
import Pricing from './(root)/Pricing';
import Product from './(root)/Product';
import { useEffect, useState } from 'react';
import { isInDevelopmentEnv } from './shared';

export default function Home() {
  const [checkedForToken, changeCheckedForToken] = useState(isInDevelopmentEnv)

  useEffect(() => {
    if (typeof window !== 'undefined' && !isInDevelopmentEnv && !checkedForToken) {
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
          localStorage.clear();
        }
      } else {
        changeCheckedForToken(true)
      }
    }
  }, [checkedForToken])
  
  return checkedForToken ? (
    <div
      className={`bg-background grid gap-y-16 overflow-hidden`}
      // style={{ display: checkedForToken ? 'block' : 'none' }}
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
  ) : <></>
}
