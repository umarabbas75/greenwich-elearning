// import { useAtom } from 'jotai';
import { useAtom } from 'jotai';
import React from 'react';

import { selectedSectionAtom } from '@/store/course';

// import { sideBarDrawerAtom } from '@/store/modals';

const SideBarAllSection = ({ allSections }: any) => {
  //   const [sideBarDrawer, setSideBarDrawer] = useAtom(sideBarDrawerAtom);
  // const allSections = [
  //   {
  //     title: 'Element 2 - Environmental Leadership.',
  //     desc: `Element 2 - Environmental Leadership.
  //     Learning Outcomes.

  //     Once you have completed this element you will be able to:

  //     Explain the reasons for improving environmental and social performance.
  //     Explain the importance of leadership with regards to an organisation’s environmental performance.
  //     Outline the importance of personal ethics and professional practice to the environmental practitioner.
  //     Outline how the environmental practitioner can manage and maintain their levels of competence.
  //     Outline how levels of competence can be managed by an organisation.
  //     Recommended study time for this element is no less than 4 hours.`,
  //   },
  //   {
  //     title: 'Learning Outcome 1..',
  //     desc: `In this learning outcome, the following will be covered:

  //     Reasons for improving environmental and social performance.

  //     Moral:
  //     Differing global community attitudes to the value of the environment.
  //     The need to prevent/minimise the impact of an organisation's activities on the environment.
  //     The precautionary principle (also see Element 1.3).
  //     Sustainability drivers.
  //     Legal:
  //     Local (country specific) legislation, regional legislation (i.e. directives), international treaties.
  //     Economic:
  //     Polluter pays principle (also see Element 1.3).
  //     Costs associated with environmental incidents i.e. legal costs, fines/sanctions, clean-up costs, remediation works.
  //     The business case for good environmental management.
  //     Supply chain pressures/stakeholder expectations.
  //     Corporate social responsibility.
  //     Cost savings (energy usage, waste segregation/recycling/reusing/resource
  //     efficiency, etc.).`,
  //   },
  //   {
  //     title: 'What will be Covered in Learning Outcome 1?.',
  //     desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa odio ducimus tenetur rerum ratione, voluptatem cumque reiciendis facere vitae repellendus!',
  //   },
  //   {
  //     title: '1.0 - Reasons for Improving Environmental and Social Performance.',
  //     desc: 'Reasons for improving environmental and social performance are often divided into moral, legal and financial aspects, but they do overlap/interlink.',
  //   },
  // ];
  const [_, setSelectedItem] = useAtom(selectedSectionAtom);
  return (
    <div
      className="max-w-sm w-72 bg-white p-8  h-full right-0 bottom-0 top-0"
      style={{ boxShadow: '0 0 10px rgba(0,0,0,.1)' }}
    >
      <p className="font-bold font-lg mb-8">Lesson Menu</p>
      <ul className="list-disc">
        {allSections?.map((item: any) => {
          if (!item.question) {
            return (
              <li
                key={item.id}
                className={`text-blue-500 cursor-pointer hover:decoration-dashed ${
                  item.isCompleted ? 'line-through' : ''
                }`}
                onClick={() => {
                  setSelectedItem(item);
                }}
              >
                {item.title}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default SideBarAllSection;
