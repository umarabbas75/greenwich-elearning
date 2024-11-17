import { useAtom } from 'jotai';
import React from 'react';

import { selectedAnswerAtom } from '@/store/course';

const Question = ({ questionData }: any) => {
  const [selectedAnswer, setSelectedAnswer] = useAtom(selectedAnswerAtom);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">{questionData?.question}</h1>

      <small>Choose only ONE best answer.</small>
      <div className="grid gap-4 mt-2">
        {questionData?.options?.map((item: any, index: any) => {
          const isSelected = selectedAnswer === item;
          return (
            <div
              key={index}
              className={`flex items-center md:w-1/2 justify-between rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-themeGreen to-primary text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => {
                setSelectedAnswer(item);
              }}
            >
              <div className="px-4 py-3">
                <span className={`text-lg ${isSelected ? 'font-semibold' : ''}`}>{item}</span>
              </div>
              {isSelected && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Question;
