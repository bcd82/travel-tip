import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';
import { storageService } from './services/storage.service.js';
import { weatherService } from './services/weather.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.renderLocs = renderLocs;
window.onGetUserPos = onGetUserPos;
window.onDeleteLoc = onDeleteLoc;
window.onGoLoc = onGoLoc;
window.onCopyLink = onCopyLink;
window.onSearch = onSearch;

let isCopyLink = false;

function onInit() {
  const locsUrl = onGetLocsFromUrl();
  mapService
    .initMap(locsUrl[0], locsUrl[1])
    .then(() => {
      addClickListener();
    })
    .catch(() => console.log('Error: cannot init map'));
  renderLocs();
  onGetWeather(32.0749831, 34.9120554);
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

function renderLocs() {
  locService.getLocs().then(locs => {
    console.log('Locations:', locs);
    const strHTMLs = locs
      .map((loc, idx) => {
        return `
                <div class="card">
                <h3></h3>
                <p>${loc.name}</p>
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
  map.addListener('click', onClickMap);
}

function onClickMap(mapsMouseEvent) {
  let pos = JSON.parse(JSON.stringify(mapsMouseEvent.latLng));
  const name = prompt('Please choose a name');
  renderLocs();
  console.log(pos);
  onGetWeather(pos.lat, pos.lng).then(weather => {
    locService.createLocation(name, pos.lat, pos.lng, weather);
  });
  renderWeather(name);
}

function onDeleteLoc(elBtn) {
  locService.getLocs().then(locs => {
    locs.splice(elBtn.classList[0], 1);
    storageService.save('locationDB', locs);
    renderLocs();
  });
}

function onGoLoc(elBtn) {
  locService.getLocs().then(locs => {
    onPanTo(locs[elBtn.classList[0]].lat, locs[elBtn.classList[0]].lng);
  });
}

function onCopyLink(ev) {
  ev.preventDefault();
  if (isCopyLink) return;
  isCopyLink = true;
  getPosition().then(position => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    navigator.clipboard.writeText(
      `${document.location.href}index.html?lat=${lat}&lng=${lng}`
    );
  });
}

function onSearch(ev) {
  ev.preventDefault();
  const query = document.querySelector('#search').value;
  mapService.getSearchPosition(query).then(pos => onPanTo(pos));
}

function onGetLocsFromUrl() {
  const queryString = window.location.search;
  console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const values = urlParams.values();
  const latLng = [];
  for (const value of values) {
    latLng.push(+value);
  }
  return latLng;
}

function onGetWeather(lat, lng) {
  return weatherService.getWeather(lat, lng);
}

function renderWeather(name) {
  locService.getLocs().then(locs => {
    const strHTML = locs.filter(loc => {
      if (loc.name === name)
        return `<h3>${loc.weather.country}</h3>
            <h4>${loc}</h4>
            <h5>${loc}</h5>
            <img src="http://openweathermap.org/img/w/${loc}.png"
            `;
    });
  });

  document.querySelector('.weather-container').innerHTML = strHTML;
}
