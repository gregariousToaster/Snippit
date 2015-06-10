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

console.log("SNIPPHOTO!!!!!!!!!!!!!!!!!!!!!!!", SnipPhoto);

module.exports = db.Model('SnipPhoto', SnipPhoto);

console.log("SNIPPHOTO MODULE.EXPORTS!!!!!!!!!!!!!!!!!!!!!!!", module.exports);