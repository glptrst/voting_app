var express = require('express');
var router = express.Router();

// GET /
router.get('/', function(req, res, next) {
    return res.render('index', { title: 'Voting App' });
});


// GET /register
router.get('/register', function(req, res, next) {
    return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
    return res.send('User Created');
});

module.exports = router;
