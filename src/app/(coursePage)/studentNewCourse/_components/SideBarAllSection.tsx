'use client';

import { Check, ChevronDown } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import Skeleton from 'react-loading-skeleton';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useApiMutation } from '@/lib/dashboard/client/user';

import ProgressCourse from './ProgressCourse';

import 'react-circular-progressbar/dist/styles.css';

const SideBarAllSection = ({
  allSections,
  courseData,
  courseDataLoading,
  chapter,
  isSidebar = false,
  setSelectedSection,
  selectedSection,
  isLoading,
}: any) => {
  const params = useParams();
  const chapterId = params.slug?.[1] || '';
  const moduleId = params.slug?.[2] || '';

  const completedSections = allSections?.filter((item: any) => item?.isCompleted);
  const totalSections = allSections?.filter((item: any) => item?.title);
  let percentage: any = (completedSections?.length * 100) / totalSections?.length;
  percentage = parseInt(percentage ?? 0);

  const { mutate: updateLastSeenSection } = useApiMutation<any>({
    endpoint: `/courses/section/updateLastSeen/`,
    method: 'post',
  });

  return (
    <div
      className={`max-w-sm w-96  ${
        isSidebar ? 'block p-5' : ' hidden lg:block'
      } right-0 bottom-0 top-0 overflow-y-scroll max-h-[95vh]`}
    >
      <div className="flex flex-col gap-6">
        <ProgressCourse courseData={courseData} courseDataLoading={courseDataLoading} />
        {isLoading ? (
          <SectionLoader />
        ) : (
          <div>
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger className="border-b border-gray-500 w-full text-left pb-3 ">
                  <div className="flex gap-2 items-center">
                    <div className="w-10 h-10 min-w-[2.5rem]">
                      <CircularProgressbar
                        text={`${isNaN(percentage) ? 0 : percentage}%`}
                        value={isNaN(percentage) ? 0 : percentage}
                      />
                    </div>
                    <span className="line-clamp-1">{chapter?.title}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {completedSections?.length}/{totalSections?.length}
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-4">
                    {allSections?.map((item: any) => {
                      if (!item.question) {
                        return (
                          <>
                            <div
                              key={item.id}
                              className={`step cursor-pointer ${item.isCompleted ? '' : 'step-incomplete'} ${
                                item.id === selectedSection
                                  ? 'text-[#4285f4] bg-[#d3d3d3b3] dark:bg-gray-800'
                                  : ''
                              }`}
                              onClick={() => {
                                setSelectedSection(item?.id);
                                const payload = {
                                  chapterId: chapterId,
                                  sectionId: item?.id,
                                  moduleId,
                                };
                                updateLastSeenSection(payload);
                              }}
                            >
                              <div>
                                <div className="circle flex items-center justify-center">
                                  {item.isCompleted && <Check className="h-4 w-4" />}
                                </div>
                              </div>
                              <div>
                                <div className="title text-normal line-clamp-1">{item.title}</div>
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
        )}
      </div>
    </div>
  );
};

export default SideBarAllSection;

const SectionLoader = () => {
  return (
    <div className="mt-4">
      <Skeleton
        height={40}
        width="100%"
        baseColor="var(--skeleton-base-color)"
        highlightColor="var(--skeleton-highlight-color)"
      />
      <div className="mt-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="step cursor-pointer flex items-center gap-2">
            <Skeleton
              circle={true}
              height={20}
              width={20}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
            <Skeleton
              width={150}
              baseColor="var(--skeleton-base-color)"
              highlightColor="var(--skeleton-highlight-color)"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
