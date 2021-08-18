import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then(locs => {
    console.log('Locations:', locs);
    const strHTMLs = locs
      .map(loc => {
        return `<div class="cards">
                <div class="card">
                <h3></h3>
                <p>${loc.lat},\n${loc.lng}</p>
                <button class="${loc.name}" onclick="onGoLoc(this)">Go</button>
                <button class="${loc.name}" onclick="onDeleteLoc(this)">Delete</button>
                </div>
                </div>`;
      })
      .join('');
    document.querySelector('.locs').innerHTML = strHTMLs;
  });
}

function onGetUserPos() {
  getPosition()
    .then(pos => {
      console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch(err => {
      console.log('err!!!', err);
    });
}
function onPanTo() {
  console.log('Panning the Map');
  mapService.panTo(35.6895, 139.6917);
}
