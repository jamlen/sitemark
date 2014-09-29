'use strict';

var http = require('http');
var express = require('express');
var errorHandler = require('errorhandler');

var app = express();

app.set('view engine', 'jade');
app.set('layout', true);
app.use(express.static(__dirname + '/public'));

if ('development' === app.get('env')) {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
}

if ('production' === app.get('env')) {
    app.use(errorHandler());
}

require('./routes/index')(app);
require('./routes/404')(app);

http.createServer(app).listen(process.env.PORT || 9111);
