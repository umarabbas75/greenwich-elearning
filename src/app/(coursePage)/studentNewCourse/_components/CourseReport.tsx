import { Check } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

import StartQuiz from './StartQuiz';

const CourseReport = ({ setShowCourseReport, containQuizzes }: any) => {
  // const router = useRouter();

  return (
    <div className="h-full bg-gradient-to-b from-themeGreen to-primary flex flex-col justify-center items-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl text-green-500 mb-6 text-center flex justify-center">
          <Check className="w-20 h-20" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h1>
        <p className="text-lg text-gray-700 mb-6">{`You've reached the end of the lesson.`}</p>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => {
              setShowCourseReport((prev: any) => !prev);
            }}
          >
            Back
          </Button>

          {containQuizzes && <StartQuiz />}
        </div>
      </div>
    </div>
  );
};

export default CourseReport;
