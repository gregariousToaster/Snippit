'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$scope', 'Facebook', '$window', function($scope, Facebook, $window) {

    // Facebook user data (as of right now, name and id)
    $scope.facebookUser = {};

    $scope.snipTab = false;

    // Album names
    $scope.albumNames = [];

    // Album photos
    $scope.albumPhotos = [];

    $scope.snipName = '';

    $scope.newSnip = true;

    // Snip photos
    $scope.snipPhotos = [];

    // Snips
    $scope.snips = {};

    $scope.loading = false;

    // Invoke Facebook getFacebook user method, on success, assign
    // $scope.facebookUser to that response (Facebook name and id).
    $scope.fetchUser = function() {
      Facebook.getFacebookUser().success(function(resp) {
        $scope.facebookUser = resp;
      });
    };

    $scope.snipAdd = function() {
      $scope.snips[$scope.snipName] = $scope.snipPhotos;
      $scope.snipPhotos = [];

      //snip saving code to go here
      //make routes to redirect to saving on the mongo database server side
      //...on the server side we'll have a new snips database
      //
    };

    $scope.snipClose = function() {
      if ($scope.snipPhotos.length === 0) {
        delete $scope.snips[$scope.snipName];
      } else {
        $scope.snips[$scope.snipName] = $scope.snipPhotos;
      }
      $scope.snipPhotos = [];
      $scope.snipName = '';
      $scope.newSnip = true;
    };

    $scope.showAlbums = function() {
      $scope.snipTab = false;
    };

    $scope.showSnips = function() {
      $scope.snipTab = true;
    };

    // This function is invoked every time an album name is clicked on the
    // profile page. It passes the Facebook service's getAlbumPhotos method
    // the name and ID of the clicked album, which returns a promise. Upon
    // success, we are given a response, which are the photos for that specific
    // Facebook album. We then parse the data and push it to $scope.albumPhotos.
    $scope.albumClick = function(name, id) {
      $scope.loading = true;
      $scope.albumPhotos = [];
      //if there's no id on the thing we click, we know it's facebook wall photos
      if(!id){
        Facebook.getWallData().success(function(resp){
          var parse = JSON.parse(resp);
          for (var i = 0; i < parse.wallPhotos.picture.length;i++){
            $scope.loading = false;
            $scope.albumPhotos.push({
              src: parse.wallPhotos.picture[i],
              checked: false,
            });
          }
          console.log(resp);
        });
      }else{
        //if, on the other hand, we have the ids, we'll get the album data
        //based on the name album
        Facebook.getAlbumPhotos(name, id).success(function(resp) {
          var parse = JSON.parse(resp);
          console.log(parse);
            for (var i = parse[name].length - 1; i >= 0; i--) {
              $scope.loading = false;
              $scope.albumPhotos.push({
                src: parse[name][i],
                checked: false
              });
            }
          console.log('$scope.albumPhotos: ', $scope.albumPhotos);
        });
      }
    };

    $scope.snipClick = function(name) {
      $scope.snipPhotos = $scope.snips[name];
      $scope.newSnip = false;
      $scope.snipName = name;
      console.log('name', $scope.snipName);
    };

    $scope.checkOn = function(pic) {
      console.log('PICTURE', pic);
      $scope.snipPhotos.push(pic);
      pic.checked = true;
    };

    $scope.checkOff = function(pic) {
      console.log('PICTURE', pic);
      for (var i = 0; i < $scope.snipPhotos.length; i++) {
        if ($scope.snipPhotos[i].src === pic.src) {
          $scope.snipPhotos.splice(i, 1);
          break;
        }
      }

      pic.checked = false;
    };

    // This function is invoked on initialization of this controller. It fetches
    // the album names for the logged in Facebook user, which allows them to
    // select an album to fetch photos from.
    $scope.init = function() {

      Facebook.getAlbumData().success(function(resp) {
        var parse = JSON.parse(resp);
        for (var key in parse) {
          $scope.albumNames.push(parse[key]);
        }
        $scope.albumNames.push({name:'Facebook Wall Photos'});        
      });
      $scope.fetchUser();
    }();

    var fixHeight = function(){
      document.getElementById('content').setAttribute('height',
        ($window.innerHeight - (document.getElementsByClassName('header')[0].offsetHeight))
      );
    };

    angular.element(document).ready(function () {
      fixHeight();
      window.addEventListener('resize', fixHeight, false);
    });
  }]);
