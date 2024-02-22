import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import courseData from './courseData';

const CourseContent = () => {
  const params = useParams();
  const { courseId } = params || {};
  const renderChaptersList = (chapters: any) => {
    return chapters.map((item: any, index: number) => {
      return (
        <Link key={index} href={`/studentCourses/${courseId}/${item.id}`}>
          <li>{item.title}</li>
        </Link>
      );
    });
  };

  return (
    <div className="p-4 font-sans rounded-xl border bg-white">
      <div className="flex items-center justify-between">
        <h1 className="text-primary text-xl font-bold mb-3">Overview</h1>
        <p className="text-base font-bold">92 Lectures</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {courseData.map((item: any, index: number) => {
          return (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{item.module}</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc">{renderChaptersList(item.chapters)}</ul>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default CourseContent;
