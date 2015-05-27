var express = require('express');
var utils = require('../server/utils.js');
var facebook = require('../server/APIrequests.js');

// module.exports = router;




module.exports = function(passport) {

  var router = express.Router();

  // router.get('/',ensureAuthenticated, function(req, res){
  //   console.log("authenticated")
  //   res.redirect('/');

  // });

/// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope:
      ['user_photos', 'user_friends']
    }), function(req, res){
  // The request will be redirected to Facebook for authentication, so this
  // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/#/signin' }),
    function(req, res) {
      res.redirect('/#/app');
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  router.get('/auth/isAuthenticated', function(req, res){
    var authorized = {};
    authorized['auth'] = req.isAuthenticated()
    res.json(authorized);
  });

  router.get('/queryFacebook', function(req, res){
    facebook.GET(req.user.FBtoken, '/v2.3/'+req.user.id+'?fields=photos', function(data){
<<<<<<< HEAD
      utils.handleFacebookData(req, res, data, function(user){
        console.log(user)
=======
      console.log(data)
      utils.handleFacebookData(req, res, data, function(user){
>>>>>>> adding api route
        res.JSON(user)
      })
    })
  });


    return router;
};


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     console.log(req.isAuthenticated(), "AM I TRUE OR FALSE")
//     return next();
//   }
//   console.log("NOT AUTHENTICATED")
//   res.redirect('/#/signin')
// }