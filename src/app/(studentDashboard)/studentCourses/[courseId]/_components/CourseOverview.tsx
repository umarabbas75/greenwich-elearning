import React from 'react';

const CourseOverview = ({ courseOverview }: any) => {
  return (
    <div className=" p-4 rounded-xl border bg-white dark:bg-black/80">
      <h1 className="text-primary text-xl font-bold mb-3">Overview</h1>

      <div
        className="text-[15px]"
        contentEditable="false"
        dangerouslySetInnerHTML={{ __html: courseOverview ?? '' }}
      ></div>
    </div>
  );
};

export default CourseOverview;
