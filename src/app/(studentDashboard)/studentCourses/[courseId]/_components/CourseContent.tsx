'use client';
import { Tooltip } from '@radix-ui/react-tooltip';
import { useAtom } from 'jotai';
import { FolderClosed, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { lockedContentModal } from '@/store/modals';

import LockedContentModal from './LockedContentModal';

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
  const [lockedContentModalState, setLockedContentModalState] = useAtom(lockedContentModal);

  const calculateProgress = (completed: any, total: any) => {
    const percentage = (completed * 100) / total;
    return isNaN(percentage) ? 0 : percentage?.toFixed(0);
  };

  // Helper function to check if chapter is complete
  const isChapterCompleted = (chapter: any) => {
    const isChapterCompleted = chapter._count.UserCourseProgress === chapter._count.sections;
    const isQuizCompleted = chapter?.QuizProgress?.[0]?.isPassed ? true : false;

    return isChapterCompleted && isQuizCompleted;
  };

  // Helper function to check if module is complete (all chapters)
  const isModuleCompleted = (module: any) => {
    return module.chapters.every(isChapterCompleted);
  };

  return (
    <div className="p-4 font-sans rounded-xl border bg-white dark:bg-black/80">
      <>
        <div className="flex items-center justify-between">
          <h1 className="text-primary text-xl font-bold mb-3">Content</h1>
          <p className="text-base font-bold">{modulesRecord?.length} Units</p>
        </div>

        <div className="w-full">
          {modulesRecord?.map((item: any, index: any, mArray: any) => {
            const moduleCompleted = index > 0 && isModuleCompleted(mArray?.[index - 1]);
            const isModuleDisabled = index > 0 ? !moduleCompleted : false;
            return (
              <Accordion key={item.id} type="multiple">
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger
                    onClick={() => toggleAccordion(index)}
                    className="flex items-center justify-between px-4 py-3 bg-themeGreen shadow-md cursor-pointer rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12">
                        <CircularProgressbar
                          value={
                            calculateProgress(
                              item?._count?.UserCourseProgress,
                              item?._count?.sections,
                            ) as number
                          }
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
                          {calculateProgress(item?._count?.UserCourseProgress, item?._count?.sections)}%
                          completed
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
                    <ul className="divide-y divide-gray-200 ">
                      {item.chapters.map((chapter: any, i: number, arr: any[]) => {
                        const chapterCompleted = i > 0 && isChapterCompleted(arr?.[i - 1]);
                        const isDisabled = isModuleDisabled ? true : i > 0 ? !chapterCompleted : false;

                        return !isDisabled ? (
                          <Link
                            className="text-black"
                            key={index}
                            href={{
                              pathname: `/studentNewCourse/${courseId}/${chapter.id}/${item?.id}`,
                            }}
                          >
                            <li
                              key={chapter.id}
                              className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-black/10 rounded-md flex justify-between items-center"
                            >
                              <div>
                                <h3 className="uppercase font-semibold dark:text-white/80">
                                  {chapter.title}
                                </h3>
                                <small className="dark:text-white/80">
                                  {calculateProgress(
                                    chapter?._count?.UserCourseProgress,
                                    chapter?._count?.sections,
                                  )}
                                  % completed
                                </small>
                              </div>
                              <div className="flex items-center gap-4">
                                {chapter?.QuizProgress?.length > 0 && (
                                  <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <img src="/assets/images/quiz.png" className="w-10" alt="" />
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-white">
                                        <p>
                                          Quiz Status :{' '}
                                          {chapter?.QuizProgress?.[0]?.isPassed ? 'Passed' : 'Failed'}
                                        </p>
                                        <p>Percentage : {chapter?.QuizProgress?.[0]?.score}% </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                )}

                                <div className="w-8 h-8">
                                  <CircularProgressbar
                                    value={
                                      calculateProgress(
                                        chapter?._count?.UserCourseProgress,
                                        chapter?._count?.sections,
                                      ) as number
                                    }
                                    styles={buildStyles({
                                      pathColor: `#f88`,
                                      trailColor: '#d6d6d6',
                                      backgroundColor: '#3e98c7',
                                    })}
                                  />
                                </div>
                                {/* Quiz Status Indicator */}
                              </div>
                            </li>
                          </Link>
                        ) : (
                          <li
                            onClick={() => {
                              setLockedContentModalState({ status: true, data: null });
                            }}
                            key={chapter.id}
                            className="p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-black/10 rounded-md flex justify-between items-center"
                          >
                            <div>
                              <h3 className="uppercase font-semibold dark:text-white/80">
                                🔒 {chapter.title}
                              </h3>
                              <small className="dark:text-white/80">
                                {calculateProgress(
                                  chapter?._count?.UserCourseProgress,
                                  chapter?._count?.sections,
                                )}
                                % completed
                              </small>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8">
                                <CircularProgressbar
                                  value={
                                    calculateProgress(
                                      chapter?._count?.UserCourseProgress,
                                      chapter?._count?.sections,
                                    ) as number
                                  }
                                  styles={buildStyles({
                                    pathColor: `#f88`,
                                    trailColor: '#d6d6d6',
                                    backgroundColor: '#3e98c7',
                                  })}
                                />
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </>

      {lockedContentModalState?.status && <LockedContentModal />}
    </div>
  );
};

export default CourseContent;
