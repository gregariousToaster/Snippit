'use strict';

angular.module('snippit.main', ['snippit', 'snippit.services'])
  .controller('MainController', ['$rootScope', '$scope', 'Facebook', 'Snips', function($rootScope, $scope, Facebook, Snips) {

    $rootScope.facebookUser = {};

    $rootScope.loading = false;

    $scope.tab = 1;

    $scope.albumNames = [];

    $rootScope.snipPhotos = {};

    $scope.showTab = function(n) {
      $scope.tab = n;
    };

    $scope.fetchUser = function() {
      Facebook.getFacebookUser().success(function(resp) {
        $rootScope.facebookUser = resp;
        console.log('RESP', resp);
        Snips.getSnips(resp.snips).success(function(resp) {
          $scope.snips = resp;
        });
      });
    };

    $scope.albumClick = function(name, id) {
      $rootScope.loading = true;
      $rootScope.albumPhotos = {};
      if(!id){
        Facebook.getWallData().success(function(resp){
        //WE'LL COME BACK TO THIS
          var pics = JSON.parse(resp).wallPhotos;
          for (var i = 0; i < parse.picture.length;i++){
            $rootScope.loading = false;
            $rootScope.albumPhotos.push({
              src: pics.picture[i],
            });
          }
        });
      } else {
        Facebook.getAlbumPhotos(name, id).success(function(resp) {
          var parse = JSON.parse(resp);
            for(var key in parse) {
              $rootScope.loading = false;
              $rootScope.albumPhotos = parse[key];
            }
        });
      }
    };

    $scope.snipClick = function(key, value) {
      $rootScope.snipId = key;
      $rootScope.snipPhotos = value.img;
      $rootScope.newSnip = false;
      $scope.snipName = value.name;
      $rootScope.snipOpen = true;
    };

    $scope.init = function() {

      Facebook.getAlbumData().success(function(resp) {
        var parse = JSON.parse(resp);
        for (var key in parse) {
          $scope.albumNames.push(parse[key]);
        }
        $scope.albumNames.push({name:'Facebook Wall Photos'});
      });
      $scope.fetchUser();
    }();

  }]);
