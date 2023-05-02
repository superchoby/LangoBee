import React from 'react';

import config from '../config/index.json';

interface PricingOptionProps {
  plan: {
    name: string;
    price: string;
    priceDetails: string;
    features: string[];
    priceMessage?: string;
  };
}

const PricingOption = ({ plan }: PricingOptionProps) => {
  let buttonClassName =
    'text-background text-lg  cursor-pointer hover:bg-blue-700 hover:text-white leading-4 font-bold py-4 px-8 rounded-md h-12';
  buttonClassName += ` ${
    plan.name === 'Lifetime'
      ? 'bg-primary text-white'
      : 'text-black border-2 border-neutral-500'
  }`;

  return (
    <div
      className={`flex justify-around sm:flex-col sm:w-44 md:w-56 sm:h-64 md:h-80 lg:w-72 lg:h-94 xl:h-110 xl:w-102 bg-background wjustify-around items-center text-gray-600 overflow-hidden shadow-lg py-10 my-4 border-primary rounded-xl relative`}
    >
      {plan.priceMessage != null && (
        <div className="absolute lg:text-lg top-2 bg-primary px-3 py-0.5 text-white rounded-lg">
          {plan.priceMessage}!
        </div>
      )}
      <div className="flex flex-col">
        <span className={`text-3xl font-bold text-center`}>{plan.name}</span>

        <span className={`text-2xl text-gray-600 font-bold text-center`}>
          {plan.price}
        </span>
      </div>

      <button className={buttonClassName}>Continue</button>
    </div>
  );
};

const Pricing = () => {
  const { pricing } = config;
  const { items, title } = pricing;
  const [firstPlan, secondPlan, thirdPlan] = items;

  return (
    <section className={`bg-background py-8`} id="pricing">
      <div className={`container mx-auto px-2 pt-4 pb-12 text-primary`}>
        <h1
          className={`w-full my-2 text-5xl font-bold leading-tight text-center text-primary`}
        >
          {title}
        </h1>
        <div className={`w-full mb-4`}>
          <div
            className={`h-1 mx-auto bg-primary w-64 opacity-25 my-0 py-0 rounded-t`}
          ></div>
        </div>
        <div
          className={`flex w-80 mx-auto flex-col sm:flex-row-reverse sm:justify-around sm:w-full justify-center pt-12 my-12 sm:my-4 xl:w-3/4 2xl:w-5/8`}
        >
          <PricingOption plan={thirdPlan!} />
          <PricingOption plan={secondPlan!} />
          <PricingOption plan={firstPlan!} />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
