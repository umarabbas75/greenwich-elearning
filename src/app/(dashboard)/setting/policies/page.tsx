'use client';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

import FileCard from '@/app/(studentDashboard)/studentCourses/[courseId]/_components/FileCard';
import { useApiGet, useApiMutation } from '@/lib/dashboard/client/user';

const Page = () => {
  const [policies, setPolicies] = useState([
    {
      title: 'Assessment Policy',
      fileName: 'Assessment Policy',
      description: `This policy outlines the procedures for evaluating your learning outcomes and ensuring a fair
      and consistent assessment process. It details the types of assessments used (e.g., exams,
      quizzes, assignments), grading criteria, feedback mechanisms, and procedures for appeals or
      re-evaluations. By understanding the assessment policy, you can prepare effectively for
      assessments and demonstrate your knowledge and skills successfully.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'd23534dsgtdss346',
    },
    {
      title: 'Complaint Policy',
      fileName: 'Complaint Policy',
      description: ` This policy details the process for raising and resolving concerns regarding our platform or
      services. It outlines how to submit complaints (e.g., email, online form), the investigation
      process, and potential resolutions. We encourage open communication and address concerns
      promptly and fairly. By utilizing this policy, you can contribute to improving our platform and
      services.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'dfgdft6435sdfsd6453',
    },
    {
      title: 'Data Policy',
      fileName: 'Data Policy',
      description: ` This policy explains how we collect, store, and use your data, ensuring your privacy and
      security. It details the types of data collected (e.g., personal information, activity logs),
      how it's used (e.g., personalization, learning analytics), and your rights regarding your data
      (e.g., access, correction, deletion). We value your privacy and are committed to being
      transparent about our data practices.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'dfgdft64334654rg56453',
    },
    {
      title: 'Equal Opportunity Policy',
      fileName: 'Equal Opportunity Policy',
      description: `This policy emphasizes our commitment to providing a fair and inclusive learning environment for
      everyone. It details our prohibitions against discrimination based on factors like race, gender,
      religion, or disability, and outlines measures to promote diversity and inclusion (e.g.,
      accessible learning materials, supportive learning environment). We believe everyone deserves
      access to quality education regardless of background.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'dfgdft64356fghrt6745453',
    },
    {
      title: 'OHS Policy (Occupational Health and Safety)',
      fileName: 'OHS Policy (Occupational Health and Safety)',
      description: `This policy outlines our commitment to maintaining a safe and healthy learning environment. It
      details measures taken to prevent accidents and injuries (e.g., secure online environment, data
      security practices). By adhering to this policy, we can create a positive and stress-free
      learning experience for all users.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'dfgdft64vre637r356453',
    },
    {
      title: 'Quality Policy',
      fileName: 'Quality Policy',
      description: ` This policy explains our dedication to continuous improvement and delivering a high-quality
      learning experience for all users. It outlines our commitment to providing up-to-date content,
      maintaining a reliable platform, and seeking feedback to improve our services. By adhering to
      this policy, we ensure that you receive the best possible learning experience.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'dfgdft6435aw43260trgr6453',
    },
    {
      title: 'Recognition of Prior Learning Policy (RPL)',
      fileName: 'Recognition of Prior Learning Policy (RPL)',
      description: `This policy outlines the process for recognizing previously acquired skills and knowledge
      towards your learning goals. It details how you can demonstrate your prior learning through
      various methods (e.g., portfolios, certifications, work experience). By recognizing your prior
      learning, we can potentially reduce the amount of coursework required and accelerate your
      learning journey.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'dfgdft6435vsd43wsghjtfgt3vw6453',
    },
    {
      title: 'Refund Policy',
      fileName: 'Refund Policy',
      description: ` This policy specifies the terms and conditions for receiving refunds on purchases made on our
      platform. It outlines eligibility for refunds, the timeframe for requesting a refund, and the
      process for submitting a refund request. By understanding this policy, you can make informed
      decisions about your purchases.`,
      file: 'https://drive.google.com/file/d/1I6XXSdU_IhQI30pFzqsMuHMqg8GSrEsW/view?usp=sharing',
      id: 'fbnfgbdsfg43646dty34tregfdui576546easfd',
    },
  ]);
  const queryClient = useQueryClient();

  const {
    mutate: updatePolicies,
    //isLoading: editingCourse,
  } = useApiMutation<any>({
    endpoint: `/courses/policies`,
    method: 'post',
    config: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['ge-user-policies'],
        });
      },
    },
  });
  const { isLoading } = useApiGet<any>({
    endpoint: `/courses/getUserPolicies`,
    queryKey: ['ge-user-policies'],
    config: {
      select: (res) => res?.data?.data,
      onSuccess: (userPolicies) => {
        const policiesWithSeenFlag = policies.map((policy) => {
          const isSeen = userPolicies?.some((seenPolicy: any) => seenPolicy.policiesId === policy.id);
          return { ...policy, isSeen };
        });
        setPolicies(policiesWithSeenFlag);
      },
    },
  });

  if (isLoading) {
    return 'loading...';
  }

  return (
    <div className="mt-4">
      <div>
        <div className="container mx-auto px-8 py-8 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-themeGreen mb-4">Policies and Procedures</h1>
          <p className="text-gray-600  mb-6">
            This page outlines the key policies and procedures that govern various aspects of our platform.
            Familiarizing yourself with these guidelines will ensure a smooth and positive learning
            experience. By adhering to these policies, we can all contribute to a safe, inclusive, and
            high-quality learning environment.
          </p>

          {/* Policy Sections */}
          <ul className="list-none space-y-4">
            {policies.map((policy: any, index) => (
              <li key={index} className="border-b border-gray-300 pt-3 pb-4">
                <h2 className="text-2xl font-semibold text-themeGreen">{policy.title}</h2>
                <p className="text-gray-600 mb-4">{policy.description}</p>
                <FileCard
                  fileName={policy.fileName}
                  fileType="Pdf document"
                  file={policy.file}
                  seen={policy?.isSeen}
                  item={policy}
                  onClick={(item: any) => {
                    const payload = {
                      policiesId: item?.id,
                    };
                    updatePolicies(payload);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
