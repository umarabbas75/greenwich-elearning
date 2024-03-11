'use client';
import { useAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useQueryClient } from 'react-query';

import { SectionsDataResponse } from '@/app/(dashboard)/course/[courseId]/[moduleId]/[chapterId]/page';
import { AlertDestructive } from '@/components/common/FormError';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';
import { selectedSectionAtom } from '@/store/course';

import ProgressSection from './_components/ProgressSection';
import SideBarAllSection from './_components/SideBarAllSection';

const Page = () => {
  const params = useParams();
  const { courseId, chapterId } = params;
  const { data: userData } = useSession();
  console.log({ courseId, chapterId });
  const queryClient = useQueryClient();

  const { data: sectionsData, isLoading } = useApiGet<SectionsDataResponse, Error>({
    endpoint: `/courses/module/chapter/allSections/${chapterId}`,
    queryKey: ['get-sections', chapterId],
  });
  const [selectedItem, setSelectedItem] = useAtom(selectedSectionAtom);
  console.log({ sectionsData, isLoading, selectedItem });
  const {
    mutate: updateProgress,
    isLoading: updatingProgress,
    isError: isUpdateError,
    error: updateError,
  } = useApiMutation<any>({
    endpoint: `/courses/updateUserCourse/Progress`,
    method: 'put',
    config: {
      onSuccess: (res: any) => {
        console.log({ res });
        const selectedIndex = sectionsData?.data.findIndex((item) => item.id === selectedItem?.id);
        const nextItem = sectionsData?.data[(selectedIndex ?? 0) + 1];
        console.log({ selectedIndex, nextItem }, sectionsData?.data?.[nextItem ?? 0]);
        setSelectedItem(nextItem);
        queryClient.invalidateQueries({ queryKey: ['get-course-progress'] });

        toast({
          variant: 'success',
          // title: 'Success ',
          description: 'Progress saved!',
        });
      },
    },
  });

  const updateCourseProgress = () => {
    const payload = {
      userId: userData?.user.id,
      courseId: courseId,
      chapterId: chapterId,
    };
    updateProgress(payload);
  };
  return (
    <div className="flex gap-4 min-h-full">
      <div className="flex-1 p-4 rounded-xl border bg-white">
        {/* <p>
          1.4 - Pollution Risks with Fuel Extraction - Oil and Gas Drilling. In the drilling process, water
          and chemicals are used to force liquids or gaseous fossil fuels to flow to the surface. OilRig Oil
          Rig Platform, Russia (Photo: David Mark, Pixabay). The waste water from this process can then
          contain heavy metals, radioactive materials as well as hydrocarbons, this makes the water difficult
          to safely dispose of. Hydraulic fracturing “Fracking” uses more water and chemicals to fracture the
          rocks open to release the gas stores. This method creates more waste water than drilling due to the
          large volume of water and chemicals used in the process. Typically drilling and fracking for shale
          gas typically requires 3-6 billion gallons of water per well and a further 15,000-65,000 gallons of
          chemicals. One report sponsored by the US Government found that “from 2005-2009, 14 oil and gas
          companies used 780 million gallons of hydraulic fracturing products, containing 750 chemicals and
          other components. Researchers could only track 353 of these chemicals and found 25% could cause
          cancers or other mutation and about half could severely damage neurological, cardiovascular,
          endocrine and immune
        </p> */}
        <div contentEditable="true" dangerouslySetInnerHTML={{ __html: selectedItem?.description }}></div>
        <div className="flex justify-between my-4">
          <Button variant="secondary">Prev</Button>
          <Button onClick={() => updateCourseProgress()}>{updatingProgress ? 'updating...' : 'Next'}</Button>
        </div>
        <ProgressSection />

        {isUpdateError && <AlertDestructive error={updateError} />}
      </div>

      <SideBarAllSection allSections={sectionsData?.data} />
    </div>
  );
};

export default Page;
