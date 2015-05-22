var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//==api requests
var utils = require('./server/utils.js');
var api = require('./server/APIrequests.js');
//===

//==passport and Oauth
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var FACEBOOK_APP_ID = "1424355067886211"
var FACEBOOK_APP_SECRET = "fb8a1c1d039a4d90c396f95c7bfd2562";
//===

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

<<<<<<< HEAD
app.listen(3000);
=======

//==passport setup

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
//==============

//=============
// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


//===



>>>>>>> added oauth base and api request base

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//passport Oauth
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
//===

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//for dummy data only
// var token = 'CAACEdEose0cBACLgiiM5kRWCSL5HQNzQr7lolR02zxZBdXB7JwOCOy34CmPmlPGmZBDhLrnUn7tuJx6jhvnnfXWL7g7MDRpZCNAtk0z6xZBomVwfgmXECZAtNMJ4p9gxTo04nEooR4HTaz0rnJxq8BDoTc7WZAQjMlHgyAGnRrZBb1WrgwULIGVAkH67g8I6tOZCNbLIUZCWlc2qPkSbCKg3jyPfmy5LaZChAZD';
// api.facebookGET(token, '/me?fields=photos', function(data){
//   console.log(data)
// })
utils.handleFacebookData();

module.exports = app;
