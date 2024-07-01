const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const OPENWEATHERMAP_API_KEY = '2131a804bd8c5ee5489cfb9a2d750917';

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name;
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Handling localhost IP
  if (clientIp === '::1' || clientIp === '127.0.0.1') {
    res.json({
      client_ip: clientIp,
      location: 'Test City',
      greeting: `Hello, ${visitorName}!, the temperature is 25 degrees Celsius in Test City`
    });
    return;
  }

  try {
    const locationResponse = await axios.get(`http://ipinfo.io/${clientIp}/json`);
    const city = locationResponse.data.city;

    if (!city) {
      return res.status(400).json({ error: 'Unable to determine city from IP address' });
    }

    try {
      const weatherResponse = await axios.get('http://api.openweathermap.org/data/2.5/weather', {
        params: {
          q: city,
          appid: OPENWEATHERMAP_API_KEY,
          units: 'metric'
        }
      });

      const temperature = weatherResponse.data.main.temp;

      if (temperature === undefined) {
        return res.status(400).json({ error: 'Unable to determine temperature for the city' });
      }

      res.json({
        client_ip: clientIp,
        location: city,
        greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`
      });
    } catch (weatherError) {
      res.status(500).json({ error: 'Error fetching weather data' });
    }
  } catch (locationError) {
    res.status(500).json({ error: 'Error fetching location data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
