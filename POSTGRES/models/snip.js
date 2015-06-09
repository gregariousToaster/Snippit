var db = require('../config');
var User = require('./user.js');
var SnipPhoto = require('./snipPhoto.js');

var Snips = db.Model.extend({
  tableName: 'snips',
  hasTimestamps: false,
  user: function() {
    return this.belongsToMany('User', 'user_id');
  },
  snipPhoto: function() {
    return this.hasMany('SnipPhoto', 'snipPhoto_id');
  }
});

module.exports = db.model('Snips', Snips);
