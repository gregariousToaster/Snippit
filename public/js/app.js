'use strict';

angular.module('snippit',
  ['snippit.main',
   'snippit.auth',
   'snippit.famous',
   'ui.router',
   'famous.angular',
  ])
  .run(function() {
  })
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html'
      })
      .state('app.famous', {
        url: '/famous',
        templateUrl: 'templates/famous.html',
        controller: 'FamousController',
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

