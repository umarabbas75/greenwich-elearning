'use client';
import { Tabs } from '@radix-ui/react-tabs';
import React, { useState } from 'react';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import Assessment from './_components/Assessment';
import CourseContent from './_components/CourseContent';
import CourseOverview from './_components/CourseOverview';
import Grades from './_components/Grades';
import Resources from './_components/Resources';
import Syllabus from './_components/Syllabus';

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
  const [type, setType] = useState('content');

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
        <TabsList className="grid  grid-cols-6 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assessment">Assessment</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        {type == 'content' && <CourseContent />}
        {type === 'overview' && <CourseOverview />}
        {type === 'grades' && <Grades />}
        {type == 'assessment' && <Assessment />}
        {type == 'resources' && <Resources />}
        {type == 'syllabus' && <Syllabus />}
      </Tabs>
    </div>
  );
};

export default Page;
