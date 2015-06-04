'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var util = require('util');
var client = require('./server/config/mongo');

var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var routes = require('./routes/index');

//api requests
var utils = require('./server/utils.js');
var api = require('./server/APIrequests.js');

var app = express();
var store = new MongoDBStore({
  uri: 'mongodb://localhost/GregariousToaster',
  collection: 'mySessions'
});

// error handling for session store
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});

// pass passport for configuration
require('./server/config/passport.js')(passport);


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//passport Oauth
app.use(session({ 
  secret: 'keyboard cat',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // week long cookies
  },
  store: store 
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes(passport));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//=== Database

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('ERROR', err.message,'  ', err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('ERROR', err.message,'  ', err);
});

module.exports = app;
