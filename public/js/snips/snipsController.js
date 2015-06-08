
'use strict';

angular.module('snippit.snips', ['snippit'])
  .controller('SnipsController', ['$rootScope', '$scope', 'ThreeFactory', '$window', '$document', 'Facebook', 'Snips', '$stateParams', function($rootScope, $scope, ThreeFactory, $window, $document, Facebook, Snips, $stateParams) {

  $scope.snipAdd = function() {
      $rootScope.snipOpen = false;  
      Snips.addSnip({img: $scope.snipPhotos, name: $scope.snipName, userId: $scope.facebookUser.id})
        .success(function(resp){
          $rootScope.snips[resp] = {
            name: $rootScope.snipName,
            img: $rootScope.snipPhotos
          };
          $rootScope.snipName = '';
          $rootScope.snipPhotos = {};
        });
    };

    $scope.snipClose = function() {
      $rootScope.snipOpen = false;  
      if (Object.keys($rootScope.snipPhotos).length === 0) {
        delete $rootScope.snips[$scope.snipId];
        $rootScope.snipPhotos = {};
        $rootScope.snipName = '';
      } else {
        $rootScope.snips[$scope.snipId].img = $scope.snipPhotos;
        Snips.saveSnip({img: $scope.snipPhotos, name: $scope.snipName, _id: $scope.snipId})
          .success(function(resp){
            console.log(resp);
            $rootScope.snipName = '';
            $rootScope.snipPhotos = {};
          });
      }
      $rootScope.newSnip = true;
    };
    
    $scope.checkOff = function(pic) {
      delete $rootScope.snipPhotos[pic];
      if(Object.keys($rootScope.snipPhotos).length === 0){
        $rootScope.snipOpen = false;
      }
    };
  }]);