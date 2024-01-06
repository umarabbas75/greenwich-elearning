import React from 'react';

import getStatusColor from '@/utils/getStatusColor';
import { Status } from '@/utils/getStatusColor';

import Dot from './Dot';

type props = {
  status: Status;
};

const StatusComp = (props: props) => {
  return (
    <div className="flex gap-1 items-center">
      <Dot color={getStatusColor(props.status)} />
      <span>{props.status}</span>
    </div>
  );
};

export default StatusComp;
