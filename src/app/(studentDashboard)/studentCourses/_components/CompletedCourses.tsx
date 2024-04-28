import React from 'react';

import SingleCourse from './SingleCourse';

const CompletedCourses = ({ assignedCourses }: any) => {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {assignedCourses?.map((item: any) => {
        return <SingleCourse key={item.id} item={item} />;
      })}
    </div>
  );
};

export default CompletedCourses;
