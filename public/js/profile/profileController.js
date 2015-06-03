'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$scope', 'Facebook', '$window', function($scope, Facebook, $window) {

    $scope.snipTab = false;

    // Album names
    $scope.albumNames = [];

    // Album photos
    $scope.albumPhotos = [];

    $scope.snipName;

    $scope.newSnip = true;

    // Snip photos
    $scope.snipPhotos = [];

    // Snips
    $scope.snips = {};

    // Parsed data
    $scope.parse = null;

    var sceneHeight = function(){
      return $window.innerHeight - (document.getElementsByClassName('header')[0].offsetHeight);
    }

    $scope.snipAdd = function() {
      $scope.snips[$scope.snipName] = $scope.snipPhotos;
      $scope.snipPhotos = [];
    }

    $scope.snipClose = function() {
      $scope.snips[$scope.snipName] = $scope.snipPhotos;
      $scope.snipPhotos = [];
      $scope.newSnip = true;
    }

    $scope.showAlbums = function() {
      $scope.snipTab = false;
    }

    $scope.showSnips = function() {
      $scope.snipTab = true;
    }

    // This function is invoked every time an album name is clicked on the
    // profile page. It passes the Facebook service's getAlbumPhotos method
    // the name and ID of the clicked album, which returns a promise. Upon
    // success, we are given a response, which are the photos for that specific
    // Facebook album. We then parse the data and push it to $scope.albumPhotos.
    $scope.albumClick = function(name, id) {
      $scope.albumPhotos = [];
      if(!id){
        Facebook.getWallData().success(function(resp){
          var parse = JSON.parse(resp);
          for (var i = 0; i < parse.wallPhotos.picture.length;i++){
            $scope.albumPhotos.push({
              src: parse.wallPhotos.picture[i],
              checked: false,
            });
          }
          console.log(resp);
        })
      }else{
        Facebook.getAlbumPhotos(name, id).success(function(resp) {
          var parse = JSON.parse(resp);
          console.log(parse);
            for (var i = parse[name].length - 1; i >= 0; i--) {
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

    }

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
        };
      };
      pic.checked = false;
    };

    // This function is invoked on initialization of this controller. It fetches
    // the album names for the logged in Facebook user, which allows them to
    // select an album to fetch photos from.
    $scope.init = function() {
      Facebook.getAlbumData().success(function(resp) {
        $scope.parse = JSON.parse(resp);
        for (var key in $scope.parse) {
          $scope.albumNames.push($scope.parse[key]);
        }
          $scope.albumNames.push({name:'Facebook Wall Photos'});
        document.getElementById('content').setAttribute('height', sceneHeight());
      });
    }();

    // $scope.init();

  }]);
