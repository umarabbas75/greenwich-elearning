'use client';
import { FolderClosed, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

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
const CourseContent = () => {
  const params = useParams();
  const { courseId } = params;
  const [openAccordions, setOpenAccordions] = useState<any>([]);
  const { data: modulesData, isLoading: isModuleLoading } = useApiGet<any, Error>({
    endpoint: `/courses/user/allModules/${courseId}`,
    queryKey: ['get-modules', courseId],
    config: {
      select: (res) => res?.data?.data,
      onSuccess: (res: any) => {
        setOpenAccordions(res.map((_: any, index: any) => index)); // Initially open all accordions
      },
    },
  });

  const toggleAccordion = (index: any) => {
    if (openAccordions.includes(index)) {
      setOpenAccordions(openAccordions.filter((item: any) => item !== index));
    } else {
      setOpenAccordions([...openAccordions, index]);
    }
  };
  console.log({ openAccordions });
  if (isModuleLoading) {
    return 'loading....';
  }

  return (
    <div className="p-4 font-sans rounded-xl border bg-white">
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-xl font-bold mb-3">Content</h1>
          <p className="text-base font-bold">{modulesData?.length} Units</p>
        </div>

        <div className="w-full">
          {modulesData?.map((item: any, index: any) => (
            <Accordion key={item.id} type="multiple">
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger
                  onClick={() => toggleAccordion(index)}
                  className="flex items-center justify-between px-4 py-3 bg-themeGreen shadow-md cursor-pointer"
                >
                  <span className="font-medium uppercase text-white">{item.title}</span>
                  {!openAccordions.includes(index) ? (
                    <FolderClosed className="w-6 h-6 text-white" />
                  ) : (
                    <FolderOpen className="w-6 h-6 text-white" />
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="divide-y divide-gray-200">
                    {item.chapters.map((chapter: any) => (
                      <Link
                        className="text-black"
                        key={index}
                        href={{
                          pathname: `/studentCourse/${courseId}/${chapter.id}`,
                          query: {
                            chapterName: chapter.title,
                            courseId,
                            moduleId: item?.id,
                          },
                        }}
                      >
                        <li key={chapter.id} className="p-4 cursor-pointer hover:bg-gray-100">
                          <h3 className="uppercase font-semibold">{chapter.title}</h3>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </>
    </div>
  );
};

export default CourseContent;
