import {locService} from './loc.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
}


var gMap;

// window.mapService = mapService;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: {
                        lat,
                        lng
                    },
                    zoom: 15
                })
            console.log('Map!', gMap);
            addClickListener()
        })
}

function getMap() {
    return gMap
};

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = 'AIzaSyCFyoGS4I6uoOKNtMDd5nLMcv-n8jECKFQ'; //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}

const addClickListener = () => {
    const map = gMap
    map.addListener("click", getLocation);
}

const getLocation =  (mapsMouseEvent) => {
    let pos = JSON.parse(JSON.stringify(mapsMouseEvent.latLng))
    console.log(pos)
}

function getUserPos  ()  {
    if (navigator.geolocation) {
        let userPos = {}
        navigator.geolocation.getCurrentPosition((position)=>{
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            panTo(pos)
        });
    }
}