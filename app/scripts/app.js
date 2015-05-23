'use strict';

angular.module('snippit',
  ['ui.router',
    'famous.angular' ])
  .run(function(){

  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl',
        auth: true
      });

    $urlRouterProvider.otherwise('/');
  })
;
