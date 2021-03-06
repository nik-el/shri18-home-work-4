const express = require('express');
const app = express();
const fs = require('fs');

const AVAILABLE_TYPES = ['info', 'critical'];

const port = process.env.PORT || 8000;

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
  fs.readFile('events.json', 'utf8', (err, data) => {
    if (err) {
      return console.warn('error: ', err);
    }

    let events = [];
    try {
      events = JSON.parse(data).events;
    } catch(e) {
      console.warn('Ошибка чтения данных:', e);
    }

    let filteredEvents = [];
    const types = req.query.type;
    const limit = req.query.limit;
    const offset = req.query.offset;

    if (types) {
      const queryTypes = types.split(':');

      for (const type of queryTypes) {
        if (!AVAILABLE_TYPES.includes(type)) {
          res.status(400).send(`Incorrect type: ${types}`);
          break;
        } else {
          filteredEvents = events.filter(event => {
            return queryTypes.includes(event.type);
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
});

app.post('/api/link/read', (req, res) => {
  fs.readFile('link.json', 'utf8', (err, data) => {
    if (err) {
      return console.warn('error: ', err);
    }

    let lastLink = '';
    try {
      lastLink = JSON.parse(data).link;
    } catch(e) {
      console.warn('Ошибка чтения данных:', e);
    }

    res.send({'lastLink': lastLink});
  })
});

app.post('/api/link/save', (req, res) => {
  let lastLink;

  try {
    lastLink = JSON.stringify({'link': req.query.link});
  } catch(e) {
    console.warn('Ошибка записи данных:', e);
  }

  fs.writeFile('link.json', lastLink , 'utf8', (err, data) => {
    if (err) {
      return console.warn('error: ', err);
    }

    res.status(200).send('link saved');  })
});

app.post('/status', (req, res) => {
  const uptime = process.uptime();
  res.send(formatTime(uptime))
});

app.use( (req, res) => {
  res.status(404).send('<h1>Page not found</h1>');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Error: ', err);
  }

  console.log(`Server on listening on ${port} port`);
});