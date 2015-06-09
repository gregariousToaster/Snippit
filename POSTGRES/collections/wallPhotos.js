var db = require('../config');
var WallPhoto = require('../models/wallPhoto');

var WallPhotos = new db.Collection();

WallPhotos.model = WallPhoto;

module.exports = WallPhotos;
