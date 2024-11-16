import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Button } from '@/components/ui/button';
const HeroSection = () => {
  const [slideIndex, setSlideIndex] = useState(0); // To track the current slide
  const animationDuration = 8000; // 5 seconds for the animation duration

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // Disable default autoplay, we will control it manually
    beforeChange: (_: any, next: any) => setSlideIndex(next), // Update slideIndex when slide changes
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      (document as any).querySelector('.slick-next').click(); // Move to the next slide after animation
    }, animationDuration);

    return () => clearTimeout(timer); // Clear timeout when component unmounts
  }, [slideIndex]);
  return (
    <>
      <Slider {...settings}>
        <div>
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Image
              src="/assets/images/home/e-learning-1.jpg"
              alt="Banner Image"
              layout="fill" // makes the image cover the full width and height
              objectFit="cover" // ensures the image covers the container without being stretched
              quality={100} // optional: to ensure good image quality
              className={slideIndex === 0 ? 'scaleImage' : ''} // Apply animation to the first slide
            />
            <div
              className="absolute top-0 left-0 right-0 bg-black/70"
              style={{ width: '100vw', height: '100vh', position: 'relative' }}
            >
              <div className="container h-full">
                <div className="grid grid-cols-2 h-full">
                  <div className="col-span-1 flex items-center">
                    <div>
                      <h1 className="text-white text-6xl font-semibold mb-2">
                        Transform Your Career with Industry-Leading eLearning
                      </h1>
                      <p className="text-white mb-6">
                        Join our dynamic eLearning platform and gain in-demand tech skills.
                      </p>
                      <Button variant="public-primary" size="lg" className="w-[300px]">
                        Start e-learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Image
              src="/assets/images/home/e-learning-2.jpg"
              alt="Banner Image"
              layout="fill" // makes the image cover the full width and height
              objectFit="cover" // ensures the image covers the container without being stretched
              quality={100} // optional: to ensure good image quality
              className={slideIndex === 1 ? 'scaleImage' : ''} // Apply animation to the first slide
            />
            <div
              className="absolute top-0 left-0 right-0 bg-black/70"
              style={{ width: '100vw', height: '100vh', position: 'relative' }}
            >
              <div className="container h-full">
                <div className="grid grid-cols-2 h-full">
                  <div className="col-span-1 flex items-center">
                    <div>
                      <h1 className="text-white text-6xl font-semibold mb-2">
                        Transform Your Career with Industry-Leading eLearning
                      </h1>
                      <p className="text-white mb-6">
                        Join our dynamic eLearning platform and gain in-demand tech skills.
                      </p>
                      <Button variant="public-primary" size="lg" className="w-[300px]">
                        Start e-learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Image
              src="/assets/images/home/e-learning-3.jpg"
              alt="Banner Image"
              layout="fill" // makes the image cover the full width and height
              objectFit="cover" // ensures the image covers the container without being stretched
              quality={100} // optional: to ensure good image quality
              className={slideIndex === 2 ? 'scaleImage' : ''} // Apply animation to the first slide
            />
            <div
              className="absolute top-0 left-0 right-0 bg-black/70"
              style={{ width: '100vw', height: '100vh', position: 'relative' }}
            >
              <div className="container h-full">
                <div className="grid grid-cols-2 h-full">
                  <div className="col-span-1 flex items-center">
                    <div>
                      <h1 className="text-white text-6xl font-semibold mb-2">
                        Transform Your Career with Industry-Leading eLearning
                      </h1>
                      <p className="text-white mb-6">
                        Join our dynamic eLearning platform and gain in-demand tech skills.
                      </p>
                      <Button variant="public-primary" size="lg" className="w-[300px]">
                        Start e-learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Image
              src="/assets/images/home/e-learning-4.jpg"
              alt="Banner Image"
              layout="fill" // makes the image cover the full width and height
              objectFit="cover" // ensures the image covers the container without being stretched
              quality={100} // optional: to ensure good image quality
              className={slideIndex === 3 ? 'scaleImage' : ''} // Apply animation to the first slide
            />
            <div
              className="absolute top-0 left-0 right-0 bg-black/70"
              style={{ width: '100vw', height: '100vh', position: 'relative' }}
            >
              <div className="container h-full">
                <div className="grid grid-cols-2 h-full">
                  <div className="col-span-1 flex items-center">
                    <div>
                      <h1 className="text-white text-6xl font-semibold mb-2">
                        Transform Your Career with Industry-Leading eLearning
                      </h1>
                      <p className="text-white mb-6">
                        Join our dynamic eLearning platform and gain in-demand tech skills.
                      </p>
                      <Button variant="public-primary" size="lg" className="w-[300px]">
                        Start e-learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Slider>
    </>
  );
};

export default HeroSection;
