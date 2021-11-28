import React from 'react';

interface ParkingSpotProps {
  lat: number;
  lng: number;
  reportedEmpty: boolean | null;
  parkingVehicle: string | null;
}

export const ParkingSpot = ({}: ParkingSpotProps) => {
  return <div style={{ width: 10, height: 10, backgroundColor: 'red', display: 'block', zIndex: 100 }}></div>;
};

export default ParkingSpot;
