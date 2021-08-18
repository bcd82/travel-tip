export const weatherService = {
  getWeather,
};

const KEY_API = '7401219c1d7f9d5d5648e6876684795c';

function getWeather(lat, lng) {
  return axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${KEY_API}`
    )
    .then(res => res.data)
    .then(data => {
      return {
        name: data.name,
        icon: data.weather[0].icon,
        country: data.sys.country,
        temp: (data.main.temp - 273.15).toFixed(0),
      };
    });
}
