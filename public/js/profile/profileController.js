'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$scope', 'Facebook', '$window', 'Snips', '$http', function($scope, Facebook, $window, Snips, $http) {

    // Facebook user data (as of right now, name and id)
    $scope.facebookUser = {};

    $scope.snipTab = false;

    // Album names
    $scope.albumNames = [];

    // Album photos
    $scope.albumPhotos = [];

    $scope.snipName = '';

    $scope.snipId = null;

    $scope.newSnip = true;

    // Snip photos
    $scope.snipPhotos = {};

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

    $scope.snipCheck = function(){
      return !!Object.keys($scope.snipPhotos).length;
    }

    $scope.snipAdd = function() {
      if(!$scope.snipId){
        Snips.saveSnips({img: $scope.snipPhotos, name: $scope.snipName})
          .success(function(resp){
            var id = JSON.parse(resp).id;
            $scope.snips[id] = {
              name: $scope.snipName,
              img: $scope.snipPhotos
            };
          });
      } else {
        Snips.saveSnips({img: $scope.snipPhotos, name: $scope.snipName, _id: $scope.snipId});
      }
      $scope.snips[$scope.snipName] = $scope.snipPhotos;
      $scope.snipName = '';
      $scope.snipPhotos = {};

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
      $scope.snipPhotos = {};
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
      if(!id){
        Facebook.getWallData().success(function(resp){
          var pics = JSON.parse(resp).wallPhotos;
          for (var i = 0; i < parse.picture.length;i++){
            $scope.loading = false;
            $scope.albumPhotos.push({
              src: pics.picture[i],
            });
          }
        });
      } else {
        Facebook.getAlbumPhotos(name, id).success(function(resp) {
          var parse = JSON.parse(resp);
            for (var i = parse[name].length - 1; i >= 0; i--) {
              $scope.loading = false;
              $scope.albumPhotos.push({
                src: parse[name][i],
              });
            }
        });
      }
    };

    $scope.snipClick = function(name) {
      $scope.snipPhotos = $scope.snips[name];
      $scope.newSnip = false;
      $scope.snipName = name;
    };

    $scope.checkOn = function(pic) {
      $scope.snipPhotos[pic.src] = {
        src: pic.src,
        thumb: pic.thumb,
        position: Object.keys($scope.snipPhotos).length
      };
    };

    $scope.checkOff = function(pic) {
      delete $scope.snipPhotos[pic];
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
  }]);
