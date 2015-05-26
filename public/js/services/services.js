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
