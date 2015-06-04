'use strict';

var _ = require('underscore');
var client = require('./config/mongo');



// Util function for routes asking for user data.
// Takes a request, a response, and a callback.
exports.grabData = function(req, res, cb){
  client.then(function(db){
    return db.collection('users').findOneAsync({id:req.user.id});
  })
  .then(function(user){
    if (!user) {
      console.log('Error, User Not Found in Utils Grab Data');
    } else {
      cb(JSON.stringify(user.data));
    }
  });
};

// Util function for getting photos for a particular album.
// Takes a request, a response, an album object, data to look through, and a callback.
exports.getAlbumPhotos = function(req, res, album, data, cb){
  var temp ={};
  temp[album.name] = {};
  _.each(JSON.parse(data).data, function(photo){
    temp[album.name][photo.id] = {src: photo.source, thumb: photo.picture};
  });
  cb(JSON.stringify(temp));
};

// Util function for handling the Albums recieved fur routes before sending them to the user.
// Takes a request, a response, a data object with Album information, and a callback.
exports.handleAlbums = function(req, res, data, cb){

  var albums = {};
  _.each(JSON.parse(data).data, function(album){
    albums[album.name] = {name: album.name, id: album.id};
  });
  cb(JSON.stringify(albums));
};

// Util function for adding a snip to the Database.
// Takes a request, a response, and a callback.
exports.addSnip = function(req, res, cb){
  var snip = {
    name: req.body.name,
    img: req.body.img
  };
  client.then(function(db){
    db.collection('snips').insert(snip, cb);
  });
};

exports.getAlbumPhotos = function(req, res, album, data, cb){
  var temp ={};
  temp[album.name] = {};
  _.each(JSON.parse(data).data, function(photo){
    temp[album.name][photo.id] = {src: photo.source, thumb: photo.picture};
  });

  cb(JSON.stringify(temp));
};

// Util function for saving an updated snip to the Database.
// Takes a request, a response, and a callback.
exports.saveSnip = function(req, res, cb){
  var snip = {
    'img': JSON.stringify(req.body.img)
  };
  client.then(function(db){
    db.collection('snips').update({_id: 'ObjectId(' + req.body._id + ')'}, {$set: snip});
  });
};

// Util function for getting user's Facebook wall photos.
// Takes a request, a response, a data object, and a callback.
exports.FBWallPhotos = function(req, res, data, cb){
  client.then(function(db){
    return db.collection('users').findOneAsync({id: req.user.id})
    .then(function(user){
      if(!user) {
        console.log('ERROR, USER NOT FOUND, UTILS FBWallPhotos');
      }else{
        var dat = JSON.parse(data);
        var datas = {};
        datas.wallPhotos = {};
        datas.wallPhotos.picture = [];
        datas.wallPhotos.id = [];
        datas.wallPhotos.thumbnail = [];
        datas.wallPhotos.caption = [];
        _.each(dat.data, function(post){
          post.name = post.name || '';
          datas.wallPhotos.picture.push(post.source);
          datas.wallPhotos.id.push(post.id);
          datas.wallPhotos.caption.push(post.name);
          datas.wallPhotos.thumbnail.push(post.picture);
        });

        db.collection('users').update(
          {_id: user._id},
          {$set: {data: datas}}
        );
      }
    }).then(function(){
      db.collection('users').findOneAsync({id:req.user.id})
      .then(function(user) {
        console.log('USER', user);
        cb(JSON.stringify(user.data));
      });
    });
  });
};

exports.refreshInstagramToken = function(req, res, data, cb){
  client.then(function(db){
    return db.collection('users').findOneAsync({id: req.user.id})
      .then(function(user){
        if(!user){
          console.log("ERROR, USER NOT FOUND UTILS addinstagramuser");
        }else{
          db.collection('users').update({_id: user._id},
            {$set:
              {
                instagramToken: data.access_token,
                instagramId: data.user.id
              }
            }
          );
        }
      }).then(function(){
        db.collection('users').findOneAsync({id:req.user.id})
          .then(function(user){
            cb(user);
          });
      });
  });
};
