import React from 'react';
import Image from 'next/image'
import config from './index.json';

const Features = () => {
  const { features } = config;
  const { title, subtitle, description } = features;

  const featuresList = [
    {
      "name": "Efficient Learning",
      "description": "Scientifically proven methods to ensure that concepts you learn stay in your long term memory",
      "icon": require("./images/brain.png")
    },
    {
      "name": "Graded Readers",
      "description": "At anytime have access to multitudes of resources to read suited perfectly for your level with in depth explanations in all of them.",
      "icon": require("./images/book.png")
    },
    {
      "name": "Listening",
      "description": "Be able to work on your listening skills at anytime. Take quizzes to see how well you understood it.",
      "icon": require("./images/audio-book.png")
    },
    {
      "name": "Speaking",
      "description": "Resources to help you practice your pronunciation with native audio and speaking skills",
      "icon": require("./images/speaking.png")
    }
  ]

  return (
    <div className={`py-12 bg-background`} id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2
            className={`text-base text-primary font-semibold tracking-wide uppercase`}
          >
            {title}
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {subtitle}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            {description}
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {featuresList.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div
                    className={`absolute flex items-center justify-center h-12 w-12 rounded-md bg-background text-tertiary border-primary border-4`}
                  >
                    <Image
                      className={`inline-block h-6 w-6 rounded-full`}
                      src={feature.icon}
                      alt={feature.name}
                      height={24}
                      width={24}
                    />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
