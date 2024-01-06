import { Status } from '@/utils/getStatusColor';

import Dot from './Dot';

type props = {
  status: Status;
};

const WebhookStatus = (props: props) => {
  return (
    <div className="flex gap-1 items-center">
      <Dot
        color={props.status?.toLowerCase() === 'ok' ? '#d6ecb9' : '#ff0000'}
      />
      <span>{props.status}</span>
    </div>
  );
};

export default WebhookStatus;
