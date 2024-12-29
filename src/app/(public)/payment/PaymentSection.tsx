import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { FaRegCopy, FaWhatsapp } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { useApiGet } from '@/lib/dashboard/client/user';

const PaymentSection = () => {
  const params = useSearchParams();
  const courseId = params.get('courseId');
  const router = useRouter();

  const { data: coursesData } = useApiGet<any, Error>({
    endpoint: `/courses/public/${courseId}`,
    queryKey: ['courses-public-detail', courseId],

    config: {
      enabled: !!courseId,
      select: (res: any) => res?.data?.data,
      keepPreviousData: true,
    },
  });

  const [isCopied, setIsCopied] = useState(false);

  const dummyData = {
    bankDetails: {
      bankName: 'Meezan Bank',
      accountTitle: 'Umar Abbas',
      accountNumber: '1234 5678 9012',
      IBAN: 'PK00XYZ123456789012345678',
      branchCode: 9876,
    },
  };
  const { bankDetails } = dummyData;
  const copyBankDetails = () => {
    navigator.clipboard.writeText(`
      Bank Name: Meezan Bank
      Account Title: Umar Abbas
      Account Number: 1234 5678 9012
      IBAN: PK00XYZ123456789012345678
      Branch Code: 9876
    `);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg  w-full relative mt-6 p-6">
      <div className="flex items-center justify-center mb-6">
        <img src="/assets/images/bank-transfer-2.png" alt="Bank Transfer" className="h-10 w-10 mr-2" />
        <p className="text-gray-600">Bank Transfer Details</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Course</h3>
        <p className="text-sm text-gray-800">{coursesData?.title}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Amount to Pay</h3>
        <p className="text-2xl font-bold text-gray-800">$ {coursesData?.price || 0}</p>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow-inner">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Bank Account Details</h3>
        <p className="text-sm text-gray-800 flex items-center mb-1">
          <span className="w-32">Bank Name:</span>
          <span className="font-semibold text-base">{bankDetails?.bankName}</span>
        </p>{' '}
        <p className="text-sm text-gray-800 flex items-center mb-1">
          <span className="w-32">Account Title:</span>
          <span className="font-semibold text-base">{bankDetails?.accountTitle}</span>
        </p>{' '}
        <p className="text-sm text-gray-800 flex items-center mb-1">
          <span className="w-32">Account Number:</span>
          <span className="font-semibold text-base">{bankDetails?.accountNumber}</span>
        </p>{' '}
        <p className="text-sm text-gray-800 flex items-center mb-1">
          <span className="w-32">IBAN:</span>
          <span className="font-semibold text-base">{bankDetails?.IBAN}</span>
        </p>{' '}
        <p className="text-sm text-gray-800 flex items-center mb-1">
          <span className="w-32">Branch Code:</span>
          <span className="font-semibold text-base">{bankDetails?.branchCode}</span>
        </p>
        <button
          onClick={copyBankDetails}
          className="flex items-center mt-2 text-blue-600 hover:text-blue-700 text-sm"
        >
          {isCopied ? (
            <span className="text-green-500">Copied!</span>
          ) : (
            <>
              <FaRegCopy className="mr-1" /> Copy Details
            </>
          )}
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Complete the Payment</h3>
        <ol className="list-decimal list-inside text-sm text-gray-800 space-y-1">
          <li>Transfer the exact amount to the above bank account.</li>
          <li>Take a screenshot of the transaction.</li>
          <li>
            Send the screenshot to us on WhatsApp <span className="font-bold">(+923125343061)</span> to
            confirm your payment.
          </li>
        </ol>
      </div>

      <div className="flex justify-center gap-4">
        <a
          href={`https://wa.me/${+923125343061}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-green-500 text-white rounded-lg px-4 py-2 shadow-md hover:bg-green-600 transition"
        >
          <FaWhatsapp className="mr-2" /> Send Screenshot on WhatsApp number
        </a>

        <Button
          className="rounded-xl"
          onClick={() => {
            router.push('/home');
          }}
        >
          Back to home
        </Button>

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => {
            router.push('/');
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default PaymentSection;
