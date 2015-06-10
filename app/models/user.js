'use strict';

var db = require('../config');
var Snip = require('./snip');
var WallPhoto = require('./wallPhoto');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  snip: function() {
    return this.belongsToMany('Snip', 'snip_id');
  },
  wallPhoto: function() {
     return this.hasMany('WallPhoto', 'wallPhoto_id');
  }
});

module.exports = db.model('User', User);
