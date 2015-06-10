var db = require('../config');
var SnipPhoto = require('../models/snipPhoto');

var SnipPhotos = new db.Collection();

SnipPhotos.model = SnipPhoto;

module.exports = SnipPhotos;
