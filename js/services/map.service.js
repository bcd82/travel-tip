import {
    locService
} from './loc.service.js'
import {
    storageService
} from './storage.service.js';

const API_KEY = 'AIzaSyA2s1lBcgcE1tt77bHML4P9QmcGl2oUJBs'; //TODO: Enter your API Key
const KEY = 'searchDb'

const gSearches = storageService.load(KEY) || {}

export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    getSearchPosition,
    getCityFromPos
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
                    zoom: 15                })
            // console.log('Map!', gMap);
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
    return Promise.resolve(getCityFromPos(lat,lng))
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve();
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load');
    });
}

function getSearchPosition(query) {
    if (gSearches[query]) return Promise.resolve(gSearches[query].results[0].geometry.location)
    console.log('getting from api')
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}k&key=${API_KEY}`
    return axios.get(url)
        .then(res => res.data)
        .then((data) => {
            gSearches[query] = data;
            storageService.save(KEY, gSearches)
            const pos = data.results[0].geometry.location
            return pos
        })

}

function getCityFromPos(lat,lng) {
    // debugger
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    console.log(lat,lng)
    return axios.get(url)
        .then(res => {
            console.log(res.data)
            return res.data
        }) 
        .then(({results}) => { 
            results[0].address_components[2].long_name})
}