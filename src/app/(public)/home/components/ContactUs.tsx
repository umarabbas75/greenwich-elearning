import React from 'react';
import { FaPhone } from 'react-icons/fa';
import { MdLocationPin } from 'react-icons/md';

import PublicHeading from '@/components/common/PublicHeading';
import { Button } from '@/components/ui/button';

const ContactUs = () => {
  return (
    <div className="mt-10 pb-10">
      <div className="container ">
        <div className="text-center wow fadeInDown">
          <PublicHeading
            containerClasses="text-center"
            backGroundHeading="Communication"
            mainHeading="Contact us"
            bgHeadingClasses="text-center"
          />
        </div>

        <div className="grid grid-cols-12 gap-12 items-stretch">
          <div className="col-span-5 wow fadeInLeft group">
            <div
              className="h-full py-11 px-7 w-full rounded-sm transition-all duration-300 hover:bg-[#ed1c24]"
              style={{ boxShadow: '0px 0px 40px 0px rgba(0, 0, 0, 0.1)' }}
            >
              <PublicHeading
                containerClasses="text-left"
                mainHeading="Contact Info"
                mainHeadingClasses="group-hover:text-white"
              />

              <div className="mb-6">
                <p className="flex gap-2 items-center">
                  <div className="p-2 flex items-center justify-center rounded-sm bg-publicBlue">
                    <MdLocationPin className="text-white" />
                  </div>
                  <span className="uppercase text-publicBlue font-semibold text-sm group-hover:text-white">
                    Address
                  </span>
                </p>
                <p className="text-sm text-gray-700 mt-2 group-hover:text-white">
                  1137, Street No. 66, adjacent to Riphah International University, I-14/3
                </p>
              </div>

              <div className="mb-6">
                <p className="flex gap-2 items-center">
                  <div className="p-2 flex items-center justify-center rounded-sm bg-publicBlue">
                    <FaPhone className="text-white" />
                  </div>
                  <span className="uppercase text-publicBlue font-semibold text-sm group-hover:text-white">
                    Phone
                  </span>
                </p>

                <p className="text-sm text-gray-700 mt-2 group-hover:text-white"> +92-51-5179324</p>
                <p className="text-sm text-gray-700 group-hover:text-white">+92-312-5343061</p>
              </div>

              <div className="mb-6">
                <p className="flex gap-2 items-center">
                  <div className="p-2 flex items-center justify-center rounded-sm bg-publicBlue">
                    <FaPhone className="text-white" />
                  </div>
                  <span className="uppercase text-publicBlue font-semibold text-sm group-hover:text-white">
                    Email
                  </span>
                </p>

                <p className="text-sm text-gray-700 mt-2 group-hover:text-white"> info@greenwichtc.com</p>
              </div>
            </div>
          </div>

          <div className="col-span-7">
            <div
              className="py-5 px-12 bg-white w-full h-full wow rounded-sm  fadeInRight"
              style={{ boxShadow: '0 3px 16px 0 rgba(154,160,185,.05), 0 10px 40px 0 rgba(166,173,201,.41)' }}
            >
              <div className="relative  grid grid-cols-2 gap-6  pt-7">
                <div className="inputBox ">
                  <input type="text" name="" required />
                  <span>First Name</span>
                </div>
                <div className="inputBox ">
                  <input type="text" name="" required />
                  <span>Last Name</span>
                </div>
                <div className="inputBox ">
                  <input type="text" name="" required />
                  <span>Email</span>
                </div>
                <div className="inputBox ">
                  <input type="text" name="" required />
                  <span>Mobie</span>
                </div>

                <div className="inputBox col-span-2">
                  <textarea name="" id="" cols={30} rows={3}></textarea>

                  <span>Message</span>
                </div>
              </div>

              <Button variant="public-primary" size="lg">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
