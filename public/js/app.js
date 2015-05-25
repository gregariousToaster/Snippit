'use strict';

angular.module('snippit',
  ['snippit.main',
   'snippit.auth',
   'ui.router',
   'famous.angular',
  ])
  .run(function() {
  })
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller: 'MainController',
      })
      .state('app.famous', {
        url: '/famous',
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
    $urlRouterProvider.otherwise('/');
  }]);

