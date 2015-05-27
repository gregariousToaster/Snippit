'use strict';

angular.module('snippit', ['snippit.main',
  'snippit.auth',
  'snippit.services',
  'ui.router'
  ])
  .run(['$rootScope', '$location', '$http', function($rootScope, $location, $http) {
    $rootScope.$on('$stateChangeStart', function(e, toState, fromState) {
      $http.get('/auth/isAuthenticated').success(function(resp) {
        if (!resp['auth']) {
          $location.path('/signin');
        }
      })
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


'use strict';

angular.module('snippit.auth', ['snippit', 'snippit.services'])
  .controller('AuthController', ['$scope', '$window', 'Auth', function($scope, $window, Auth) {

  }]);

'use strict';

angular.module('snippit.main', ['snippit'])
  .controller('MainController', ['$scope', function($scope) {

  }]);

angular.module('snippit.services', ['snippit'])
  .factory('Auth', ['$http', '$location', '$window', function($http, $location, $window) {

    var signin = function() {
      return $http({
        method: 'GET',
        url: '/auth/facebook'
      })
      .then(function(resp) {
        $window.localStorage.setItem('com.snippit', resp);
        $location.path('/app');
      });
    };

    var isAuth = function() {
      return !!$window.localStorage.getItem('com.snippit');
    }

    var signout = function() {
      $window.localStorage.removeItem('com.snippit');
      $location.path('/signin');
    }

    return {
      signin: signin,
      signout: signout,
      isAuth: isAuth,
      signout: signout
    };

  }]);
