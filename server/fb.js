export.config({
  shim: {
    'facebook' : {
      exports: 'FB'
    }
  },
  paths: {
    'facebook': '//connect.facebook.net/en_US/sdk'
  }
})
export(['fb']);

define(['facebook'], function(){
  FB.init({
    appId      : '{your-app-id}',
    version    : 'v2.3'
  });
  FB.getLoginStatus(function(response) {
    console.log(response);
  });
});