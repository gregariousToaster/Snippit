'use strict';

var db = require('../config');
var Snip = require('./snip');
var WallPhoto = require('./wallPhoto');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: false,
  defaults: {
  },
  initialize: function(){
  },
  snip: function() {
    return this.belongsToMany('Snip', 'snip_id');
  },
  wallPhoto: function() {
     return this.hasMany('WallPhoto', 'wallPhoto_id');
  }
});

module.exports = db.Model('User', User);
