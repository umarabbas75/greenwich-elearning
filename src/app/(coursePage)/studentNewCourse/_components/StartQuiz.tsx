import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';

const StartQuiz = () => {
  const params = useParams();

  const courseId = params.slug?.[0] || '';
  const chapterId = params.slug?.[1] || '';
  const moduleId = params.slug?.[2] || '';
  const router = useRouter();
  return (
    <div>
      <Button
        variant="public-primary"
        onClick={() => {
          router.replace(`/studentNewCourse/quiz/${courseId}/${chapterId}/${moduleId}`);
        }}
      >
        Start Quiz
      </Button>
    </div>
  );
};

export default StartQuiz;
