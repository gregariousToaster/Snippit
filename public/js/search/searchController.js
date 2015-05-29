'use strict';

angular.module('snippit.search', ['snippit'])
  .controller('SearchController', ['$scope', function($scope) {
    $scope.albums = ['person1', 'person2', 'person3', 'person4', 'person5'];

    $scope.query = "";

    $scope.returnThis = function() {
      console.log('querrrryyyy', $scope.query);
    }
}])
