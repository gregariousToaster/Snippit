var mongoose = require('mongoose');
var Q = require('q');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  id: Number,
  name:  String,
  username: String,
  email: String,
  FBtoken: String,
  data: {
    wallPhotos: {
      picture: [],
      thumbnail: [],
      caption: []
    }
  },
  snips: {}  
});



module.exports = mongoose.model('users', UserSchema);

