const express = require('express');
const app = express();
const fs = require('fs');

const AVAILABLE_TYPES = ['info', 'critical'];

const port = 3000;

const formatValue = (value) => {
  return (value < 10 ? '0' : '') + value;
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / (60*60));
  const min = Math.floor(seconds % (60*60) / 60);
  const sec = Math.floor(seconds % 60);

  return formatValue(hours) + ':' + formatValue(min) + ':' + formatValue(sec);
};

app.get('/api/events', (req, res) => {
  const filteredEvents = [];

  if (req.query.type) {
    const queryTypes = req.query.type.split(':');

    for (const type of queryTypes) {
      if (AVAILABLE_TYPES.indexOf(type) === -1) {
        res.status(400).send(`Incorrect type: ${req.query.type}`);
        break;
      } else {
        const obj = JSON.parse(fs.readFileSync('events.json', 'utf8'));
        obj.events.forEach(event => {
          if (queryTypes.indexOf(event.type) !== -1) {
            filteredEvents.push(event)
          }
        });
      }
    }

    if (filteredEvents.length) {
      res.send(filteredEvents)
    }
  } else {
    const obj = JSON.parse(fs.readFileSync('events.json', 'utf8'));
    res.send(obj)
  }
});

app.get('/api/status', (req, res) => {
  const uptime = process.uptime();
  res.send(formatTime(uptime))
});

app.use( (req, res, next) => {
  res.status(404).send('<h1>Page not found</h1>');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Error: ', err);
  }

  console.log(`Server on listening on ${port} port`);
});