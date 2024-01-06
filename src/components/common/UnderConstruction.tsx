import { AlertTriangle } from 'lucide-react';
import React from 'react';

const UnderConstruction = () => {
  return (
    <div className="text-center flex items-center justify-center flex-col">
      <AlertTriangle className="w-28 h-28 text-yellow-700" />
      <h2 className="text-2xl font-bold mb-2">
        This Page is Under Construction
      </h2>
      <p className="text-gray-700">
        {`We're sorry for the inconvenience. This page is currently being worked
        on and will be available soon.`}
      </p>
    </div>
  );
};

export default UnderConstruction;
