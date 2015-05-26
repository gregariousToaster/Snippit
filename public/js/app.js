'use strict';

angular.module('snippit', ['snippit.main',
  'snippit.auth',
  'snippit.services',
  'ui.router'
  ])
  .run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth) {
    $rootScope.$on('$stateChangeStart', function(e, toState, fromState) {
      console.log('e ', e, 'toState ', toState, 'fromState ', fromState);
      if (toState.authenticate && !Auth.isAuth()) {
        $location.path('/signin');
      }
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

