'use strict';

// var data = require('./dummydata');
var fs = require('fs');
var Q = require('q');
var User = require('./config/userModel.js');
var api = require('./APIrequests.js');
var _ = require('underscore');



exports.checkData = function(req, res, cb){
  var findUser = Q.nbind(User.findOne, User);

  // exports.addData()]\
  findUser({id: req.user.id})
    .then(function(user){
      if(!user) {
        var newUser = new User({
          id: req.user.id,
          name: req.user.name
        });

        newUser.save(function(err, result){
          if(err){
            console.log(err, 'error!');
          }else{
            console.log(result, 'success!!');
          }
        });
        cb(user);
      }else{
        console.log("user found", user);

        cb(user);
      }
    });
};


exports.grabData = function(req, res, cb){
  var findUser = Q.nbind(User.findOne, User);

  findUser({id: req.user.id})
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

  _.each(JSON.parse(data).data, function(album){
    albums[album.name] = {name: album.name, id: album.id};
  });
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
 var findUser = Q.nbind(User.findOne, User);
 // exports.addData()]\
 findUser({id: req.user.id})
   .then(function(user){
     if(!user) {
      console.log("ERROR, USER NOT FOUND, UTILS FBWallPhotos");
     }else{
      console.log("user found IN HANDLE FACEBOOK");
      var dat = JSON.parse(data);
      user.data.wallPhotos.picture = [];
      user.data.wallPhotos.thumbnail = [];
      user.data.wallPhotos.caption = [];
      console.log(dat.data.length, 'this is the length');
      _.each(dat.data, function(post){
        post.name = post.name || '';
        user.data.wallPhotos.picture.push(post.source);
        user.data.wallPhotos.caption.push(post.name);
        user.data.wallPhotos.thumbnail.push(post.picture);
      });


      user.save(function(err, result){
        if(err) {
          console.log(err, "facebookData error");
        }else{
          console.log("facebook Wall data added to DB");
        }
        cb(JSON.stringify(user.data));
      });
    }
  });
};
//get albums   album_id_number/photos
// 854583941784/photos


//JSON.parse(data).photos.data[0].source   << photo
//JSON.parse(data).photos.data[0].picture  <<thumbnail



/*
comments: Object
created_time: "2015-05-20T22:40:23+0000"
from: Object
height: 562
icon: "https://fbstatic-a.akamaihd.net/rsrc.php/v2/yz/r/StEh3RhPvjk.gif"
id: "10100130211434054"
images: Array[6]
likes: Object
link: "https://www.facebook.com/photo.php?fbid=10100130211434054&set=a.543031121134.2066330.201300330&type=1"
name: "Brainstorming for our Thesis project"
picture: "https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/p130x130/17094_10100130211434054_7522953371122654541_n.jpg?oh=fadc95efffcb45426ec378d5d094eed6&oe=560D158E"
place: Object
source: "https://scontent.xx.fbcdn.net/hphotos-xfa1/v/t1.0-9/17094_10100130211434054_7522953371122654541_n.jpg?oh=39b90e0847408be361e6577e10a617ba&oe=55C8373A"
tags: Object
updated_time: "2015-05-20T22:40:25+0000"
width: 562
*/

/*
from: Object
  id: "904438772304"
  name: "Quest Henkart"
*/

/*
place: Object
  id: "134464886714521"
  location: Object
    city: "San Francisco"
    country: "United States"
    latitude: 37.7836456
    longitude: -122.4087524
    state: "CA"
    street: "944 Market St."
    zip: "94102"
  name: "Hack Reactor"
*/

/*
tags: Object
data: Array[4]
  0: Object
    created_time: "2015-05-20T22:40:25+0000"
    id: "10204226975902488"
    name: "Eric Outterson"
    x: 62.455516014235y: 62.640569395018
*/

/*

// var data = require('./dummydata');
var fs = require('fs');

exports.handleFacebookData = function(){
  fs.readFile('./server/dummydata', 'utf8', function (err, data) {
    if (err) {
      return console.log(err, "error on intialize");
    }else{
      debugger;

    }
  });
}

*/
