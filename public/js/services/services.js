'use strict';

angular.module('snippit.services', ['snippit'])
  .factory('ThreeFactory', function() {


    var createScene = function(i, collection, scene, objects, click){
      var el = document.createElement('div');
      el.className = 'element';

      var image = document.createElement('img');
      image.src = collection[i].images[5].source;
      el.appendChild(image);

      var object = new THREE.CSS3DObject(el);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);

      if(click){
        var bound = click.bind(i);
        el.addEventListener('click', bound);
      }

      objects.push(object);
    };

    var table = function(n, i, target){
      var object = new THREE.Object3D();
      object.position.x = ((i % n) * 140) - 280;
      object.position.y = -((Math.floor(i / n) + 1) * 180) + 540;
      target.push(object);
    };


    var sphere = function(i, vector, target, r, len){
      var phi = Math.acos(-1 + (2 * i) / len);
      var theta = Math.sqrt(len * Math.PI) * phi;

      var object = new THREE.Object3D();

      object.position.x = r * Math.cos(theta) * Math.sin(phi);
      object.position.y = r * Math.sin(theta) * Math.sin(phi);
      object.position.z = r * Math.cos(phi);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      target.push(object);
    };


    var helix = function(n, i, vector, target, spacing, offset, xRad, zRad, step){
      var object = new THREE.Object3D();
      var phi = i * spacing + (i % n)/n * (Math.PI * 2);

      object.position.x = xRad * Math.sin(phi);
      object.position.y = -(i * step) + offset;
      object.position.z = zRad * Math.cos(phi);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);
      target.push(object);
    };

    var grid = function(n, i, target){
      var object = new THREE.Object3D();

      object.position.x = ((i % n) * 400) - 800;
      object.position.y = (-(Math.floor(i / n) % n) * 400) + 800;
      object.position.z = (Math.floor(i / (n * n))) * 1000 - 2000;

      target.push(object);
    };

    return {
      createScene: createScene,
      table: table,
      sphere: sphere,
      helix: helix,
      grid: grid
    };
  })
  .factory('Facebook', ['$http', function($http) {

    var getWallData = function() {
      return $http.get('/getFacebookWall');
    };

    var getAlbumData = function() {
      return $http.get('/getFacebookAlbums');
    }

    return {
      getWallData: getWallData,
      getAlbumData: getAlbumData
    };
  }])
;
