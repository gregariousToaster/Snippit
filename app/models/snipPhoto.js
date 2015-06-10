'use strict';

var db = require('../config');
console.log("DB ../config", db);
var Snip = require('./snip');

var SnipPhoto = db.Model.extend({
  tableName: 'snipPhotos',
  hasTimestamps: false,
  defaults: {
  },
  initialize: function(){
  },
  snip: function() {
    return this.belongsTo('Snip', 'snip_id');
  }
});

module.exports = db.Model('SnipPhoto', SnipPhoto);
