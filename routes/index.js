var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// require the schema we created
var User = require('../models/user');
var Poll = require('../models/poll');
var mid = require('../middleware');

// POST /delete_poll
router.post('/delete_poll', function(req, res, next) {
    Poll.findOne({ title: req.body.pollTitle }, function(err, poll) {
	if (err) {
	    return next(err);
	} else {
	    User.findById(req.session.userId, function(error, user) {
		if (error) {
		    return next(err);
		} else {
		    if (user.username === poll.author) {
			// delete poll
			Poll.deleteOne({ title: req.body.pollTitle }, function(err){
			    if (err) return next(err);
			    else console.log('Poll deleted correctly');
			});
		    } else {
			// you are not authorized
			res.status(401);
			res.render('error', {
			    message: 'Unauthorized: you are not the author of this poll!',
			    error: {}
			});
		    }
		}
	    });
	}
    });
});

// GET /poll
router.get('/poll', function(req, res, next) {
    let param = req.query.title;
    Poll.findOne({ title: param }, function(err, poll) {
	if (err) {
	    return next(err);
	} else {
	    if (req.session.userId) {
		User.findById(req.session.userId, function(error, user) {
		    if (error) {
			return next(error);
		    } else {
			return res.render('poll', {
			    title: poll.title,
			    poll_title: poll.title,
			    poll_options: poll.options,
			    author: poll.author === user.username
			});
		    }
		});
	    } else {
		return res.render('poll', {
		    title: poll.title,
		    poll_title: poll.title,
		    poll_options: poll.options,
		    author: false
		});
	    }
	}
    });
});

// POST /poll
router.post('/poll', mid.requiresLogin, function(req, res, next) {
    let pollTitle = req.body.option.split('<++>')[0]; 
    let optionTitle = req.body.option.split('<++>')[1]; 

    // check if user has already voted for this poll
    User.findById(req.session.userId, function(error, user) {
	if (error) {
	    return next(error);
	} else {
	    if (user.pollsHasParticipatedIn.includes(pollTitle)) {
		let err = new Error('You can vote only once in a poll!');
		err.status = 403;
		return next(err);
	    } else {
		// update user's pollsHasParticipatedIn array
		user.pollsHasParticipatedIn.push(pollTitle);
		user.save();

		// add vote to db
		Poll.findOne({title: pollTitle}, function(err, poll) {
		    if (err) {
			return next(err);
		    }
		    poll.options.forEach(function(option){
			if (option.title === optionTitle) {
			    option.votes += 1;
			}
		    });
		    poll.save();
		    return res.render('poll', { title: pollTitle,
						poll_title: pollTitle,
						poll_options: poll.options});
		});
	    }
	}
    });
});

// GET /polls_list
router.get('/polls_list', function(req, res, next) {
    // get polls
    Poll.find({}, function(err, polls) {
	if (err) {
	    return next(err);
	}
	return res.render('polls_list', { title: 'Polls', polls: polls});
    });
});

// GET /createpoll
router.get('/createpoll', mid.requiresLogin, function(req, res, next) {
    User.findById(req.session.userId, function(error, user){
	return res.render('createpoll', { title: 'Create New Poll', author: user.username});
    });
});

// POST /createpoll
router.post('/createpoll', mid.requiresLogin, function (req, res, next) {
    let title = req.body.title;
    // put options in an array using split and remove, if any, empty ones using filter
    let options = req.body.options.split(/\r?\n/).filter(a => a !== '');

    // 9 options are the limit!
    if (options.length > 9) {
	let err = new Error('You cannot put more than 9 options.');
	return next(err);
    }
    
    User.findById(req.session.userId, function(error, user){
	// make string 'foo' into object {title: 'foo'}
	for (var i = 0; i < options.length; i++) {
	    options[i] = {title: options[i], votes: 0};
	}

	let poll = {
	    title: title,
	    author: user.username,
	    options: options
	};

	// use schema's `create` method to insert document into Mongo
	Poll.create(poll, function(error, doc) {
     	    if (error) {
     		return next(error);
     	    } else {
     		return res.redirect('/polls_list');
     	    }
	});
    });
});

// GET /profile
router.get('/profile', mid.requiresLogin, function(req, res, next) {
    User.findById(req.session.userId, function(error, user) {
	if (error) {
	    return next(error);
	} else {
	    //return res.render('my_polls', {title: 'my polls', myPolls: user.pollsHasParticipatedIn});
	    Poll.find({author: user.username}, function(err, polls){
		if (err) {
		    return next(err);
		} else {
		    let userPolls = [];
		    for (let i = 0; i < polls.length; i++) {
			userPolls.push(polls[i].title);
		    }
		    return res.render('profile', {title: 'Profile', username: user.username, email: user.email, myPolls: userPolls});
		}
	    });
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
		var err = new Error(error || 'Wrong email or password');
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

	// encript password
	bcrypt.hash(req.body.password, 10, function(err, hash) {
	    if (err) {
		return next(err);
	    }

	    // create object with form input
	    var userData = {
		email: req.body.email,
		username: req.body.username,
		password: hash
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
