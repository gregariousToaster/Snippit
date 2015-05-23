// var data = require('./dummydata');
var fs = require('fs');

exports.handleFacebookData = function(){
  fs.readFile('./server/dummydata', 'utf8', function (err, data) {
    if (err) {
      return console.log(err, "error on intialize");
    }else{
      var dat = {};
      
    }
  });
}

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