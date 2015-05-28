'use strict';

angular.module('snippit.main', ['snippit'])
  .controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.searchData = '';

    $scope.requestData = function() {
      console.log('/*/*/*REQUESTING DATA*/*/*/');
      $http.post('/', {searchData: $scope.searchData})
        .success(function(resp) {
          console.log('RESPONSE', resp);
        });
    };
  }]);
