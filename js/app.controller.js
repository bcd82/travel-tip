import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage.service.js';
window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLoc = onDeleteLoc;
window.onGoLoc = onGoLoc;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      addClickListener();
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
  mapService.addMarker({
    lat: 32.0749831,
    lng: 34.9120554,
  });
}

function onGetLocs() {
  locService.getLocs().then(locs => {
    console.log('Locations:', locs);
    const strHTMLs = locs
      .map(loc => {
        return `
                <div class="card">
                <h3></h3>
                <p>${loc.lat},\n${loc.lng}</p>
                <button class="${loc.name}" onclick="onGoLoc(this)">Go</button>
                <button class="${loc.name}" onclick="onDeleteLoc(this)">Delete</button>
                </div>
                `;
      })
      .join('');
    document.querySelector('.cards').innerHTML = strHTMLs;
  });
}

function onGetUserPos() {
  getPosition()
    .then(position => {
      mapService.panTo(position.coords.latitude, position.coords.longitude);
    })
    .catch(err => {
      console.log('err!!!', err);
    });
}

function onPanTo(lat = 35.6895, lng = 139.6917) {
  console.log('Panning the Map');
  mapService.panTo(lat, lng);
}

function addClickListener() {
  const map = mapService.getMap();
  map.addListener('click', mapService.getLocation);
}

function onDeleteLoc(elBtn) {
  locService.getLocs().then(locs => {
    locs.forEach((loc, idx) => {
      if (loc.name === elBtn.classList[0]) {
        locs.splice(idx, 1);
      }
    });
    storageService.save('locationDB', locs);
    onGetLocs();
  });
}

function onGoLoc(elBtn) {
  locService.getLocs().then(locs => {
    locs.forEach(loc => {
      if (loc.name === elBtn.classList[0]) {
        onPanTo(loc.lat, loc.lng);
      }
    });
  });
}
