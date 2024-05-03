import Dot from './Dot';

const WebhookStatus = (props: any) => {
  return (
    <div className="flex gap-1 items-center">
      <Dot color={props.status?.toLowerCase() === 'ok' ? '#d6ecb9' : '#ff0000'} />
      <span>{props.status}</span>
    </div>
  );
};

export default WebhookStatus;
