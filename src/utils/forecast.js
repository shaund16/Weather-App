const request = require('postman-request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=0b74ba71d59c45738b548fb56e78267e&query=${latitude},${longitude}`;

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback('Unable to connect to weather services', undefined);
    } else if (!body.success && body.error) {
      callback('Unable to find the location.', undefined);
    } else {
      const temperature = body.current.temperature;
      const feelsLike = body.current.feelslike;
      let forecastData = `${body.current.weather_descriptions[0]}. It is currently ${temperature} degrees out, but feels like ${feelsLike} degrees. `;
      forecastData += `The humidity is ${body.current.humidity}% and the wind direction is towards ${body.current.wind_dir}.`;
      callback(undefined, {
        temperature,
        feelsLike,
        forecastData,
      });
    }
  });
};
module.exports = forecast;
