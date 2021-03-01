import { makeRequest } from '../utils';

const STATION_INFO_KEY = 'station-info';

export const getLines = async () => {
  try {
    const { Lines } = await makeRequest('GET', 'https://api.wmata.com/Rail.svc/json/jLines');
    return Lines;
  } catch (ex) {
    console.error('Error: cannot get lines info');
  }
  return [];
};

export const getAllStations = async () => {
  // station information does not change frequently and should be cached
  try {
    const cache = JSON.parse(localStorage.getItem(STATION_INFO_KEY) || null);
    const nowUnix = new Date() / 1000;
    if (cache && nowUnix - cache.timestamp < 3600 * 24) {
      return cache.data;
    }
    const { Stations } = await makeRequest('GET', 'https://api.wmata.com/Rail.svc/json/jStations');
    localStorage.setItem(STATION_INFO_KEY, JSON.stringify({
      timestamp: nowUnix,
      data: Stations
    }));
    return Stations;
  } catch (ex) {
    console.error('Error: cannot get information of all stations');
  }
  return [];
};

export const getLineNameByCode = (lines, code) => {
  if (!code) {
    return '-';
  }
  const targetLine = lines.find(line => line.LineCode === code) || {};
  return targetLine.DisplayName || '-';
};

const circuitIdToLocationCache = {};

export const getTrainCurrentLocation = (stations, routes, lineCode, circuitId) => {
  if (circuitIdToLocationCache[circuitId]) {
    // if circuitId-to-location pair is found in cache, return it to save operations
    return circuitIdToLocationCache[circuitId];
  }

  let currentLocation;
  const targetRoutes = lineCode
    ? routes.filter(route => route.LineCode === lineCode)
    : routes;
  targetRoutes.some(({ TrackCircuits }) => {
    const circuitIndex = TrackCircuits.findIndex(trackCircuit => trackCircuit.CircuitId === circuitId);
    if (circuitIndex > -1) {
      if (TrackCircuits[circuitIndex].StationCode) {
        // train is in a station
        currentLocation = getStationByCode(stations, TrackCircuits[circuitIndex].StationCode);
      } else {
        // train is at somewhere between two stations
        let previousStation, nextStation;
        for (let i = circuitIndex - 1; i >= 0; i--) {
          if (TrackCircuits[i].StationCode) {
            previousStation = getStationByCode(stations, TrackCircuits[i].StationCode);
            break;
          }
        }
        for (let i = circuitIndex + 1; i < TrackCircuits.length; i++) {
          if (TrackCircuits[i].StationCode) {
            nextStation = getStationByCode(stations, TrackCircuits[i].StationCode);
            break;
          }
        }
        currentLocation = `Between ${previousStation} and ${nextStation}`;
      }
      return true;
    }
    return false;
  });
  if (currentLocation) {
    circuitIdToLocationCache[circuitId] = currentLocation;
  }
  return currentLocation || "Unknown";
};

export const getStationByCode = (stations, code) => {
  if (!code) {
    return '-';
  }
  const targetStation = stations.find(station => station.Code === code) || {};
  return targetStation.Name || '-';
};
