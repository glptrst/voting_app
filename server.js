var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var app = express();

// uses sessions for tracking logins
app.use(session({
    secret: 'viri cu ta ficca', // secret, which add another level of
				// security, is the only required option.
    resave: true, // The resave option forces the session to be stored in the
		  // session store whether anything changes during the request
		  // or not
    saveUninitialized: false // saveUninitialized forces an unitialized session
			     // to be stored in the session store.
}));

// mongodb connection
mongoose.connect(config.DBURI);
var db = mongoose.connection;
// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

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

// listen on port 3000
app.listen(config.PORT, function () {
  console.log('Express app listening on port 3000');
});
