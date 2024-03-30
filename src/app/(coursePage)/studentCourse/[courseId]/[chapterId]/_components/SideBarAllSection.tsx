'use client';
// import { useAtom } from 'jotai';

import { useAtom } from 'jotai';
import { Check, ChevronDown } from 'lucide-react';
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { selectedSectionAtom } from '@/store/course';

import 'react-circular-progressbar/dist/styles.css';
import ProgressCourse from './ProgressCourse';

import { useSearchParams } from 'next/navigation';

const SideBarAllSection = ({ allSections }: any) => {
  const [selectedItem, setSelectedItem] = useAtom(selectedSectionAtom);
  const search = useSearchParams();
  const chapterName = search.get('chapterName');
  return (
    <div className="max-w-sm w-96 right-0 bottom-0 top-0 overflow-y-scroll max-h-[95vh]">
      <div className="flex flex-col gap-6">
        <ProgressCourse />
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="border-b border-gray-500 w-full text-left pb-3 ">
                <div className="flex gap-2">
                  <div className="w-6 h-6 min-w-[1.5rem]">
                    <CircularProgressbar value={20} />
                  </div>
                  <span className="line-clamp-1">{chapterName}</span>
                </div>
                <div className="flex items-center gap-4">
                  1/2
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-4">
                  {allSections?.map((item: any) => {
                    console.log('section item', item);
                    if (!item.question) {
                      return (
                        <>
                          <div
                            key={item.id}
                            className={`step cursor-pointer ${item.isCompleted ? '' : 'step-incomplete'} ${
                              item.id === selectedItem?.id ? 'step-active' : ''
                            }`}
                            onClick={() => {
                              setSelectedItem(item);
                            }}
                          >
                            <div>
                              <div className="circle flex items-center justify-center">
                                {item.isCompleted && <Check className="h-4 w-4" />}
                              </div>
                            </div>
                            <div>
                              <div className="title line-clamp-1">{item.title}</div>
                            </div>
                          </div>
                        </>
                      );
                    }
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SideBarAllSection;
