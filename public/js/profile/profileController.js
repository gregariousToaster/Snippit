'use strict';

angular.module('snippit.profile', ['snippit'])
  .controller('ProfileController', ['$scope', 'Facebook', '$window', 'Snips', '$http', function($scope, Facebook, $window, Snips, $http) {

    // Facebook user data (as of right now, name and id)
    $scope.facebookUser = {};

    $scope.snipTab = false;

    //stores instagram photos
    $scope.instagramPhotos = [];

    // Album names
    $scope.albumNames = [];

    // Album photos
    $scope.albumPhotos = {};

    $scope.snipName = '';

    $scope.snipId = null;

    $scope.newSnip = true;

    // Snip photos
    $scope.snipPhotos = {};

    // Snips
    $scope.snips = {};

    // Keeps track of whether to show the loading gif on fetching data
    $scope.loading = false;


    // Invoke Facebook getFacebook user method, on success, assign
    // $scope.facebookUser to that response (Facebook name and id).
    $scope.fetchUser = function() {
      Facebook.getFacebookUser().success(function(resp) {
        $scope.facebookUser = resp;
        Snips.getSnips(resp.snips).success(function(resp) {
          $scope.snips = resp;
        });
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

    // Adds a snip to the database with the photos, snip name, and
    // Facebook user ID.
    $scope.snipAdd = function() {
      Snips.addSnip({img: $scope.snipPhotos, name: $scope.snipName, userId: $scope.facebookUser.id})
        .success(function(resp){
          $scope.snips[resp] = {
            name: $scope.snipName,
            img: $scope.snipPhotos
          };
          $scope.snipName = '';
          $scope.snipPhotos = {};
        });
    };

    // Snip close is invoked when a user edits their snip.
    // If they saved their snip without any photos in it, we
    // call deleteSnip to remove the snip from the database.
    // We also delete that snip from the snips object, which
    // displays all the snip names. If the snip has photos,
    // the snip is updated in the database.
    $scope.snipClose = function() {
      if (Object.keys($scope.snipPhotos).length === 0) {
        console.log('NO PHOTOS, DELETING SNIP FROM DATABASE');
        Snips.deleteSnip($scope.snipName)
        delete $scope.snips[$scope.snipId];
        $scope.snipPhotos = {};
        $scope.snipName = '';
      } else {
        $scope.snips[$scope.snipId].img = $scope.snipPhotos;
        Snips.saveSnip({img: $scope.snipPhotos, name: $scope.snipName, _id: $scope.snipId})
          .success(function(resp){
            console.log(resp);
            $scope.snipName = '';
            $scope.snipPhotos = {};
          });
      }
      $scope.newSnip = true;
    };

    $scope.showAlbums = function() {
      $scope.snipTab = false;
    };

    $scope.showSnips = function() {
      $scope.snipTab = true;
    };

    //authorize and import instagram photos
    $scope.showInstagram = function(){
      $scope.loading = true;
      $scope.albumPhotos = {};
      Facebook.getInstagram().success(function(resp) {
          $scope.albumPhotos = JSON.parse(resp);
          $scope.loading = false;
      });
    }
    // This function is invoked every time an album name is clicked on the
    // profile page. It passes the Facebook service's getAlbumPhotos method
    // the name and ID of the clicked album, which returns a promise. Upon
    // success, we are given a response, which are the photos for that specific
    // Facebook album. We then parse the data and push it to $scope.albumPhotos.
    $scope.albumClick = function(name, id) {
      $scope.loading = true;
      $scope.albumPhotos = {};
      //When there is no id, we know it's the "album" of the most recently tagged
      //photos of the user.
      if(!id){
        Facebook.getWallData().success(function(resp){
          var pics = JSON.parse(resp).wallPhotos;
          for (var i = 0; i < parse.picture.length;i++){
            $scope.loading = false;
            $scope.albumPhotos.push({
              src: pics.picture[i],
            });
          }
        });
      } else {
        Facebook.getAlbumPhotos(name, id).success(function(resp) {
          var parse = JSON.parse(resp);
            for(var key in parse) {
              $scope.loading = false;
              $scope.albumPhotos = parse[key];
            }
            console.log($scope.albumPhotos)
        });
      }
    };

    // Clicking on a snip assigns that snip's info to variables that
    // hold onto that data until we perform a saving or adding action
    // on it.
    $scope.snipClick = function(key, value) {
      $scope.snipId = key;
      $scope.snipPhotos = value.img;
      $scope.newSnip = false;
      $scope.snipName = value.name;
    };

    // Adds a clicked photo to the snipPhotos object, which consists of
    // the picture ID as the key, the link, thumbnail, and position of
    // the photo (within the snippit) for the values.
    $scope.checkOn = function(id, pic) {
      var pos = Object.keys($scope.snipPhotos).length;
      $scope.snipPhotos[id] = {
        src: pic.src,
        thumb: pic.thumb,
        position: pos
      };
    };

    // Deletes a photo from snipPhotos when a user clicks on a snip sidebar
    // photo.
    $scope.checkOff = function(pic) {
      delete $scope.snipPhotos[pic];
    };

    // This function is invoked on initialization of this controller. It fetches
    // the album names for the logged in Facebook user, which allows them to
    // select an album to fetch photos from. It's also invoking fetchUser and
    // fetchSnips, which fetches data for the current logged in user, as well as
    // that user's saved snips.
    $scope.init = function() {
      Facebook.getAlbumData().success(function(resp) {
        var parse = JSON.parse(resp);
        for (var key in parse) {
          $scope.albumNames.push(parse[key]);
        }
        $scope.albumNames.push({name:'Facebook Wall Photos'});
      });
      $scope.fetchUser();
      $scope.fetchSnips();
    }();
  }]);
