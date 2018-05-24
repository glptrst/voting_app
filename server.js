"use strict";
const express = require('express');
const mongodb = require('mongodb');
const config = require('./config');

var MongoClient = require('mongodb').MongoClient;
const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

MongoClient.connect(process.env.DBURI)
    .then(function(db){
	console.log('connected to db');
    }, function(err){
	console.log(err);
    }
	 );

app.get('/', (req, res, next) => {
    res.render('index', {title: 'Voting App'});
    next();
});

app.listen(config.PORT, () => console.log('Listening on port 3000!'));
