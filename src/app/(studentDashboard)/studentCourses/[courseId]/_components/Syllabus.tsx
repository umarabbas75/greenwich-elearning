// Import file-saver to save files
import React from 'react';

import { extractFileType } from '@/utils/utils';

import FileCard from './FileCard';
const Syllabus = ({ syllabusOverview, syllabus }: any) => {
  return (
    <div className=" p-4 rounded-xl border bg-white dark:bg-black">
      <h1 className="text-primary text-xl font-bold mb-3">Syllabus</h1>
      <div
        className="text-[15px]"
        contentEditable="false"
        dangerouslySetInnerHTML={{ __html: syllabusOverview ?? '' }}
      ></div>
      <h1 className="text-primary text-xl font-bold mt-6 mb-3">Syllabus Files</h1>
      <div className="flex flex-wrap gap-2">
        {syllabus?.map((item: any) => {
          return (
            <FileCard
              key={item?.id}
              fileName={item?.name || 'Syllabus'}
              fileType={extractFileType(item?.file)?.toUpperCase()}
              file={item?.file}
              seen={false}
            />
          );
        })}{' '}
      </div>
    </div>
  );
};

export default Syllabus;
