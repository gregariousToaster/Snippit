//==passport and Oauth
var FacebookStrategy = require('passport-facebook');
var configAuth = require('./auth.js');
var utils = require('../utils.js');
var Q = require('q'); //===
var User = require('./userModel.js');



module.exports = function(passport) {
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
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      var findUser = Q.nbind(User.findOne, User);
      // exports.addData()
      // facebook.GET(accessToken, '/v2.3/'+profile.id+'?fields=photos', function(data){
      //   console.log(data)
      // })
      findUser({id: profile.id}).then(function(user){
        if(!user) {
          var newUser = new User({
            id: profile.id,
            name: profile.displayName,
            FBtoken: accessToken
          });

          newUser.save(function(err, result){
            if(err){
              console.log(err, 'error!');
            }else{
             console.log(result, 'success!!');
             return done(null, result);
            }
          });
        }else{
          console.log("user found");
          user.FBtoken = accessToken;
          user.save(function(err, result){
            if(err){
              console.log(err, 'error on get new token passport line: 63');
            }else{
              console.log(result.FBtoken, 'successful retoken');
              return done(null, user);
            }
          });
        }
      });
      // asynchronous verification, for effect...

        // To keep the example simple, the user's Facebook profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Facebook account with a user record in your database,
        // and return that user instead.
        // return done(null, profile);

  }));
};

