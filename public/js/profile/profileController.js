'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$scope', 'Facebook', '$window', function($scope, Facebook, $window) {

    // Album names
    $scope.albumNames = [];

    // Album photos
    $scope.albumPhotos = [];

    var viewHeight = function(){
      var height = window.innerHeight - (document.getElementsByClassName('header')[0].offsetHeight);
      
      angular.element(document.getElementsByClassName('albumView')[0])
      .attr('height', height);
    }();

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

    $scope.checkToggle = function(pic){
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
