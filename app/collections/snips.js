var db = require('../config');
var Snip = require('../models/snip');

var Snips = new db.Collection();

Snips.model = Snip;

module.exports = Snips;
