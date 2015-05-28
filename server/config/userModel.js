var mongoose = require('mongoose');
var Q = require('q')


var UserSchema = new mongoose.Schema({
  id: Number,
  name:  String,
  username: String,
  email: String,
  FBtoken: String,
  data: {
    wallPhotos: {
      picture: [],
      caption: []
    },
  }  
});



module.exports = mongoose.model('users', UserSchema);

