import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import segments from './data/segments.json';
import L from 'leaflet';
import StatisticsOverlay from './components/Statistics';
import { BACKEND_URL, JAWG_ACCESS_TOKEN } from '../../config';
const redCarIcon = L.divIcon({ html: '🚕', className: 'dummy' });
const blueCarIcon = L.divIcon({ html: '🚙', className: 'dummy' });

const RED = '#ef476f';
const GREEN = '#06d6a0';

const getParkingStyle = (spot: any) => {
  const reported_empty = spot['reported_empty'];
  const parking_vehicle = spot['parking_vehicle'];
  const style = { weight: 2, color: RED, opacity: 1, fillOpacity: 1 } as any;

  if (reported_empty === null) {
    style['opacity'] = 0.3;
    style['fillOpacity'] = 0.3;
  } else {
    style['opacity'] = 1;
    style['fillOpacity'] = 1;
  }

  if (reported_empty === true) {
    style['color'] = GREEN;
    // style['color'] = 'white';
  }

  if (reported_empty === false) {
    style['color'] = RED;
    // style['color'] = 'white';
  }

  if (reported_empty !== false && reported_empty !== true && reported_empty !== null) {
    console.log(reported_empty);
  }

  if (!parking_vehicle) {
    style['fillColor'] = GREEN;
  } else {
    style['fillColor'] = 'transparent';
  }

  return style;
};

export const MapPage = () => {
  const [simulationState, setSimulationState] = useState<any>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      //assign interval to a variable to clear it.
      fetch(BACKEND_URL)
        .then((data) => data.json())
        .then((obj) => {
          setSimulationState(obj);
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(intervalId); //This is important
  }, []);

  const occupiedSegmentIds = useMemo(() => {
    if (!simulationState) {
      return [];
    }
    return Object.keys((simulationState as any)['vehicles_on_segments'] || {});
  }, [simulationState]);

  if (simulationState === null) {
    return null;
  }


  return (
    <Fragment>
      <StatisticsOverlay statistics={simulationState?.statistics} />
      <MapContainer
        center={[47.503767, 19.048542]}
        zoom={18}
        scrollWheelZoom={true}
        maxZoom={30}
        style={{ width: '100%', height: '100vh' }}
      >
        <TileLayer
          maxZoom={30}
          url={`https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=${JAWG_ACCESS_TOKEN}`}
          attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {Object.values((simulationState as any)['parking_spots'])
          //.filter((spot: any) => spot['parking_vehicle'] == null)
          .map((spot: any) => (
            <Circle
              center={[spot.lon, spot.lat]}
              pathOptions={getParkingStyle(spot)}
              radius={2}
              key={`${spot.lat}-${spot.lon}`}
            />
          ))}

        {segments
          .filter((segment) => occupiedSegmentIds.includes(segment['id']))
          .map((segment) => (
            <Fragment key={`${segment.lat}-${segment.lon}`}>
              <Marker
                position={[segment.lon, segment.lat]}
                icon={
                  (simulationState as any)['vehicles_on_segments'][segment['id']].has_sensor
                    ? redCarIcon
                    : blueCarIcon
                }
                opacity={1}
              />
              {(simulationState as any)['vehicles_on_segments'][segment['id']].state !==
                'TRAVELLING' && (
                <Circle
                  center={[segment.lon, segment.lat]}
                  pathOptions={{
                    weight: 2,
                    color: 'white',
                  }}
                  radius={5}
                />
              )}
            </Fragment>
          ))}
      </MapContainer>
    </Fragment>
  );
};

export default MapPage;
