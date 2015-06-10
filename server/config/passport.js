'use strict';

//==passport and Oauth
var FacebookStrategy = require('passport-facebook');
var configAuth = require('./auth.js');
var User = require('../../app/models/user');

module.exports = function(passport) {
// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });


  passport.deserializeUser(function(id, done) {
        new User({id: id})
        .fetch()
        .then(function(model) {
          if (!model) {
            console.log('user not found for deserialize')
          }
          else {
            done(null, model);
          }
        })
  });



// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.
  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
//saves user data into database or logs them in if they already exist. Always updates
//facebook token
console.log('PROFILEEE', profile);
      new User({facebookID: profile.id})
        .fetch()
        .then(function(model){
          if(!model){
            new User({
              facebookID: profile.id,
              name: profile.displayName,
              facebookToken: accessToken
            }, {isNew: true})
            .save()
            .then(function(model){
              return done(null, model);
            });
          } else {
            console.log('user is found, resetting accessToken');
            model.save({facebookToken: accessToken}, {patch: true})
            .then(function(model){
              return done(null, model);
            });
          }
        })
  }));
};

