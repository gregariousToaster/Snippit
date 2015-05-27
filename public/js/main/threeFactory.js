angular.module('snippit.threeFactory', ['snippit'])
  .factory('threeFactory', ['$scope', '$window', function($scope, $window){

    var on = function(){
      
    }


    return {
      //return all of the functions
      on: on
    }

  }]);