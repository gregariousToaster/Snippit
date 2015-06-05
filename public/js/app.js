'use strict';

angular.module('snippit', ['snippit.main',
  'snippit.services',
  'snippit.three',
  'snippit.auth',
  'snippit.profile',
  'ui.router'
  ])
  // This run block checks whether the user is authenticated or not by making
  // a get request to the '/auth/isAuthenticated' route and upon a successful
  // request, checks the response to see if the user is authenticated and
  // redirects them to the 'signin' state if they're not authenticated. This
  // happens on any state change.
  .run(['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
    $rootScope.$on('$stateChangeStart', function(e, toState) {
      if (toState && toState.authenticate) {
        $http.get('/auth/isAuthenticated').success(function(resp) {
          if (!resp.auth) {
            $location.path('/signin');
          }
        });
      }
    });
  }])
  // Configures the various states for the application.
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html',
        controller: 'MainController',
        authenticate: true
      })
      .state('three', {
        url: '/three/{snipId}',
        templateUrl: 'templates/three.html',
        controller: 'ThreeController',
      })
      .state('app.three', {
        url: '/three',
        views: {
          'content': {
            templateUrl: 'templates/three.html',
            controller: 'ThreeController'
          }
        },
        authenticate: true
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'content': {
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
          }
        },
        authenticate: true
      })
      .state('signin', {
        url: '/signin',
        templateUrl: 'templates/signin.html',
        controller: 'AuthController',
      })
      .state('privacy', {
        url: '/privacy',
        templateUrl: 'templates/privacy.html',
        controller: 'MainController',
      })
      .state('terms', {
        url: '/terms',
        templateUrl: 'templates/terms.html',
        controller: 'MainController',
      });
    // If a requested state is invalid, it will redirect to the three state
    $urlRouterProvider.otherwise('/app/three');
  }]);

