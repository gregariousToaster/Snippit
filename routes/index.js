'use strict';

var express = require('express');
var utils = require('../server/utils.js');
var api = require('../server/APIrequests.js');
var client = require('../server/config/mongo');

//passes passport into the router to maintain passport configuration
module.exports = function(passport) {

  var router = express.Router();

  /// GET /auth/facebook
  //   Uses passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Facebook authentication will involve
  //   redirecting the user to facebook.com.  After authorization, Facebook will
  //   redirect the user back to this application at /auth/facebook/callback
  router.get('/auth/facebook', passport.authenticate('facebook', {
    scope:
      ['user_photos', 'user_friends']
    }), function(req, res) {
  });

  // GET /auth/facebook/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/#/signin' }),
    function(req, res) {
      res.redirect('/#/app/three');
  });


//checks database for Instagram token and returns 100 Instagram photos
  router.get('/getInstagram', passport.authenticate('facebook', { failureRedirect: '/#/signin' }),
  function(req, res){
    console.log(req.user.instagramToken)
    api.instagramGET(req, res, req.user.instagramToken, function(media){
      //sends the data to the user
      res.json(JSON.stringify(media))
    });
  })

  //Get /auth/instagram
  // sends user to authenticate our app at instagram, it returns a code that is NOT a token (a token post request must be made
  // to instagram to exchange the code for a token)
  router.get('/auth/instagram', function(req, res){
    console.log('redirecting');
    //handles url redirect
    api.authInstagram(req, res)

  });

  //Instagram sends a callback with a validation code in the URL
  //this validation code IS NOT the token that allows for API calls
  // a swap is necessary to swap the code for the token
  //redirects the url to exchange the code for the token
  // res.redirect('/auth/instagram/getToken');
  router.get('/auth/instagram/callback', function(req, res){
    var code = req.url.split('code=')[1]
    
  //redirects the url to exchange the code for the token
    api.instagramToken(req, res, code, function(data){
      utils.refreshInstagramToken(req, res, data, function(user){
        res.redirect('/#/app/profile');
      });
    });
    
  });

//logs user out of app and resets authentication
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

//checks if user is authenticated to manage front-end restrictions
  router.get('/auth/isAuthenticated', function(req, res){
    var authorized = {};
    authorized.auth = req.isAuthenticated();
    res.json(authorized);
  });


  // If photos exist in database, response with data. If not,
  // response with an object with a bool property pointing to
  // false.
  router.get('/getData', function(req, res){
    utils.grabData(req, res, function(user){
      if (user) {
        res.json(user);
      } else {
        res.json({bool: 'false'});
      }
    });
  });

//populates database with photos from the facebook wall
  router.get('/getFacebookWall', function(req, res){

    api.facebookGET(req.user.FBtoken, '/v2.3/'+req.user.id+'/photos', function(data) {
      utils.FBWallPhotos(req, res, data, function(user){
        res.json(user);
      });
    }, false);
  });

//sends a list of album names and ids to the user
  router.get('/getFacebookAlbums', function(req, res){
    api.facebookGET(req.user.FBtoken, '/v2.3/'+req.user.id+'/albums', function(data) {
      utils.handleAlbums(req, res, data, function(albums){
        res.json(albums);
      });
    }, false);
  });

//sends photos from a specific album to a user
  router.post('/getFacebookAlbumPhotos', function(req, res){
    var album = {id: req.body.id, name: req.body.name};
    api.facebookGET(req.user.FBtoken,'/v2.3/' + album.id + '/photos', function(data) {
      utils.getAlbumPhotos(req, res, album, data, function(user){
        res.json(user);
      });
    }, false);
  });

  // Does a MongoDB query based off of logged in Facebook user's ID.
  // Response with name and id of that Facebook user.
  router.get('/facebookUser', function(req, res) {
    client.then(function(db){
      return db.collection('users').findOneAsync({id:req.user.id});
    })
    .then(function(user){
      res.json({name: user.name, id: user.id, snips: user.snips});
    });
  });


//retrieves saved Snips from the database
  router.post('/getSnips', function(req, res){
    utils.getSnips(req, res, function(snips){
      res.json(snips)
    });
  });

//saves a new snip into the database
  router.post('/addSnip', function(req, res){
    utils.addSnip(req, res, function(err, id){
      utils.connectSnip(id.ops[0]._id, req.body.userId);
      res.json(id.ops[0]._id);
    });
  });

//updates an existing snip
  router.post('/saveSnip', function(req, res){
    utils.saveSnip(req, res)
    res.end();
  });

//deletes a snip
  router.post('/deleteSnip', function(req, res){
    var snipName = {name: req.body.name };
    console.log('SNIP NAME', snipName);
    utils.deleteSnip(req, res, snipName, function(bool){
      res.json(bool);
    });
  });

  return router;
};
