"use strict";
var express = require('express');
var app = express();
var fs = require('fs');
var AVAILABLE_TYPES = ['info', 'critical'];
var port = 8000;
var formatValue = function (value) {
    return (value < 10 ? '0' : '') + value;
};
var formatTime = function (seconds) {
    var hours = Math.floor(seconds / (60 * 60));
    var min = Math.floor(seconds % (60 * 60) / 60);
    var sec = Math.floor(seconds % 60);
    return formatValue(hours) + ':' + formatValue(min) + ':' + formatValue(sec);
};
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.post('/api/events', function (req, res) {
    fs.readFile('events.json', 'utf8', function (err, content) {
        if (err) {
            return console.log(err);
        }
        var events = [];
        events = JSON.parse(content).events;
        console.log('events::', events);
        var filteredEvents = [];
        var types = req.query.type;
        var limit = req.query.limit;
        var offset = req.query.offset;
        if (types) {
            var queryTypes_2 = types.split(':');
            for (var _i = 0, queryTypes_1 = queryTypes_2; _i < queryTypes_1.length; _i++) {
                var type = queryTypes_1[_i];
                if (AVAILABLE_TYPES.indexOf(type) === -1) {
                    res.status(400).send("Incorrect type: " + types);
                    break;
                }
                else {
                    filteredEvents = events.filter(function (event) {
                        return queryTypes_2.indexOf(event.type) !== -1;
                    });
                }
            }
        }
        else {
            filteredEvents = events;
        }
        if (limit && !offset) {
            filteredEvents = filteredEvents.slice(0, limit);
        }
        else if (limit && offset) {
            var start = limit * offset;
            var end = limit * (+offset + 1);
            filteredEvents = filteredEvents.slice(start, end);
        }
        res.send({ 'events': filteredEvents });
    });
});
app.post('/status', function (req, res) {
    var uptime = process.uptime();
    res.send(formatTime(uptime));
});
app.use(function (req, res, next) {
    res.status(404).send('<h1>Page not found</h1>');
});
app.listen(port, function (err) {
    if (err) {
        return console.log('Error: ', err);
    }
    console.log("Server on listening on " + port + " port");
});
