'use strict';

var db = require('../config');
var SnipPhoto = require('./snipPhoto');
var User = require('./user');

var Snip = db.Model.extend({
  tableName: 'snips',
  hasTimestamps: false,
  defaults: {
  },
  initialize: function(){
  },
  user: function() {
    return this.belongsToMany('User', 'user_id');
  },
  snipPhoto: function() {
     return this.hasMany('SnipPhoto', 'snipPhoto_id');
  }
});

module.exports = db.model('Snip', Snip);
