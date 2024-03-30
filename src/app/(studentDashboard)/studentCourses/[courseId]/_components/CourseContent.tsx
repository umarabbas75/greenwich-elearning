import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useApiGet } from '@/lib/dashboard/client/user';

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
const CourseContent = ({ modulesData }: any) => {
  const [moduleId, setModuleId] = React.useState<string>();

  const { courseId } = useParams();
  const renderChaptersList = (chapters: any) => {
    console.log({ chapters });
    return chapters?.map((item: any, index: number) => {
      console.log('chapter item', item);
      return (
        <Link
          className="text-black"
          key={index}
          href={{ pathname: `/studentCourses/${courseId}/${item.id}`, query: { chapterName: item.title } }}
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
      <div className="flex items-center justify-between">
        <h1 className="text-primary text-xl font-bold mb-3">Overview</h1>
        <p className="text-base font-bold">92 Lectures</p>
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
    </div>
  );
};

export default CourseContent;
