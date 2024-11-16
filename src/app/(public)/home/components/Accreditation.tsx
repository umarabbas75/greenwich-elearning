import { useAtom } from 'jotai';
import React from 'react';

import PublicHeading from '@/components/common/PublicHeading';
import { Button } from '@/components/ui/button';
import { viewAccreditation } from '@/store/modals';

import ViewAccreditationModal from './ViewAccreditation';

const accreditationData = [
  {
    id: 1,
    imgSrc: '/assets/images/accreditation/nebosh_thumnbail.svg',
    imgAlt: 'NEBOSH IGC Logo',
    imgClass: 'w-[70px]',
    description: 'NEBOSH IGC Accreditation',
    mainImage: '/assets/images/accreditation/nebosh_gold.jpeg',
  },
  {
    id: 2,
    imgSrc: '/assets/images/accreditation/iosh_thumbnail.svg',
    imgAlt: 'IOSH Logo',
    imgClass: 'w-[100px]',
    description: 'IOSH Accreditation',
    mainImage: '/assets/images/accreditation/iosh_acc.jpeg',
  },
  {
    id: 3,
    imgSrc: '/assets/images/accreditation/wso_thumbnail.png',
    imgAlt: 'WSO Logo',
    imgClass: 'w-[70px]',
    description: 'WSO Appointment',
    mainImage: '/assets/images/accreditation/wso_appointment.jpg',
  },
  {
    id: 4,
    imgSrc: '/assets/images/accreditation/othm_thumbnail.jpeg',
    imgAlt: 'OTHM Logo',
    imgClass: 'w-[70px]',
    description: 'OTHM Accreditation',
    mainImage: '/assets/images/accreditation/othm.jpeg',
  },
  {
    id: 5,
    imgSrc: '/assets/images/accreditation/nebosh_thumnbail.svg',
    imgAlt: 'NEBOSH HSW Logo',
    imgClass: 'w-[62px]',
    description: 'NEBOSH HSW Accreditation',
    mainImage: '/assets/images/accreditation/nebosh_gold_HSW.jpeg',
  },
  {
    id: 6,
    imgSrc: '/assets/images/accreditation/ict_qualifications.jpeg',
    imgAlt: 'ICT Logo',
    imgClass: 'w-[70px]',
    description: 'ICT Qualifications',
    mainImage: '/assets/images/accreditation/ict_qualifications.jpeg',
  },
];

const Accreditation = () => {
  const [modalState, setModalState] = useAtom(viewAccreditation);

  return (
    <div className="mb-24">
      <div className="app-container">
        <PublicHeading
          containerClasses="text-center "
          backGroundHeading="Amazing"
          mainHeading="Our Accreditation Partners"
          bgHeadingClasses="text-center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accreditationData.map((item) => (
            <div key={item.id} className="col-span-1">
              <div className="flex p-6 shadow-md rounded-lg bg-gradient-to-b from-white to-gray-50 hover:bg-gradient-to-b hover:from-gray-100 hover:to-gray-200 transition-transform transform hover:scale-105 hover:-translate-y-2 duration-300">
                <div className="mr-6 flex items-center justify-center w-24 h-24 bg-publicRed/10 rounded-full">
                  <img src={item.imgSrc} alt={item.imgAlt} className={item.imgClass} />
                </div>
                <div>
                  <p className=" font-semibold text-gray-800">{item.description}</p>
                  <div className="flex gap-2 w-full mt-4">
                    <Button
                      className="min-w-[180px] bg-gradient-to-r border border-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-publicRed"
                      variant="public-primary"
                      onClick={() => {
                        setModalState({
                          data: item.mainImage,
                          status: true,
                        });
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalState.status && <ViewAccreditationModal />}
    </div>
  );
};

export default Accreditation;
