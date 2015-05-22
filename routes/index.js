var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', ensureAuthenticated, function(req, res){
//   res.render('index', { user: req.user });
// });

// // router.get('/account', ensureAuthenticated, function(req, res){
// //   res.render('account', { user: req.user });
// // });

// router.get('/login', function(req, res){
//   res.render('login', { user: req.user });
// });


// router.get('/auth/facebook', function(req, res){
//   console.log('error  ')
// })

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.render('login')
}

// module.exports = router;




module.exports = function(passport) {
    var router = express.Router();
    router.get('/', ensureAuthenticated, function(req, res){
      res.render('index', { user: req.user });
    });

    router.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
    });

  router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      debugger;
      res.redirect('/');
  });
    // etc.

    return router;
};
