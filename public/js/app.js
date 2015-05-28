'use strict';

angular.module('snippit', ['snippit.main',
  'snippit.services',
  'snippit.three',
  'snippit.auth',
  'ui.router'
  ])
  .run(['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
    $rootScope.$on('$stateChangeStart', function(e, toState, fromState) {
      $http.get('/auth/isAuthenticated').success(function(resp) {
        if (!resp['auth']) {
          $location.path('/signin');
        }
      });
    });
  }])
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html',
        controller: 'MainController',
        authenticate: true
      })
      .state('app.three', {
        url: '/three',
        views: {
          'nest': {
            templateUrl: 'templates/three.html',
            controller: 'ThreeController'
          }
        }
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'AuthController',
      });
    $urlRouterProvider.otherwise('/app/three');
  }]);

