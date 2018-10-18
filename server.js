const express = require('express');
const app = express();
const fs = require('fs');

const AVAILABLE_TYPES = ['info', 'critical'];

const port = 3100;

const formatValue = (value) => {
  return (value < 10 ? '0' : '') + value;
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / (60*60));
  const min = Math.floor(seconds % (60*60) / 60);
  const sec = Math.floor(seconds % 60);

  return formatValue(hours) + ':' + formatValue(min) + ':' + formatValue(sec);
};

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/events', (req, res) => {
  let {events} = JSON.parse(fs.readFileSync('events.json', 'utf8'));
  let filteredEvents = [];
  const types = req.query.type;
  const limit = req.query.limit;
  const offset = req.query.offset;

  if (types) {
    const queryTypes = types.split(':');

    for (const type of queryTypes) {
      if (AVAILABLE_TYPES.indexOf(type) === -1) {
        res.status(400).send(`Incorrect type: ${types}`);
        break;
      } else {
        filteredEvents = events.filter(event => {
          return queryTypes.indexOf(event.type) !== -1;
        });
      }
    }
  } else {
    filteredEvents = events;
  }

  if (limit && !offset) {
    filteredEvents = filteredEvents.slice(0, limit)
  } else if (limit && offset) {
    const start = limit * offset;
    const end = limit * (+offset + 1);
    filteredEvents = filteredEvents.slice(start, end);
  }

  res.send({'events': filteredEvents});
});

app.post('/api/status', (req, res) => {
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