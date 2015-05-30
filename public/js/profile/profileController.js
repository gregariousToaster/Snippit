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
    // profile page. It passes the Facebook service's getAlbumPhotos method
    // the name and ID of the clicked album, which returns a promise. Upon
    // success, we are given a response, which are the photos for that specific
    // Facebook album. We then parse the data and push it to $scope.albumPhotos.
    $scope.albumClick = function(name, id) {
      $scope.albumPhotos = [];
      Facebook.getAlbumPhotos(name, id).success(function(resp) {
        var parse = JSON.parse(resp);
        console.log(parse);
        for (var key in parse) {
          console.log('KEY: ', parse[key]); // If we could get an image ID we could probably add and remove to a snip item with more ease
          for (var i = parse[key].length - 1; i >= 0; i--) {
            $scope.albumPhotos.push({
              src: parse[key][i],
              checked: false
            });
          }
        }
        console.log('$scope.albumPhotos: ', $scope.albumPhotos);
      });
    };

    $scope.checkToggle = function(pic) {
      console.log('PICTURE', pic);
      pic.checked = !pic.checked;
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
      });
    };

    $scope.init();

  }]);
