import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useApiGet } from '@/lib/dashboard/client/user';

import { useSession } from 'next-auth/react';

const HeroSection = ({ title, desc, id, price }: any) => {
  const router = useRouter();
  const { data: userData } = useSession();
  const [isThisCourseAlreadyAssigned, setIsThisCourseAlreadyAssigned] = useState(false);

  const { isLoading } = useApiGet<any, Error>({
    endpoint: `/courses/getAllAssignedCourses/public/${userData?.user.id}`,
    queryKey: ['get-all-assigned-courses-public', userData?.user.id],
    config: {
      keepPreviousData: true,
      onSuccess: (res) => {
        const isAssigned = res?.data?.some((el: any) => el?.id === id);
        setIsThisCourseAlreadyAssigned(isAssigned);
      },
    },
  });

  return (
    <>
      <div className="overflow-hidden">
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <Image
            src="/assets/images/course-detail.jpg"
            alt="Banner Image"
            layout="fill" // makes the image cover the full width and height
            objectFit="cover" // ensures the image covers the container without being stretched
            quality={100} // optional: to ensure good image quality
            className={'scaleImage'} // Apply animation to the first slide
          />
          <div
            className="absolute top-0 left-0 right-0 bg-black/70"
            style={{ width: '100vw', height: '100vh', position: 'relative' }}
          >
            <div className="container h-full">
              <div className="grid grid-cols-2 h-full">
                <div className="col-span-2 flex items-center">
                  <div>
                    <h1 className="text-white text-6xl font-semibold mb-2">{title}</h1>
                    <p className="text-white mb-6">{desc}</p>
                    {isLoading ? (
                      ''
                    ) : isThisCourseAlreadyAssigned ? (
                      <Button
                        onClick={() => {
                          router.push(`/studentCourses`);
                        }}
                        variant="public-primary"
                        size="lg"
                        className="w-[300px]"
                      >
                        {userData?.user.id ? 'Continue' : ''}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          if (userData?.user.id) {
                            return router.push(`/assignCourse?courseId=${id}&userId=${userData?.user.id}`);
                          }
                          router.push(`/signUp?courseId=${id}`);
                        }}
                        variant="public-primary"
                        size="lg"
                        className="w-[300px]"
                      >
                        Buy course - ${price ?? 0}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
