import React from 'react';
import { FiPlus } from 'react-icons/fi';

import PublicHeading from '@/components/common/PublicHeading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
const Syllabus = ({ units }: any) => {
  return (
    <div className="bg-gray-100 mt-20">
      <div className="container py-10">
        <PublicHeading
          containerClasses="text-center "
          backGroundHeading="Excellent"
          mainHeading={`Syllabus`}
          bgHeadingClasses="text-center"
          mainHeadingClasses="text-2xl"
        />
        <div className="max-w-[50%]">
          <Accordion type="single" collapsible className="w-full">
            {units?.map((item: any) => {
              return (
                <div className="mb-4" key={item?.id}>
                  <h1 className="text-publicBlue text-lg underline font-semibold mb-2">{item?.title}</h1>
                  {item?.chapters?.map((el: any) => {
                    return (
                      <AccordionItem value={el?.id} key={el?.id}>
                        <AccordionTrigger className="bg-publicBlue text-white px-3 py-3 rounded-sm mb-2 uppercase font-normal text-sm">
                          {el?.title}
                          <FiPlus />
                        </AccordionTrigger>
                        <AccordionContent>{el?.description}</AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </div>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
