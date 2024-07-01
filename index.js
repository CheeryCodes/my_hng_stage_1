const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  try {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const locationResponse = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IP_GEOLOCATION_API_KEY}&ip=${clientIp}`);
    const locationData = locationResponse.data;
    
    const city = locationData.city;
    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.WEATHER_API_KEY}`);
    const weatherData = weatherResponse.data;
    
    const temperature = weatherData.main.temp;
    const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${city}`;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: greeting
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
