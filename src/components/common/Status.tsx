import React from 'react';

import getStatusColor from '@/utils/getStatusColor';
// import { Status } from '@/utils/getStatusColor';

import Dot from './Dot';

const StatusComp = (props: any) => {
  return (
    <div className="flex gap-1 items-center">
      <Dot color={getStatusColor(props.status)} />
      <span>{props.status === 'inActive' ? 'In Active' : 'Active'}</span>
    </div>
  );
};

export default StatusComp;
