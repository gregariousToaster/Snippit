var db = require('../config');
var SnipPhotos = require('../models/snipPhoto');

var SnipPhotos = new db.Collection();

SnipPhotos.model = SnipPhoto;

module.exports = SnipPhotos;
