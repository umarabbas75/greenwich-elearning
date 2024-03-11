import React from 'react';

import SingleCourse from './SingleCourse';

const ActiveCourses = ({ assignedCourses }: any) => {
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {assignedCourses?.data?.map((item: any) => {
        console.log('my item', item);
        return <SingleCourse key={item.id} item={item} />;
      })}
    </div>
  );
};

export default ActiveCourses;
