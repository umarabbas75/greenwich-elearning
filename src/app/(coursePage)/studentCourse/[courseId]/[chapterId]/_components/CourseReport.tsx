import { Check } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

import { ChaptersDataResponse } from '@/app/(dashboard)/course/[courseId]/[moduleId]/page';
import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';

const CourseReport = () => {
  const router = useRouter();
  const params = useParams();
  const { courseId, chapterId } = params;
  const search = useSearchParams();
  const [nextElement, setNextElement] = useState<any>();

  const moduleId = search.get('moduleId');

  useApiGet<ChaptersDataResponse, Error>({
    endpoint: `/courses/module/allChapters/${moduleId}`,
    queryKey: ['get-chapters', moduleId],
    config: {
      enabled: !!moduleId,
      onSuccess: (res) => {
        const elements = res?.data;
        elements.forEach((item, index) => {
          if (item.id === chapterId) {
            setNextElement(elements?.[index + 1]);
          }
        });
      },
    },
  });
  return (
    <div className="h-full bg-gradient-to-b from-themeGreen to-primary flex flex-col justify-center items-center">
      <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="text-6xl text-green-500 mb-6 text-center flex justify-center">
          <Check className="w-20 h-20" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h1>
        <p className="text-lg text-gray-700 mb-6">{`You've reached the end of the lesson.`}</p>
      </div>
      <Link
        href={{
          pathname: `/studentCourse/${courseId}/${nextElement?.id}`,
          query: {
            chapterName: nextElement?.title,
            courseId,
            moduleId,
          },
        }}
      >
        <Button
          variant="secondary"
          onClick={() => {
            router.push(`/studentCourse/${courseId}/${nextElement?.id}`);
          }}
          className="mt-4"
        >
          Go to {nextElement?.title ?? 'next element'}
        </Button>
      </Link>
    </div>
  );
};

export default CourseReport;
