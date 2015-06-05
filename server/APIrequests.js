var configAuth = require('./config/auth.js');
var https = require('https');
var request = require('request');
var ig = require('instagram-node').instagram();


exports.facebookGET = function(accessToken, apiPath, callback, ampersand) {
  ampersand = ampersand ? '&' : '?';
  // creating options object for the https request
  var options = {
      // the facebook open graph domain
      host: 'graph.facebook.com',

      // secured port, for https
      port: 443,

      // apiPath is the open graph api path
      path: apiPath + ampersand+'limit=100&access_token=' + accessToken,

      // well.. you know...
      method: 'GET'
  };
  // console.log("options.path>>>>>",options.path);
// https://graph.facebook.com/v2.3/10100131608434454?fields=photos&access_token=CAAUPcYHaZBoMBAH1yfMInwTeM43I1ZBEnWQP9DOztYb1jNjRNCQDRagnt5BnNH6CzWqJlJ7t36a2tOCW9obZBxvxKaZBlP83WQ5694x95SOGVYwsqrmCzEHEh3yGytzoFZAaSGfjH1kp6iNZBHzSNPXuekYjROxCLQfYEGZAGTZBvilEVD0XFwdq4pRh9RyeFNteXoRb9ggZC0GWObuM1MKAC
// https://graph.facebook.com/v2.3/854583941784?/photos?access_token=CAAUPcYHaZBoMBAFvpTrB6KbIXfEWYZAz6qdZCFRaxVN7X9GlXGZCb9ZCUUu5PxmNxZARSUuJ9M1qUpMD0gboibrUAhwSvkZANK3wdIjDf4Ee48cFIv0fhrCsmzGkVRZAtMnEWMW0MMZCIZBr9s6dDghou6LQybUfhC8G4O8EOPiZBQLZBYnmHrzibhBzptfU2KhrYEQH9rdnPXjqKMIrBZCxzoGvd
  // create a buffer to hold the data received
  // from facebook
  var buffer = '';

  // initialize the get request
  var request = https.get(options, function(result){
      result.setEncoding('utf8');

      // each data event of the request receiving
      // chunk, this is where i`m collecting the chunks
      // and put them together into one buffer...
      result.on('data', function(chunk){
          buffer += chunk;
      });

      // all the data received, calling the callback
      // function with the data as a parameter
      result.on('end', function(){
          callback(buffer);
      });
  });

  // just in case of an error, prompting a message
  request.on('error', function(e){
      console.log('error from facebook.get(): '
                   + e.message);
  });

  request.end();
}

//redirects to the initial instagram Auth. This will be returned to the callback
// and provide a code that can be traded for a token
exports.authInstagram = function(req, res) {
  res.redirect('https://api.instagram.com/oauth/authorize/?client_id='+configAuth.instagramAuth.clientID+'&redirect_uri='+configAuth.instagramAuth.callbackURL+'&response_type=code');
}


//Once instagram sends the code to the callback, this funciton handles the POST request 
// that trades the code for the token and user information
exports.instagramToken = function(req, res, code, cb){
  request.post(
    { form: { client_id: configAuth.instagramAuth.clientID,
              client_secret: configAuth.instagramAuth.clientSecret,
              grant_type: 'authorization_code',
              redirect_uri: configAuth.instagramAuth.callbackURL,
              code: code
            },
      url: 'https://api.instagram.com/oauth/access_token'
    },
    function (err, response, body) {
      if (err) {
        console.log("error in Post", err)
      }else{

        cb(JSON.parse(body))
      }
    }
  );
}
//congiures the instagram npm module
ig.use({ client_id: configAuth.instagramAuth.clientID,
         client_secret: configAuth.instagramAuth.clientSecret });
exports.instagramGET = function(req, res, token, callback){
  ig.use({ access_token: token });
  ig.user_media_recent('self',{count:100}, function(err, medias) {
    if(err){
      console.log(err, 'Error, Token no longer valid');
      res.redirect('/auth/instagram');
    }else{
      var instagramPhotos = [];
      medias.forEach(function(post){
        instagramPhotos.push({thumbnail: post.images.thumbnail.url, picture: post.images.standard_resolution.url, id: post.id})
      })
      
      callback(instagramPhotos);
    }
  });

}
/*
[ { attribution: null,
    tags: [],
    type: 'image',
    location: null,
    comments: { count: 0, data: [] },
    filter: 'Lo-fi',
    created_time: '1362943500',
    link: 'https://instagram.com/p/WsEqPdPb6p/',
    likes: { count: 10, data: [Object] },
    images:
     { low_resolution: [Object],
       thumbnail: [Object],
       standard_resolution: [Object] },
    users_in_photo: [],
    caption:
     { created_time: '1362943500',
       text: 'Reminiscing in Santa Barbara  With @davidmeyer',
       from: [Object],
       id: '408722235205730105' },
    user_has_liked: true,
    id: '408722161184652969_176673950',
    user:
     { username: 'qhenkart',
       profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_176673950_75sq_1338508319.jpg',
       id: '176673950',
       full_name: 'Quest Henkart' } },
  { attribution: null,
    tags: [],
    type: 'image',
    location: null,
    comments: { count: 0, data: [] },
    filter: 'Lo-fi',
    created_time: '1362813062',
    link: 'https://instagram.com/p/WoL3qRPb6x/',
    likes: { count: 7, data: [Object] },
    images:
     { low_resolution: [Object],
       thumbnail: [Object],
       standard_resolution: [Object] },
    users_in_photo: [],
    caption:
     { created_time: '1362813062',
       text: '@jordancolton @shea_la85 @pureonyxkixx',
       from: [Object],
       id: '407628416179617064' },
    user_has_liked: false,
    id: '407627969746288305_176673950',
    user:
     { username: 'qhenkart',
       profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_176673950_75sq_1338508319.jpg',
       id: '176673950',
       full_name: 'Quest Henkart' } },
  { attribution: null,
    tags: [],
    type: 'image',
    location: null,
    comments: { count: 0, data: [] },
    filter: 'Hefe',
    created_time: '1342408606',
    link: 'https://instagram.com/p/NIFdU1vb1o/',
    likes: { count: 1, data: [Object] },
    images:
     { low_resolution: [Object],
       thumbnail: [Object],
       standard_resolution: [Object] },
    users_in_photo: [],
    caption:
     { created_time: '1342408606',
       text: 'Sunset concord',
       from: [Object],
       id: '236463006555159808' },
    user_has_liked: false,
    id: '236462985910795624_176673950',
    user:
     { username: 'qhenkart',
       profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_176673950_75sq_1338508319.jpg',
       id: '176673950',
       full_name: 'Quest Henkart' } },
  { attribution: null,
    tags: [],
    type: 'image',
    location: null,
    comments: { count: 0, data: [] },
    filter: 'Lo-fi',
    created_time: '1340941987',
    link: 'https://instagram.com/p/McYGv4vb0B/',
    likes: { count: 1, data: [Object] },
    images:
     { low_resolution: [Object],
       thumbnail: [Object],
       standard_resolution: [Object] },
    users_in_photo: [],
    caption: null,
    user_has_liked: false,
    id: '224160098312633601_176673950',
    user:
     { username: 'qhenkart',
       profile_picture: 'https://instagramimages-a.akamaihd.net/profiles/profile_176673950_75sq_1338508319.jpg',
       id: '176673950',
       full_name: 'Quest Henkart' } } ] 'medias'


*/