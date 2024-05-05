'use client';
import { Tabs } from '@radix-ui/react-tabs';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApiGet } from '@/lib/dashboard/client/user';

import Assessment from './_components/Assessment';
import CourseContent from './_components/CourseContent';
import CourseOverview from './_components/CourseOverview';
import Grades from './_components/Grades';
import ModuleLoader from './_components/ModuleLoader';
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
  const [type, setType] = useState('overview');
  const params = useParams();
  const { courseId } = params;
  const [openAccordions, setOpenAccordions] = useState<any>([]);
  const [modulesRecord, setModulesRecord] = useState([]);
  const { isLoading: isModuleLoading, refetch } = useApiGet<any, Error>({
    endpoint: `/courses/user/allModules/${courseId}`,
    queryKey: ['get-modules', courseId],
    config: {
      select: (res) => res?.data?.data,
      onSuccess: (res: any) => {
        setOpenAccordions(res.map((_: any, index: any) => index)); // Initially open all accordions

        const modulesWithProgress = res?.map((module: any) => {
          const totalModuleSections = module?.chapters?.reduce(
            (total: any, chapter: any) => total + chapter?.sections?.length,
            0,
          );
          const completedModuleSections = module?.course?.UserCourseProgress?.filter(
            (progress: any) =>
              module?.chapters?.some(
                (chapter: any) =>
                  chapter?.sections?.some((section: any) => section?.id === progress?.sectionId),
              ),
          ).length;

          const moduleCompletedPercentage = (completedModuleSections / totalModuleSections) * 100;

          const chaptersWithProgress = module?.chapters?.map((chapter: any) => {
            const totalChapterSections = chapter?.sections?.length;
            const completedChapterSections = chapter?.sections?.filter(
              (section: any) =>
                module?.course?.UserCourseProgress?.some(
                  (progress: any) => progress?.sectionId === section?.id,
                ),
            ).length;

            const chapterCompletedPercentage = (completedChapterSections / totalChapterSections) * 100;

            return {
              ...chapter,
              completedPercentage: chapterCompletedPercentage.toFixed(2),
            };
          });

          return {
            ...module,
            completedPercentage: moduleCompletedPercentage.toFixed(2),
            chapters: chaptersWithProgress,
          };
        });
        setModulesRecord(modulesWithProgress);
        console.log({ modulesWithProgress });
      },
    },
  });

  const { data: courseData } = useApiGet<any, Error>({
    endpoint: `/courses/${courseId}`,
    queryKey: ['get-course-data', courseId],
    config: {
      select: (res) => res?.data?.data,
    },
  });
  console.log({ courseData });

  const toggleAccordion = (index: any) => {
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter((item: any) => item !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };
  if (isModuleLoading) {
    return <ModuleLoader />;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <Tabs
        defaultValue={type}
        className="w-full"
        onValueChange={(route) => {
          if (route === 'content') {
            refetch();
          }
          setType(route);
        }}
      >
        <TabsList className="flex flex-wrap h-20 md:h-auto md:grid  md:grid-cols-6 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          {(courseData?.assessment || courseData?.assessments?.length > 0) && (
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
          )}
          {(courseData?.resourcesOverview || courseData?.resources?.length > 0) && (
            <TabsTrigger value="resources">Resources</TabsTrigger>
          )}
          {(courseData?.syllabusOverview || courseData?.syllabus?.length > 0) && (
            <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          )}
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>
        <div className={`${type === 'content' ? 'block' : 'hidden'}`}>
          <CourseContent
            modulesRecord={modulesRecord}
            toggleAccordion={toggleAccordion}
            openAccordions={openAccordions}
            courseId={courseId}
          />
        </div>
        <div className={`${type === 'overview' ? 'block' : 'hidden'}`}>
          <CourseOverview courseOverview={courseData?.overview} />
        </div>{' '}
        <div className={`${type === 'grades' ? 'block' : 'hidden'}`}>
          <Grades type={type} />
        </div>{' '}
        {(courseData?.assessment || courseData?.assessments?.length > 0) && (
          <div className={`${type === 'assessment' ? 'block' : 'hidden'}`}>
            <Assessment assessmentOverview={courseData?.assessment} assessments={courseData?.assessments} />
          </div>
        )}
        {(courseData?.resourcesOverview || courseData?.resources?.length > 0) && (
          <div className={`${type === 'resources' ? 'block' : 'hidden'}`}>
            <Resources resourcesOverview={courseData?.resourcesOverview} resources={courseData?.resources} />
          </div>
        )}
        {(courseData?.syllabusOverview || courseData?.syllabus?.length > 0) && (
          <div className={`${type === 'syllabus' ? 'block' : 'hidden'}`}>
            <Syllabus syllabusOverview={courseData?.syllabusOverview} syllabus={courseData?.syllabus} />
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Page;
