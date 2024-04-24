'use client';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useApiGet } from '@/lib/dashboard/client/user';

import { ModulesDataResponse } from '../page';

export type Chapter = {
  title: string;
  description: string;
  timestamp: string;
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type ChaptersDataResponse = {
  message: string;
  statusCode: number;
  data: Chapter[];
};
const CourseContent = () => {
  const params = useParams();
  const { courseId } = params;
  const { data: modulesData, isLoading: isModuleLoading } = useApiGet<ModulesDataResponse, Error>({
    endpoint: `/courses/allModules/${courseId}`,
    queryKey: ['get-modules', courseId],
  });

  const [moduleId, setModuleId] = React.useState<string>();

  const search = useSearchParams();
  const percentage: any = (search as any).get(['percentage']);
  const title: any = (search as any).get(['title']);

  console.log({ percentage, title });

  const renderChaptersList = (chapters: any) => {
    console.log({ chapters });
    return chapters?.map((item: any, index: number, arr: any) => {
      console.log('chapter item', arr[index + 1]);
      return (
        <Link
          className="text-black"
          key={index}
          href={{
            pathname: `/studentCourse/${courseId}/${item.id}`,
            query: {
              chapterName: item.title,
              courseId,
              moduleId,
            },
          }}
        >
          <li className="text-black">{item.title}</li>
        </Link>
      );
    });
  };
  const { data: chaptersData, isLoading } = useApiGet<ChaptersDataResponse, Error>({
    endpoint: `/courses/module/allChapters/${moduleId}`,
    queryKey: ['get-chapters', moduleId],
    config: {
      enabled: !!moduleId,
    },
  });

  console.log({ moduleId, chaptersData });

  const setAccordionValue = (e: string) => {
    setModuleId(e);
  };

  return (
    <div className="p-4 font-sans rounded-xl border bg-white">
      {isModuleLoading ? (
        'loading'
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-primary text-xl font-bold mb-3">Content</h1>
            <p className="text-base font-bold">{modulesData?.data?.length} Units</p>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={moduleId}
            onValueChange={(e) => setAccordionValue(e)}
          >
            {modulesData?.data?.map((item: any) => {
              return (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.title}</AccordionTrigger>
                  <AccordionContent>
                    {/* <ul className="list-disc">{renderChaptersList(item.chapters)}</ul> */}
                    {isLoading ? 'loading' : renderChaptersList(chaptersData?.data)}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </>
      )}
    </div>
  );
};

export default CourseContent;
