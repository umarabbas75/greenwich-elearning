import React from 'react';
import Skeleton from 'react-loading-skeleton';

const GraphSkeletonLoader = () => {
  const numberOfBars = 5; // Number of bars you want to show in the skeleton loader
  return (
    <div className="w-full h-48 flex flex-col items-center">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <Skeleton width="80%" height={20} style={{ marginBottom: 10 }} />
        <div className="w-full h-48 flex flex-row justify-around items-end">
          {Array.from({ length: numberOfBars }).map((_, index) => (
            <Skeleton
              key={index}
              width={20}
              height={Math.random() * 150 + 50} // Random height for each bar
              style={{ margin: '0 5px' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphSkeletonLoader;
