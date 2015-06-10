'use strict';

var db = require('../config');
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

module.exports = db.model('SnipPhoto', SnipPhoto);
