"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const config = require('./config');
const voting_app = require('./voting_app');

var MongoClient = require('mongodb').MongoClient;
const app = express();

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res, next) => {
    res.render('index', {title: 'Voting App'});
    next();
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

app.listen(config.PORT, () => console.log('Listening on port 3000!'));
