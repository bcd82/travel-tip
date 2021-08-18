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
window.onSearch = onSearch;

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
      .map((loc, idx) => {
        return `
                <div class="card">
                <h3></h3>
                <p>${loc.lat},\n${loc.lng}</p>
                <button class="${idx}" onclick="onGoLoc(this)">Go</button>
                <button class="${idx}" onclick="onDeleteLoc(this)">Delete</button>
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
  map.addListener('click', onGetLocation);
}

function onGetLocation(mapsMouseEvent)  {
    let pos = JSON.parse(JSON.stringify(mapsMouseEvent.latLng))
    console.log(pos)
}

function onDeleteLoc(elBtn) {
  locService.getLocs().then(locs => {
    locs.splice(elBtn.classList[0], 1);
    storageService.save('locationDB', locs);
    onGetLocs();
  });
}

function onGoLoc(elBtn) {
  locService.getLocs().then(locs => {
    onPanTo(locs[elBtn.classList[0]].lat, locs[elBtn.classList[0]].lng);
  });
}

function onSearch(ev) {
    ev.preventDefault()
    const query = document.querySelector('#search').value;
    mapService.getSearchPosition(query)
    .then(pos => onPanTo(pos))
    
}
