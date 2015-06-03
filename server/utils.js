'use strict';

var fs = require('fs');
var api = require('./APIrequests.js');
var _ = require('underscore');
var client = require('./config/mongo');




exports.grabData = function(req, res, cb){

  client.then(function(db){
    return db.collection('users').findOneAsync({id:req.user.id});
  })
    .then(function(user){
      if(!user){
        console.log("Error, User Not Found in Utils Grab Data");
      }else{
        console.log("Compiling data to send to user");
        cb(JSON.stringify(user.data));
      }
    });
};

exports.handleAlbums = function(req, res, data, cb){
  var albums = {};
  console.log("data in handleAlbums",data);
  _.each(JSON.parse(data).data, function(album){
    albums[album.name] = {name: album.name, id: album.id};
  });
  console.log("albums sent in utils", albums);
  cb(JSON.stringify(albums));
};

exports.getAlbumPhotos = function(req, res, album, data, cb){
  // var findUser = Q.nbind(User.findOne, User);
  // exports.addData()]\
  // findUser({id: req.user.id})
  //   .then(function(user){
  //     if(!user) {
  //       console.log("ERROR, USER NOT FOUND, UTILS getAlbumPhotos")
  //     }else{
  //       console.log("user found IN getAlbumPhotos")
  //       console.log(user.data)
  //       // if(!user.data.albums[album.name]){
  //       // }
  //       user.markModified('data.albums');
  //       user.save(function(err, result){
  //         if(err) console.log(err, 'error');
  //         console.log(result)
  //       })
  //       console.log(user.data.albums.test.pictures)
  //       console.log(user.data.albums.test)
  //       console.log(user.data.albums)
  //       console.log(user.data)



        // console.log(user.data[album.name] = 5)
        // console.log(user.data, "am I set up?")
        var temp ={};
        temp[album.name] = [];
        _.each(JSON.parse(data).data, function(photo){
        //   // user.data[album.name].push(photo.source)
          temp[album.name].push(photo.source);

        });
        // console.log(user.data)
       //  console.log("===================================")

       // user.save(function(err, result){
       //   console.log("saving")
       //   if(err) {
       //     console.log(err, "getalbumphotos error")
       //   }else{
       //     // console.log("albums populated", result)
       //   }
          // cb(JSON.stringify(user.data[album.name]))
          cb(JSON.stringify(temp));
       // });

       // }
    // })
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

      db.collection('users').save({
        _id: user._id,
        id:user.id,
        name:user.name,
        FBtoken:user.FBtoken,
        data:datas,
      });
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

// exports.addInstagramUser = function(req, res, data){
  
// }
