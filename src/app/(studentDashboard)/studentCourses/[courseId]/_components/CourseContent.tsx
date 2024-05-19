'use client';
import { FolderClosed, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
const CourseContent = ({ modulesRecord, toggleAccordion, openAccordions, courseId }: any) => {
  return (
    <div className="p-4 font-sans rounded-xl border bg-white">
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-xl font-bold mb-3">Content</h1>
          <p className="text-base font-bold">{modulesRecord?.length} Units</p>
        </div>

        <div className="w-full">
          {modulesRecord?.map((item: any, index: any) => (
            <Accordion key={item.id} type="multiple">
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger
                  onClick={() => toggleAccordion(index)}
                  className="flex items-center justify-between px-4 py-3 bg-themeGreen shadow-md cursor-pointer rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12">
                      <CircularProgressbar
                        value={isNaN(item?.completedPercentage) ? 0 : +item?.completedPercentage}
                        styles={buildStyles({
                          pathColor: `#f88`,
                          trailColor: '#d6d6d6',
                          backgroundColor: '#3e98c7',
                        })}
                      />
                    </div>
                    <div className="flex flex-col gap-0 justify-start items-start">
                      <span className="font-medium uppercase text-white">{item.title}</span>
                      <small className="text-[#f88]">
                        {isNaN(item?.completedPercentage) ? 0 : +item?.completedPercentage}% completed
                      </small>
                    </div>
                  </div>

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
                          pathname: `/studentNewCourse/${courseId}/${chapter.id}/${item?.id}`,
                        }}
                      >
                        <li
                          key={chapter.id}
                          className="p-4 cursor-pointer hover:bg-gray-100 rounded-md flex justify-between"
                        >
                          <div>
                            <h3 className="uppercase font-semibold">{chapter.title}</h3>
                            <small>
                              {isNaN(chapter?.completedPercentage) ? 0 : +chapter?.completedPercentage}%
                              completed
                            </small>
                          </div>
                          <div className="w-8 h-8">
                            <CircularProgressbar
                              value={isNaN(chapter?.completedPercentage) ? 0 : +chapter?.completedPercentage}
                              styles={buildStyles({
                                pathColor: `#f88`,
                                trailColor: '#d6d6d6',
                                backgroundColor: '#3e98c7',
                              })}
                            />
                          </div>
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
