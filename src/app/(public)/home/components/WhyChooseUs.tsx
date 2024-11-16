// Importing icons

import { Book } from 'lucide-react';
import { FaBookOpen, FaCertificate, FaClock } from 'react-icons/fa';

import PublicHeading from '@/components/common/PublicHeading';

const whyChooseUs = [
  {
    icon: FaCertificate,
    title: 'Globally Recognized Certifications',
  },
  {
    icon: FaClock,
    title: 'Learn at Your Own Pace',
  },
  {
    icon: FaBookOpen,
    title: 'Hands-on Learning',
  },
  {
    icon: Book,
    title: 'Training',
  },
];

const WhyChooseUs = () => {
  return (
    <div className="container my-10">
      <div className="grid grid-cols-1">
        <div className="col-span-1 wow fadeInDown animated">
          <div className="mb-7">
            <PublicHeading
              containerClasses="text-center"
              backGroundHeading="Excellent"
              mainHeading="Why choose us"
              bgHeadingClasses="text-center"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-1 wow fadeInLeft animated">
          <div className="whoweare-item">
            <div className="whoweare-left">
              <PublicHeading
                containerClasses="text-left"
                mainHeading="Services we provide"
                bgHeadingClasses="text-left"
                mainHeadingClasses="text-2xl"
                text
              />
              <h4 className="text-publicBlue text-2xl font-semibold">Elevate Your Learning Experience</h4>
              <p className="text mt-2">
                Discover a transformative approach to online education that prioritizes your pace and
                preferences. With globally recognized certifications and an extensive library of real-world
                case studies, we empower you to apply your knowledge effectively. Our expert instructors are
                just a message away, ensuring you receive support whenever you need it. Join us and elevate
                your professional journey!
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-1 wow fadeInRight animated">
          <div className="grid grid-cols-2 gap-6">
            {whyChooseUs?.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="col-span-1 ">
                  <div
                    className="flex justify-center items-center flex-col pt-12 bg-white rounded-md transition-all duration-300 hover:bg-[#F0AAAE] hover:-translate-y-3"
                    style={{ boxShadow: '0 0 15px rgba(218, 219, 255, 0.4)' }}
                  >
                    {/* <img src="./assets/images/consultancy.svg" alt="" width="100%" /> */}
                    <Icon className="text-black text-3xl mb-7" />
                    <h4 className="pb-12 uppercase text-center text-lg text-publicRed font-bold">
                      {item.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
