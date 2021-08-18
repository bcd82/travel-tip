import { storageService } from './storage.service.js';
import { utilService } from './util.service.js';

export const locService = {
  getLocs,
  createLocation,
};

const KEY = 'locationDB';
// const locs = storageService.load(KEY) || [];

const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
];

function createLocation(name, lat, lng, weather = '', updateAt = null) {
  locs.push({
    id: utilService.makeId(),
    name,
    lat,
    lng,
    weather,
    createdAt: getCurrTime(),
    updateAt,
  });
  storageService.save(KEY, locs);
}

function getLocs() {
  return new Promise((resolve, reject) => {resolve(locs)});
}

function getCurrTime() {
  var time = Date.now();
  return time;
}
