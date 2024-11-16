import React from 'react';

import { Icons } from '@/utils/icon';

const StatisticsCounter = () => {
  return (
    <div
      className="!bg-cover !bg-no-repeat !bg-fixed relative py-20 "
      style={{ background: `url('/assets/images/statistice-counter-bg.jpg')` }}
    >
      <div className="absolute top-0 left-0 right-0 bottom-0 opacity-70 bg-gray-400"></div>
      <div className="container px-48">
        <div className="relative">
          <div className="grid grid-cols-3 gap-20">
            <div className="col-span-1">
              <div className="flex justify-between items-center">
                <Icons iconName="thumbsUp" className="h-16 w-16 fill-white" />

                <div className="flex flex-col justify-end items-end">
                  <h2 className="text-white text-2xl text-end">8+</h2>
                  <h5 className="text-white text-base uppercase text-end">Years Experience</h5>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex justify-between items-center">
                <Icons iconName="people" className="h-20 w-20 fill-white" />

                <div className="flex flex-col justify-end items-end">
                  <h2 className="text-white text-2xl text-end">8000</h2>
                  <h5 className="text-white text-base uppercase text-end">Happy students</h5>
                </div>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex justify-between items-center">
                <Icons iconName="trophy" className="h-16 w-16 fill-white" />

                <div className="flex flex-col justify-end items-end">
                  <h2 className="text-white text-2xl">20+</h2>
                  <h5 className="text-white text-base uppercase text-end">
                    National and international clients
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCounter;
