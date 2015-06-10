'use strict';

var db = require('../config');
var Snip = require('./snip');

var SnipPhoto = db.Model.extend({
  tableName: 'snipPhotos',
  hasTimestamps: true,
  snip: function() {
    return this.belongsTo('Snip', 'snip_id');
  }
});

module.exports = db.model('SnipPhoto', SnipPhoto);
