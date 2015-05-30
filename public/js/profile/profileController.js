'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$scope', 'Facebook', function($scope, Facebook) {

    // Album names
    $scope.albumNames = [];

    // Album photos
    $scope.albumPhotos = [];

    // Parsed data
    $scope.parse = null;

    // This function is invoked every time an album name is clicked on the
    // profile page. It passes the Facebook getAlbumPhotos method the name
    // and ID of the clicked album, which returns a promise. Upon success,
    // we are given a response, which are the photos for that specific Facebook
    // album. We then parse the data and push it to $scope.albumPhotos.
    $scope.albumClick = function(name, id) {
      $scope.albumPhotos = [];
      Facebook.getAlbumPhotos(name, id).success(function(resp) {
        $scope.parse = JSON.parse(resp);
        for (var key in $scope.parse) {
          $scope.albumPhotos.push($scope.parse[key]);
        }
        console.log('$scope.albumPhotos: ', $scope.albumPhotos);
      });
    };

    // This function is invoked on initialize of this controller. It fetches
    // the album names for the logged in Facebook user, which allows them to
    // select an album to fetch photos from.
    $scope.init = function() {
      Facebook.getAlbumData().success(function(resp) {
        $scope.parse = JSON.parse(resp);
        for (var key in $scope.parse) {
          $scope.albumNames.push($scope.parse[key]);
        }
      });
    };

    $scope.init();

  }]);
