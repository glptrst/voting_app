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
    if (req.body.email     &&
	req.body.username  &&
	req.body.password  &&
	req.body.confirmPassword
       ) {
	// confirm that user typed same password twice
	if (req.body.password !== req.body.confirmPassword) {
            let err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);
	}
	
	// create object with form input
	var userData = {
	    email: req.body.email,
	    username: req.body.username,
	    password: req.body.password
	};
	
	// TODO: insert doc into Mongo

    } else {
	let err = new Error('All fields required.');
	err.status = 400;
	return next(err);
    }
});

module.exports = router;
