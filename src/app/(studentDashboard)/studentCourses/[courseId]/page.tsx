'use client';
import { Tabs } from '@radix-ui/react-tabs';
import React, { useState } from 'react';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import CourseContent from './_components/CourseContent';
import Grades from './_components/Grades';

export type Module = {
  title: string;
  description: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ModulesDataResponse = {
  message: string;
  statusCode: number;
  data: Module[];
};
const Page = () => {
  const [type, setType] = useState('grades');

  return (
    <div className="flex flex-col gap-8 w-full">
      <Tabs
        defaultValue={type}
        className="w-full"
        onValueChange={(route) => {
          //router.push(`/studentCourses?type=${route}`);
          setType(route);
        }}
      >
        <TabsList className="grid w-[600px] grid-cols-4 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        {type == 'content' && <CourseContent />}
        {type === 'overview' && <CourseOverview />}
        {type === 'grades' && <Grades />}
      </Tabs>
    </div>
  );
};

export default Page;

const CourseOverview = () => {
  return (
    <div className=" p-4 rounded-xl border bg-white">
      <h1 className="text-primary text-xl font-bold mb-3">Overview</h1>

      <h1 className="text-base font-bold mb-2">Course Description</h1>

      <div className="text-sm mb-8">
        <p>
          {`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
          industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
          leap into electronic typesetting, remaining essentially unchanged.`}
        </p>

        <p>
          It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
          and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem
          Ipsum.
        </p>
      </div>

      <h2 className="text-base font-bold mb-2">What you will learn</h2>

      <ul className="list-disc pl-3 grid grid-cols-2">
        {[
          'Become a UX designer.',
          'Add UX designer to your CV.',
          'Become a UI designer.',
          'Build & test a full website design.',
          'Build & test a full mobile app.',
          'Learn to design websites & mobile phone apps.',
          'Learn how to choose colors.',
          'Prototype your designs with interactions.',
          'Export production-ready assets.',
          'All the techniques used by UX professionals',
        ].map((item, index) => (
          <li key={index} className="mb-1">
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h2 className="text-base font-bold mb-2">Requirements</h2>

        <ul className="list-none">
          {[
            'You will need a copy of Adobe XD 2019 or above. A free trial can be downloaded from Adobe.',
            'No previous design experience is needed.',
            'No previous Adobe XD skills are needed.',
          ].map((item, index) => (
            <li key={index} className="mb-1 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
