import React from 'react';
import { CiLaptop } from 'react-icons/ci';
import { GiProgression } from 'react-icons/gi';
import { IoBulbOutline } from 'react-icons/io5';

import PublicHeading from '@/components/common/PublicHeading';
const WhatsIncluded = ({ title, totalElements }: any) => {
  return (
    <div className="container mt-20">
      <PublicHeading
        containerClasses="text-center"
        backGroundHeading="Excellent"
        mainHeading={`Whats included in ${title}?`}
        bgHeadingClasses="text-center"
        mainHeadingClasses="text-2xl"
      />

      <h3 className="text-gray-700 text-center text-base mb-2">Premium Course Language - English</h3>
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-1">
          <div className="flex justify-center text-publicRed">
            <CiLaptop className="h-20 w-20" />
          </div>
          <p className="font-semibold text-lg text-center">Master Training of {totalElements} Elements</p>
          <p className="text-base text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est magnam sed voluptatibus. Ullam error
            deserunt vel porro at in reprehenderit harum laborum, modi sapiente quod nobis atque minima quae
            nostrum sed amet ad nemo inventore quo corrupti nulla autem quibusdam?
          </p>
        </div>
        <div className="col-span-1">
          <div className="col-span-1">
            <div className="flex justify-center text-publicRed">
              <GiProgression className="h-20 w-20" />
            </div>
            <p className="font-semibold text-lg text-center">Course Progress tracking</p>
            <p className="text-base text-center">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est magnam sed voluptatibus. Ullam
              error deserunt vel porro at in reprehenderit harum laborum, modi sapiente quod nobis atque
              minima quae nostrum sed amet ad nemo inventore quo corrupti nulla autem quibusdam?
            </p>
          </div>
        </div>
        <div className="col-span-1">
          <div className="col-span-1">
            <div className="flex justify-center text-publicRed">
              <IoBulbOutline className="h-20 w-20" />
            </div>
            <p className="font-semibold text-lg text-center">Multiple MCQS in each lesson.</p>
            <p className="text-base text-center">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est magnam sed voluptatibus. Ullam
              error deserunt vel porro at in reprehenderit harum laborum, modi sapiente quod nobis atque
              minima quae nostrum sed amet ad nemo inventore quo corrupti nulla autem quibusdam?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsIncluded;
