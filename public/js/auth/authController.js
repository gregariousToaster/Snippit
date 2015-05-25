'use strict';

angular.module('snippit.auth', ['snippit'])
  .controller('AuthController', ['$scope', '$window', function($scope, $window) {

    $scope.facebook = function() {
      $window.location.href = 'auth/facebook';
    };
  }]);
