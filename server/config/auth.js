var nconf = require("nconf");
nconf.file('settings.json').env();

var fbConsumerKey = nconf.get('facebook').consumerKey;
var fbConsumerSecret = nconf.get('facebook').consumerSecret;

var instaConsumerKey = nconf.get('instagram').consumerKey;
var instaConsumerSecret = nconf.get('instagram').consumerSecret;

module.exports = {
  'facebookAuth' : {
    'clientID'      : fbConsumerKey, // your App ID
    'clientSecret'  : fbConsumerSecret, // your App Secret
    'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
  },
  'instagramAuth' : {
    'clientID'    : instaConsumerKey,
    'clientSecret': instaConsumerSecret,
    'callbackURL' : 'http://localhost:3000/auth/instagram/callback'
  }   
}