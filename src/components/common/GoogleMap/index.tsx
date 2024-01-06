'use client';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import React, { useCallback, useRef } from 'react';

const SECRET_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
const containerStyle = {
  width: '100%',
  height: '85vh',
  padding: '40px',
};
const GoogleMapComp = () => {
  const mapRef = useRef();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: SECRET_KEY as string,
  });

  const onLoad = useCallback(function callback(map: any) {
    mapRef.current = map;
  }, []);

  const markers = [
    {
      id: 1,
      name: 'Chicago, Illinois',
      position: { lat: 41.881832, lng: -87.623177 },
      colorCondition: 'red',
    },
    {
      id: 2,
      name: 'Denver, Colorado',
      position: { lat: 39.739235, lng: -104.99025 },
      colorCondition: 'red',
    },
    {
      id: 3,
      name: 'Los Angeles, California',
      position: { lat: 34.052235, lng: -118.243683 },
      colorCondition: 'purple',
    },
    {
      id: 4,
      name: 'New York, New York',
      position: { lat: 40.712776, lng: -74.005974 },
      colorCondition: 'purple',
    },
  ];

  return (
    <div>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 41.881832, lng: -87.623177 }}
          zoom={4}
          onLoad={onLoad}
        >
          {markers.map(({ id, position, colorCondition }) => {
            let iconUrl;

            // Set the icon color based on the condition
            switch (colorCondition) {
              case 'red':
                iconUrl = '/assets/images/truck_orange.svg'; // Modify the SVG with fill="red"
                break;
              case 'purple':
                iconUrl = '/assets/images/truck_purple.svg'; // Modify the SVG with fill="green"
                break;
              default:
                iconUrl = '/assets/images/truck_purple.svg'; // Provide a default icon path
                break;
            }

            return (
              <Marker
                key={id}
                position={position}
                icon={{
                  url: iconUrl,
                  scaledSize: new window.google.maps.Size(60, 60),
                }}
              />
            );
          })}
        </GoogleMap>
      )}
    </div>
  );
};

export default GoogleMapComp;
