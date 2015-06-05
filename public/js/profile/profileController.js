'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$rootScope', '$scope', 'Facebook', '$window', 'Snips', '$http', function($rootScope, $scope, Facebook, $window, Snips, $http) {

    $rootScope.bool.profile = true;

    $scope.viewSnip = function(id){
      console.log(id);
    }


    // Invoke Facebook getFacebook user method, on success, assign
    // $scope.facebookUser to that response (Facebook name and id).
    $scope.fetchUser = function() {
      Snips.getSnips($rootScope.facebookUser.snips).success(function(resp) {
        $scope.snips = resp;
      });
    };

    // Check if there any items in $scope.snipPhotos to determine
    // whether or not we should show the snip sidebar on the right.
    // If there are no photos in that object, it means that we haven't
    // selected any images to add to our snip or there are no existing
    // photos in an existing snip.
    $scope.snipCheck = function(){
      return !!Object.keys($scope.snipPhotos).length;
    };

    // Call Snips' getSnips method, upon success, responds with
    // a resp object that's an array, which we loop over and set
    // as values on the $scope.snips object. This allows the user
    // to see the snips that they've created.
    $scope.fetchSnips = function(){
      Snips.getSnips().success(function(resp) {
        for (var i = 0; i < resp.length; i++) {
          $scope.snips[resp[i]._id] = {
            name: resp[i].name,
            img: resp[i].img
          }
        }
      })
    }

    // Adds a clicked photo to the snipPhotos object, which consists of
    // the picture ID as the key, the link, thumbnail, and position of
    // the photo (within the snippit) for the values.
    $scope.checkOn = function(id, pic) {

      var pos = Object.keys($rootScope.snipPhotos).length;
      $rootScope.snipPhotos[id] = {
        src: pic.src,
        thumb: pic.thumb,
        position: pos
      };

      $rootScope.snipOpen = true;

    };
  }]);
