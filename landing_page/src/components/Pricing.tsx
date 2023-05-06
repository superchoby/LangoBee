import React, { useEffect, useState } from 'react';

import axios from 'axios';

import config from '../config/index.json';

interface PricingOptionProps {
  name: 'Monthly' | 'Annual' | 'Lifetime';
  cost: string;
  description: string;
  price_message?: string;
  price_id: string;
}

const PricingOption = ({
  name,
  cost,
  description,
  price_message,
}: // price_id,
PricingOptionProps) => {
  let buttonClassName =
    'text-background text-lg  cursor-pointer hover:bg-blue-700 hover:text-white leading-4 font-bold py-4 px-8 rounded-md h-12';
  buttonClassName += ` ${
    name === 'Lifetime'
      ? 'bg-primary text-white'
      : 'text-black border-2 border-neutral-500'
  }`;

  return (
    <div
      className={`flex justify-around flex-col h-96 lg:w-72 lg:h-94 xl:h-110 xl:w-102 bg-background wjustify-around items-center text-gray-600 overflow-hidden shadow-lg py-10 px-6 my-4 border-primary rounded-xl relative`}
    >
      {price_message != null && (
        <div className="absolute lg:text-lg top-2 bg-primary px-3 py-0.5 text-white rounded-lg">
          {price_message}!
        </div>
      )}

      <div className="flex flex-col">
        <span className={`text-3xl font-bold text-center`}>{name}</span>

        <span className={`text-2xl text-gray-600 font-bold text-center`}>
          {cost}
        </span>
      </div>
      <p className="text-center">{description}</p>
      <button className={buttonClassName}>Continue</button>
    </div>
  );
};

const Pricing = () => {
  const { pricing } = config;
  const { title } = pricing;
  // const [firstPlan, secondPlan, thirdPlan] = items;
  const [subscriptionPrices, changeSubscriptionPrices] = useState<
    {
      name: 'Monthly' | 'Annual' | 'Lifetime';
      cost: string;
      description: string;
      price_message?: string;
      price_id: string;
    }[]
  >([]);

  useEffect(() => {
    const domain =
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://127.0.0.1:8000/'
        : 'https://langobee-server.herokuapp.com/';
    axios
      .get(`${domain}subscriptions/view_prices_nonauthenticated/`)
      .then((res) => {
        const { lifetime, monthly, annual } = JSON.parse(res.data);

        changeSubscriptionPrices([lifetime, annual, monthly]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          className={`flex w-80 mx-auto flex-col sm:justify-around lg:flex-row-reverse lg:w-11/12 justify-center pt-12 my-12 sm:my-4 xl:w-3/4 2xl:w-5/8`}
        >
          {subscriptionPrices.map((props) => (
            <PricingOption key={props.name} {...props} />
          ))}
          {/* <PricingOption plan={thirdPlan!} />
          <PricingOption plan={secondPlan!} />
          <PricingOption plan={firstPlan!} /> */}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
