var mongoose = require('mongoose');
var Q = require('q')


var UserSchema = new mongoose.Schema({
  id: Number,
  name:  String,
  username: String,
  email: String,
  data: {
    picture: [],
    source: [],
    caption: []
  }  
});



module.exports = mongoose.model('users', UserSchema);

