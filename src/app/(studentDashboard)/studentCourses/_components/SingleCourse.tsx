import Link from 'next/link';
import React from 'react';

import { Progress } from '@/components/ui/progress';

const SingleCourse = ({ item }: any) => {
  console.log({ item });
  return (
    <div className="bg-gray-200 rounded-sm p-4 col-span-1 cursor-pointer updateUserCourse/Progress">
      <Link
        href={{
          pathname: `/studentCourses/${item.id}`,
          query: { percentage: item.percentage, id: item.id, title: item.title },
        }}
      >
        <img src={item?.image} alt="course" className="rounded-sm w-64 h-64 mb-3 object-cover" />
        <div className="flex justify-between items-center mb-4">
          <p>{item?.totalSections} Lessons</p>
          <p>{item?.duration}</p>
        </div>
        <p className="font-bold text-lg">{item.title}</p>

        <hr className="h-px my-4 bg-gray-900 border-0 dark:bg-gray-700" />
        <div className="flex items-center justify-between mb-4">
          <p>{item?.description}</p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <Progress value={item.percentage} className="h-2" />
          <div className="mt-0 text-sm flex gap-1 items-center">
            <span className="font-semibold">{parseInt(item.percentage)}%</span>
            <span>complete</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SingleCourse;
