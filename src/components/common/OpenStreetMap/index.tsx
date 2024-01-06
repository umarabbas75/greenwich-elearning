'use client';
import { LatLngTuple, divIcon } from 'leaflet';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

import { pusherData } from '@/app/(dashboard)/gensetsonmap/_components/Map';

import StatusComp from '../Status';

const iconMarkup = (status: string) => {
  console.log('stattttt', status);
  return renderToStaticMarkup(
    status === 'Offline' ? (
      <img src="/assets/images/truck_red.png" style={{ width: '35px' }} />
    ) : (
      <img src="/assets/images/truck_green.png" style={{ width: '35px' }} />
    ),
  );
};

const customMarkerIcon = (status: string) =>
  divIcon({
    html: iconMarkup(status),
  });

type props = {
  gensetLocations: pusherData[];
};
const OpenStreetMap = ({ gensetLocations }: props) => {
  if (gensetLocations?.length > 0) {
    gensetLocations = gensetLocations?.map((item) => {
      return {
        ...item,
        text: item.genset_id,
        position: [item.lat, item.lng],
        iconUrl: customMarkerIcon(item.status),
      };
    });
  }
  console.log({ gensetLocations });

  if (!gensetLocations.length)
    return (
      <MapContainer
        center={[51.8537, 4.2999]}
        zoom={10}
        zoomControl={false}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&amp;copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="topright" />
      </MapContainer>
    );

  return (
    <div style={{ zIndex: 10 }}>
      <MapContainer
        center={gensetLocations?.[0]?.position as LatLngTuple}
        zoom={10}
        zoomControl={false}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {gensetLocations?.map((marker: any, index) => (
          <Marker
            key={index}
            position={marker.position as LatLngTuple}
            icon={marker.iconUrl}
            /* icon={marker.iconUrl} */
          >
            <Popup>
              <div className="pt-2 space-y-1">
                {marker?.genset_id && (
                  <div className="flex justify-between gap-2">
                    <div className="text-black">Genset No:</div>
                    <div className="text-gray-500">{marker?.genset_id}</div>
                  </div>
                )}
                <div className="flex justify-between gap-2">
                  <div className="text-black">Driver Name:</div>
                  <div className="text-gray-500">{marker?.driver}</div>
                </div>
                <div className="flex justify-between gap-2">
                  <div className="text-black">Customer:</div>
                  <div className="text-gray-500">{marker?.customer}</div>
                </div>
                <div className="flex justify-between gap-2">
                  <div className="text-black">Lat:</div>
                  <div className="text-gray-500">{marker?.lat}</div>
                </div>
                <div className="flex justify-between gap-2">
                  <div className="text-black">Lng:</div>
                  <div className="text-gray-500">{marker?.lng}</div>
                </div>
                <div className="flex justify-between gap-2">
                  <div className="text-black">Location:</div>
                  <div className="text-gray-500">
                    {marker?.location?.display_name}
                  </div>
                </div>
                <div className="flex gap-1 items-center">
                  <StatusComp status={marker.status} />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <ZoomControl position="topright" />
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;
