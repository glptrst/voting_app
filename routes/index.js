var express = require('express');
var router = express.Router();
// require the schema we created
var User = require('../models/user');

// GET /login
router.get('/login', function(req, res, next) {
    return res.render('login', { title: 'Log in' });
});

// POST /login
router.post('/login', function(req, res, next) {
    return res.send('Logged in');
});

// GET /register
router.get('/register', function(req, res, next) {
    return res.render('register', { title: 'Sign Up' });
});

// POST /register
router.post('/register', function(req, res, next) {
    if (req.body.email     &&
	req.body.username      &&
        req.body.password  &&
        req.body.confirmPassword) {

	if (req.body.password !== req.body.confirmPassword) {
	    let err = new Error('Passwords do not match');
	    err.status = 400;
	    return next(err);
	} 

	// create object with form input
	var userData = {
	    email: req.body.email,
	    username: req.body.username,
	    password: req.body.password
	};

	console.log('post request received');

	// use schema's `create` method to insert document into Mongo
	User.create(userData, function(error, user){
	    if (error) {
		console.log('hello1');
		return next(error);
	    } else {
		console.log('hello2');
		return res.redirect('/profile');
	    }
	});

    } else {
	let err = new Error('All fields are required.');
	err.status = 400;
	return next(err);
    }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
