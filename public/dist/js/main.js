'use strict';

angular.module('snippit', ['snippit.main',
  'snippit.auth',
  'ui.router'
  ])
  .run(function() {
  })
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html',
        controller: 'MainController',
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'AuthController',
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'templates/signup.html',
        controller: 'AuthController',
      });
    $urlRouterProvider.otherwise('/app');
  }]);


'use strict';

angular.module('snippit.auth', ['snippit'])
  .controller('AuthController', ['$scope', '$window', function($scope, $window) {

    $scope.facebook = function() {
      $window.location.href = 'auth/facebook';
    };
  }]);

'use strict';

angular.module('snippit.main', ['snippit'])
  .controller('MainController', ['$scope', function($scope) {

  }]);
