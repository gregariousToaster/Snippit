// var Facebook = require('facebook-node-sdk');

// var facebook = new Facebook({ appID: '1424355067886211', secret: 'fb8a1c1d039a4d90c396f95c7bfd2562'})


// exports.facebook = function(){

//   facebook.api('/questh', function(err, data) {
//     console.log(data); 
//   });
// }

var https = require('https');

exports.GET = function(accessToken, apiPath, callback) {
  // creating options object for the https request
  var options = {
      // the facebook open graph domain
      host: 'graph.facebook.com',

      // secured port, for https
      port: 443,

      // apiPath is the open graph api path
      path: apiPath + '&access_token=' + accessToken,

      // well.. you know...
      method: 'GET'
  };
// https://graph.facebook.com/v2.3/10100131608434454?fields=photos&access_token=CAAUPcYHaZBoMBAH1yfMInwTeM43I1ZBEnWQP9DOztYb1jNjRNCQDRagnt5BnNH6CzWqJlJ7t36a2tOCW9obZBxvxKaZBlP83WQ5694x95SOGVYwsqrmCzEHEh3yGytzoFZAaSGfjH1kp6iNZBHzSNPXuekYjROxCLQfYEGZAGTZBvilEVD0XFwdq4pRh9RyeFNteXoRb9ggZC0GWObuM1MKAC
  // create a buffer to hold the data received
  // from facebook
  var buffer = '';

  // initialize the get request
  console.log(options)
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