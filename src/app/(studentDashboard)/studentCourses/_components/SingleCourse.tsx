import Link from 'next/link';
import React from 'react';

import { Progress } from '@/components/ui/progress';

const SingleCourse = ({ item }: any) => {
  console.log({ item }, item.image);
  return (
    <div className="bg-gray-200 rounded-sm p-4 col-span-1 cursor-pointer updateUserCourse/Progress">
      <Link href={`/studentCourses/${item.id}`}>
        <img
          src="https://i.postimg.cc/3rLTwmM0/nebosh.jpg"
          alt="course"
          className="rounded-sm w-64 h-64 mb-3"
        />
        <div className="flex justify-between items-center mb-4">
          <p>23 Lesson</p>
          <p>1 hr 30 min</p>
        </div>
        <p className="font-bold text-lg">{item.title}</p>

        <hr className="h-px my-4 bg-gray-900 border-0 dark:bg-gray-700" />
        <div className="flex items-center justify-between mb-4">
          <p>{item?.description}</p>
          {/* <div className="flex items-center gap-2">
            <img
              src="https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg"
              className="w-8 rounded-full"
              alt=""
            />
            <span className="font-bold text-sm">Tayyab Shah</span>
          </div>
          <div className="flex gap-0">
            <Icons iconName="star" className="w-6 h-6 cursor-pointer text-accent" />
            <Icons iconName="star" className="w-6 h-6 cursor-pointer text-accent" />
            <Icons iconName="star" className="w-6 h-6 cursor-pointer text-yellow-500" />
            <Icons iconName="star" className="w-6 h-6 cursor-pointer text-yellow-500" />
            <Icons iconName="star" className="w-6 h-6 cursor-pointer text-yellow-500" />
          </div> */}
        </div>
        <div className="flex items-center gap-1">
          <Progress value={33} />
          (33%)
        </div>
      </Link>
    </div>
  );
};

export default SingleCourse;
