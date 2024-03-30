import { useAtom } from 'jotai';
import React from 'react';

import { selectedAnswerAtom } from '@/store/course';

const SingleQuestion = ({ item }: any) => {
  const [selectedAnswer, setSelectedAnswer] = useAtom(selectedAnswerAtom);
  return (
    <div
      className={`border rounded-md border-gray-200 p-2 hover:bg-primary duration-150 transition hover:text-white mb-2 cursor-pointer ${
        selectedAnswer === item ? 'bg-primary text-white' : ''
      }`}
      role="presentation"
      onClick={() => {
        setSelectedAnswer(item);
      }}
    >
      {item}
    </div>
  );
};

export default SingleQuestion;
