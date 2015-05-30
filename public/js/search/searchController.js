'use strict';

angular.module('snippit.search', ['snippit'])
  .controller('SearchController', ['$scope', function($scope) {

    // Album names, used for search auto complete
    $scope.albums = ['person1', 'person2', 'person3', 'person4', 'person5'];

    // Query string that is the selected album
    $scope.query = '';

    // This function fetches the photos from the selected album upon submit
    $scope.requestAlbumData = function() {
      console.log('querrrryyyy', $scope.query);
    };
  }]);
