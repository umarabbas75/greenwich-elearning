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
  // const [collapsible, setCollapsible] = useState(false);
  const chapterName = search.get('chapterName');
  const completedSections = allSections?.filter((item: any) => item?.isCompleted);
  const totalSections = allSections?.filter((item: any) => item?.title);
  console.log({ allSections });
  let percentage: any = (completedSections?.length * 100) / totalSections?.length;
  percentage = parseInt(percentage ?? 0);
  return (
    <div className="max-w-sm w-96 right-0 bottom-0 top-0 overflow-y-scroll max-h-[95vh]">
      <div className="flex flex-col gap-6">
        <ProgressCourse />
        <div>
          <Accordion
            // onChange={() => {
            //   setCollapsible(!collapsible);
            // }}
            type="single"
            collapsible
            // collapsible={collapsible}
            className="w-full"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="border-b border-gray-500 w-full text-left pb-3 ">
                <div className="flex gap-2 items-center">
                  <div className="w-10 h-10 min-w-[2.5rem]">
                    <CircularProgressbar
                      text={`${isNaN(percentage) ? 0 : percentage}%`}
                      value={isNaN(percentage) ? 0 : percentage}
                    />
                  </div>
                  <span className="line-clamp-1">{chapterName}</span>
                </div>
                <div className="flex items-center gap-4">
                  {completedSections?.length}/{totalSections?.length}
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
                            {/* {item.id === selectedItem?.id && <div className="active-bg"></div>} */}
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
