"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const session = require('express-session');
const app = express();

// use sessions for tracking logins
app.use(session({
    secret: 'test test test',
    resave: true,
    saveUninitialized: false
}));

// mongodb connection
mongoose.connect(config.DBURI);
const db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('views', './views');
app.set('view engine', 'pug');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));
