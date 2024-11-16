import React from 'react';

import { cn } from '@/utils/utils';

const PublicHeading = ({
  backGroundHeading = '',
  mainHeading = 'Heading',
  bgHeadingClasses,
  mainHeadingClasses,
  containerClasses,
}: any) => {
  return (
    <div className={cn(`relative  text-center `, containerClasses)}>
      <h1
        className={cn(
          `absolute text-center left-0 right-0 bottom-0 m-0 opacity-5 text-[60px] select-none font-bold`,
          bgHeadingClasses,
        )}
      >
        {backGroundHeading}
      </h1>
      <h2
        className={cn(
          `relative inline-block mb-8 text-3xl text-publicBlue font-semibold head-after`,
          mainHeadingClasses,
        )}
      >
        {mainHeading}
      </h2>
    </div>
  );
};

export default PublicHeading;
