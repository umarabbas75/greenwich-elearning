import React from 'react';

import SingleCourse from './SingleCourse';

const ActiveCourses = () => {
  const courses = [
    {
      image:
        'https://www.abacus-int.com/wp-content/uploads/2021/10/Choose-NEBOSH-IGC-in-Pakistan-for-a-better-job-1920x1278.jpg',
      totalSections: 120,
      totalTime: '1hr 30m',
      title: 'Foundation course  about softwere',
      instructor: 'Micle Jhon',
      rating: '5',
      completed: '10',
      id: 1,
    },
    {
      image:
        'https://www.abacus-int.com/wp-content/uploads/2021/10/Choose-NEBOSH-IGC-in-Pakistan-for-a-better-job-1920x1278.jpg',
      totalSections: 120,
      totalTime: '1hr 30m',
      title: 'Nidnies course to under stand about softwere',
      instructor: 'Micle Jhon',
      rating: '5',
      completed: '20',
      id: 2,
    },
  ];
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {courses.map((item: any) => {
        return <SingleCourse key={item.id} item={item} />;
      })}
    </div>
  );
};

export default ActiveCourses;
