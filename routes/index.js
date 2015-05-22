var express = require('express');


// module.exports = router;




module.exports = function(passport) {

  var router = express.Router();
  router.get('/', ensureAuthenticated, function(req, res){
    res.render('index', { title: 'express' });
  });



/// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
  router.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){
  // The request will be redirected to Facebook for authentication, so this
  // function will not be called.
  });



// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
  router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
  });

  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
    // etc.

    return router;
};


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.render('login')
}
