const express = require('express');
const app = express();
const fs = require('fs');

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
  const obj = JSON.parse(fs.readFileSync('events.json', 'utf8'));
  res.send(obj)
});

app.get('/api/status', (req, res) => {
  const uptime = process.uptime();
  res.send(formatTime(uptime))
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

console.log('Listen on 3000 port');
app.listen(3000);