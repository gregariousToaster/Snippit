'use strict';

angular.module('snippit', ['snippit.main',
  'snippit.auth',
  'snippit.famous',
  'ui.router',
  'famous.angular'
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


'use strict';

angular.module('snippit.auth', ['snippit'])
  .controller('AuthController', ['$scope', '$window', function($scope, $window) {

    $scope.facebook = function() {
      $window.location.href = 'auth/facebook';
    };
  }]);

'use strict';

angular.module('snippit.famous', ['snippit'])
  .controller('FamousController', ['$scope', '$famous', function($scope, $famous) {
    var Transitionable = $famous['famous/transitions/Transitionable'];
    var Timer = $famous['famous/utilities/Timer'];

    $scope.log = function(arg) {
      console.log(arg);
    };

    $scope.spinner = {
      speed: 500,
    };
    $scope.rotateY = new Transitionable(0);

    // Run function on every tick of the Famo.us engine
    Timer.every(function() {
      var adjustedSpeed = parseFloat($scope.spinner.speed) / 1200;
      $scope.rotateY.set($scope.rotateY.get() + adjustedSpeed);
    }, 1);

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
    ];
  }]);

'use strict';

angular.module('snippit.main', ['snippit'])
  .controller('MainController', ['$scope', function($scope) {

  }]);
