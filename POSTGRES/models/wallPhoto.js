var db = require('../config');
var WallPhoto = require('./wallPhoto');
var User = require('./user');

var SnipPhoto = db.Model.extend({
  tableName: 'wallPhotos',
  hasTimestamps: false,
  defaults: {
  },
  initialize: function(){
  },
  user: function() {
    return this.belongsTo('User', 'user_id');
  }
});

module.exports = db.model('WallPhoto', WallPhoto);
