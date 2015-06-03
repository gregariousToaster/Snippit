'use strict';

var _ = require('underscore');
var client = require('./config/mongo');




exports.grabData = function(req, res, cb){

  client.then(function(db){
    return db.collection('users').findOneAsync({id:req.user.id});
  })
  .then(function(user){
    if (!user) {
    } else {
      cb(JSON.stringify(user.data));
    }
  });
};

exports.handleAlbums = function(req, res, data, cb){

  var albums = {};
  _.each(JSON.parse(data).data, function(album){
    albums[album.name] = {name: album.name, id: album.id};
  });
  cb(JSON.stringify(albums));
};

exports.addSnip = function(req, res, cb){
    var snip = {
      name: req.body.name,
      img: req.body.img
    };
    console.log('SNIP', snip);
    if(req.body._id) {
      client.then(function(db){
        db.collection('snips').update({_id: req.body._id}, snip);
      });
    } else {
      client.then(function(db){
        db.collection('snips').insert(snip,
          function(err, thingInserted){
            console.log('SNIP', snip);
            console.log('============thing insert==========',thingInserted);
          });
      })
    }
}

exports.getAlbumPhotos = function(req, res, album, data, cb){

  var temp ={};
  temp[album.name] = [];
  _.each(JSON.parse(data).data, function(photo){
    temp[album.name].push(photo.source);

  });

  cb(JSON.stringify(temp));
};

exports.FBWallPhotos = function(req, res, data, cb){

  client.then(function(db){
    return db.collection('users').findOneAsync({id: req.user.id})
    .then(function(user){
      if(!user) {

        console.log("ERROR, USER NOT FOUND, UTILS FBWallPhotos");
      }else{
        console.log("user found IN HANDLE FACEBOOK");
        var dat = JSON.parse(data);
        var datas = {};
        datas.wallPhotos = {};
        datas.wallPhotos.picture = [];
        datas.wallPhotos.thumbnail = [];
        datas.wallPhotos.caption = [];
        console.log(dat.data.length, 'this is the length');
        _.each(dat.data, function(post){
          post.name = post.name || '';
          datas.wallPhotos.picture.push(post.source);
          datas.wallPhotos.caption.push(post.name);
          datas.wallPhotos.thumbnail.push(post.picture);
        });

        db.collection('users').update({_id: user._id},
          {$set:
            {
              data:datas,
            }
          }
        );
      }
    }).then(function(){
      db.collection('users').findOneAsync({id:req.user.id})
      .then(function(user) {
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
