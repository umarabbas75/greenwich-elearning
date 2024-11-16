'use client';
import React from 'react';

import Accreditation from './components/Accreditation';
import ContactUs from './components/ContactUs';
import CorporateClient from './components/CorporateClient';
import HeroSection from './components/HeroSection';
import PopularCourses from './components/PopularCourses';
import StatisticsCounter from './components/StatisticsCounter';
import WhyChooseUs from './components/WhyChooseUs';

const Page = () => {
  return (
    <>
      <div className="mb-24">
        <HeroSection />
      </div>

      <Accreditation />

      <PopularCourses />

      <CorporateClient />
      <WhyChooseUs />
      <StatisticsCounter />

      <div className="my-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13282.998935858406!2d73.0843484!3d33.663646!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x8adcdad331a21eeb!2sGreenwich%20Training%20%26%20Consulting!5e0!3m2!1sen!2s!4v1593260345591!5m2!1sen!2s"
          width="100%"
          height="500px"
          frameBorder="0"
          style={{ border: 0 }}
          allowFullScreen={true}
          aria-hidden="false"
        ></iframe>
      </div>

      <ContactUs />
    </>
  );
};

export default Page;
