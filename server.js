"use strict";
const express = require('express');
const mongodb = require('mongodb');
const config = require('./config');
const voting_app = require('./voting_app');

var MongoClient = require('mongodb').MongoClient;
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res, next) => {
    res.render('index', {title: 'Voting App'});
    next();
});

app.listen(config.PORT, () => console.log('Listening on port 3000!'));
