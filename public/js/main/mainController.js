'use strict';

angular.module('snippit.main', ['snippit', 'snippit.services'])
  .controller('MainController', ['Facebook', '$scope', '$window', function(Facebook, $scope, $window) {
      document.getElementById('content').setAttribute('height', $window.innerHeight - (document.getElementsByClassName('header')[0].offsetHeight));
  }]);
