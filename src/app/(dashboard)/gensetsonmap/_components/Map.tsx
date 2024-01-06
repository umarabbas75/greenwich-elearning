'use client';

import { atom, useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import Pusher, { Channel } from 'pusher-js';
import React, { useEffect, useState } from 'react';

export type pusherData = {
  genset_id: number | string;
  lat: number | string;
  lng: number | string;
  position?: [number | string, number | string];
  customer: string;
  driver: string;
  status: string;
};

const OpenStreetMap = dynamic(
  () => import('@/components/common/OpenStreetMap'),
  {
    ssr: false, // Disable server-side rendering
  },
);

const key = process.env.NEXT_PUBLIC_PUSHER_KEY as string;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string;

const pusher = new Pusher(key, {
  cluster: cluster,
  authEndpoint: `${process.env.NEXT_PUBLIC_API_URI}/api/authenticate-pusher/`,
});

export const gensetLocationsAtom = atom<pusherData[]>([]);

const Map = ({ data }: any) => {
  const [gensetLocAtom, setGensetLocAtom] = useAtom(gensetLocationsAtom);
  const [gensetLocations, setGensetLocations] = useState<pusherData[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    return () => {
      setGensetLocAtom([]);
    };
  }, []);

  useEffect(() => {
    console.log('gensetLocAtommap', gensetLocAtom, data, session);
    if (gensetLocAtom?.length) {
      setGensetLocations((prev) => [...prev, ...gensetLocAtom]);
    } else if (data) {
      const tempData = JSON.parse(JSON.stringify(data));
      const mapData = tempData?.map((dt: any) => {
        const gensetLoc = {
          genset_id: '',
          lat: dt?.current_location?.lat,
          lng: dt?.current_location?.lng,
          driver: dt?.name,
          customer: dt?.customer,
          status: dt?.status,
        };
        return gensetLoc;
      });
      setGensetLocations(mapData);
    }
  }, [gensetLocAtom, data]);

  useEffect(() => {
    const channel: Channel = pusher.subscribe('private-genset');
    console.log('channel', channel);
    if (channel) {
      channel.bind('updated-genset-location', (data: any) => {
        console.log('updated-genset-loaction', data);
        let updatedArray: pusherData[] = [...gensetLocations];
        const newItem = data?.data;
        if (
          newItem?.customer_id !== session?.user?.customer_id &&
          session?.user?.role !== 'Admin'
        ) {
          return;
        }

        const indexToUpdate = gensetLocations.findIndex(
          (item: pusherData) => item.genset_id === newItem.genset_id,
        );
        console.log({ indexToUpdate });
        if (indexToUpdate !== -1) {
          // Update the array with the new object
          updatedArray[indexToUpdate] = newItem;
        } else {
          updatedArray = [...gensetLocations, newItem];
        }
        console.log({ updatedArray });
        setGensetLocations([...updatedArray]);
      });
    }
  }, [pusher, gensetLocations]);

  console.log({ gensetLocations });

  return (
    <div>
      {/* <GoogleMapComp /> */}

      <div className="flex gap-3 flex-col">
        <span className="font-bold text-xl text-gray-700">Gensets On Map</span>
        <OpenStreetMap gensetLocations={gensetLocations} />
      </div>
    </div>
  );
};

export default Map;
