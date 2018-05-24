"use strict";
const express = require('express');
const config = require('./config');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res, next) => {
    res.render('index', {title: 'Voting App'});
    next();
});

app.listen(config.PORT, () => console.log('Listening on port 3000!'));
