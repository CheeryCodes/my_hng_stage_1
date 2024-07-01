const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Mock location and temperature for testing
  const location = "Test City";
  const temperature = 25;

  const greeting = `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`;

  res.json({
    client_ip: clientIp,
    location: location,
    greeting: greeting
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
