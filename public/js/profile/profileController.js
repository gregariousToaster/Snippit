'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$scope', 'Facebook', function($scope, Facebook) {

    $scope.snippits = [];
    $scope.albumPhotos = [];
    $scope.parse = null;

    $scope.snipClick = function(name, id) {
      $scope.albumPhotos = [];
      Facebook.getAlbumPhotos(name, id).success(function(resp) {
        $scope.parse = JSON.parse(resp);
        for (var key in $scope.parse) {
          $scope.albumPhotos.push($scope.parse[key]);
        }
        console.log('$SCOPE ALBUM PHOTOS', $scope.albumPhotos);
      });
    };

    $scope.init = function() {
      Facebook.getAlbumData().success(function(resp) {
        $scope.parse = JSON.parse(resp);
        for (var key in $scope.parse) {
          $scope.snippits.push($scope.parse[key]);
        }
      });
    };

    $scope.init();

  }]);
