import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import PublicHeading from '@/components/common/PublicHeading';
const CorporateClient = () => {
  const slides = [
    '/assets/images/corporateClients/PTCL.png',
    '/assets/images/corporateClients/NTRC.png',
    '/assets/images/corporateClients/bgp.png',
    '/assets/images/corporateClients/danaEnergy.png',
    '/assets/images/corporateClients/greenB.png',
    '/assets/images/corporateClients/GTSC.png',
    '/assets/images/corporateClients/kohatCement.png',
    '/assets/images/corporateClients/muscat.gif',
    '/assets/images/corporateClients/NTRC.png',
    '/assets/images/corporateClients/PTCL.png',
    '/assets/images/corporateClients/sarhadUniversity.png',
    '/assets/images/corporateClients/schlemburger.png',
    '/assets/images/corporateClients/sunflower.png',
    '/assets/images/corporateClients/transparent.gif',
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    autoplay: false, // Disable default autoplay, we will control it manually
  };
  return (
    <div className="py-24">
      <div className="app-container">
        <PublicHeading
          containerClasses="text-center"
          backGroundHeading="Excellent"
          mainHeading="Our Corporate Clients"
          bgHeadingClasses="text-center"
        />
        <div className="h-20">
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div key={index}>
                <img
                  alt={`client-corporate-${index}`}
                  src={slide}
                  height={100}
                  width={100}
                  className="rounded-md "
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default CorporateClient;
