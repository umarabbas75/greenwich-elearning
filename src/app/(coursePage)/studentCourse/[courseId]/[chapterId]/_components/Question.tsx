import React from 'react';

import SingleQuestion from './SingleQuestion';

const Question = ({ questionData }: any) => {
  console.log({ questionData });
  return (
    <div className="mt-12">
      <h1 className="text-xl ">{questionData.question}</h1>

      <div className="mt-3">
        {questionData?.options?.map((item: any) => {
          return <SingleQuestion key={item} item={item} />;
        })}
      </div>
    </div>
  );
};

export default Question;
