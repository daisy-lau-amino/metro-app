import { makeRequest } from '../utils';

const STANDARD_ROUTE_KEY = 'standard-route';

export const getLiveTrainPositions = async () => {
  try {
    const { TrainPositions } = await makeRequest('GET', 'https://api.wmata.com/TrainPositions/TrainPositions?contentType=json');
    const normalTrains = [], otherTrains = [];
    TrainPositions.forEach(train => {
      if (train.ServiceType === 'Normal') {
        normalTrains.push(train);
      } else {
        otherTrains.push(train);
      }
    });
    return normalTrains.concat(otherTrains);
  } catch (ex) {
    console.error('Error: cannot get live train positions');
  }
  return [];
};

export const getStandardRoutes = async () => {
  // standard routes do not change frequently and should be cached
  try {
    const cache = JSON.parse(localStorage.getItem(STANDARD_ROUTE_KEY) || null);
    const nowUnix = new Date() / 1000;
    if (cache && nowUnix - cache.timestamp < 3600 * 24) {
      return cache.data;
    }
    const { StandardRoutes } = await makeRequest('GET', 'https://api.wmata.com/TrainPositions/StandardRoutes?contentType=json');
    localStorage.setItem(STANDARD_ROUTE_KEY, JSON.stringify({
      timestamp: nowUnix,
      data: StandardRoutes
    }));
    return StandardRoutes;
  } catch (ex) {
    console.error('Error: cannot get live standard routes');
  }
  return [];
};
