import React from 'react';
import Image from 'next/image'
// import config from './index.json';
import mainHeroImage from './images/textBubbles.png'

const MainHeroImage = () => {
  // const { mainHero } = config;
  return (
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 ">
      <Image
        className="h-96 object-cover sm:h-72 md:h-96 lg:h-full"
        src={mainHeroImage}
        alt="happy team image"
      />
    </div>
  );
};

export default MainHeroImage;
