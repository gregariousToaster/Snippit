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
    albums: [mongoose.Schema.Types.Mixed]
  },
  snips: {}  
});



module.exports = mongoose.model('users', UserSchema);

