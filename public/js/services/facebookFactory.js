'use strict';

angular.module('snippit.services', ['snippit'])
  .factory('Facebook', ['$http', function($http) {

    // This is a helper function to get the Wall Photos of the current user.
    var getWallData = function() {
      return $http.get('/getData');
    };

    var refreshWallData = function() {
      return $http.get('/getFacebookWall');
    };

    // This is a helper function to get an Album List of the current user.
    var getAlbumData = function() {
      return $http.get('/getFacebookAlbums');
    };

    // This is a helper function to get the Album Photos of the current user,
    // it takes an Album Name and Album ID.
    var getAlbumPhotos = function(name, id) {
      var obj = {name: name, id: id};
      return $http.post('/getFacebookAlbumPhotos', obj);
    };

    // Makes a get request and fetches Facebook user's name and ID.
    var getFacebookUser = function() {
      return $http.get('/facebookUser');
    };
    var fetchInstagram = function(){
      return $http.get('/getInstagram');
    }

    return {
      getWallData: getWallData,
      getAlbumData: getAlbumData,
      getAlbumPhotos: getAlbumPhotos,
      getFacebookUser: getFacebookUser,
      refreshWallData: refreshWallData,
      fetchInstagram: fetchInstagram
    };
  }])
;
