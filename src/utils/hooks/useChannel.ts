import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

import { pusher } from '../pusherConfig';

const useChannel = (type: string) => {
  const [channel, setChannel] = useState<Channel | null>(null);
  useEffect(() => {
    if (!type) return;
    const channel: Channel = pusher.subscribe(type);

    setChannel(channel);
  }, []);
  return channel;
};

export default useChannel;
