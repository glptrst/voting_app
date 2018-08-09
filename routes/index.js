var express = require('express');
var router = express.Router();
// require the schema we created
var User = require('../models/user');
var Poll = require('../models/poll');
var mid = require('../middleware');

// GET /createpoll
router.get('/createpoll', function(req, res, next) {
    return res.render('createpoll', { title: 'Create New Poll' });
});

// POST /createpoll
router.post('/createpoll', function (req, res, next) {
    // TODO

});

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
    User.findById(req.session.userId)
	.exec(function(error, user) {
	    if (error) {
		return next(error);
	    } else {
		return res.render('profile', { title: 'Profile', username: user.username, email: user.email});
	    }
	});
});

// GET /logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
	// delete session object
	req.session.destroy(function(err) {
	    if (err) {
		return next(err);
	    } else {
		return res.redirect('/');
	    }
	});
    }
});

// GET /login
router.get('/login', mid.loggedOut, function(req, res, next) {
    return res.render('login', { title: 'Log in' });
});

// POST /login
router.post('/login', function(req, res, next) {
    if (req.body.email && req.body.password) {
	User.authenticate(req.body.email, req.body.password, function (error, user) {
	    if (error || !user) {
		var err = new Error('Wrong email or password');
		err.status = 401;
		return next(err);
	    } else {
		req.session.userId = user._id;
		return res.redirect('/profile');
	    }
	});
    } else {
	let err = new Error('Email and password required');
	err.status = 401;
	return next(err);
    }
});

// GET /register
router.get('/register', mid.loggedOut, function(req, res, next) {
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

	// use schema's `create` method to insert document into Mongo
	User.create(userData, function(error, user){
	    if (error) {
		return next(error);
	    } else {
		req.session.userId = user._id; // automatically log in when user registers
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

module.exports = router;
