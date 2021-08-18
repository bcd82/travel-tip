import { storageService } from './storage.service.js';
import { utilService } from './util.service.js';

export const locService = {
  getLocs,
  createLocation,
};

const KEY = 'locationDB';
// const locs = storageService.load(KEY) || [];

const locs = storageService.load(KEY) || [];

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
  return new Promise((resolve, reject) => {
    resolve(locs);
  });
}

function getCurrTime() {
  var time = Date.now();
  return time;
}
