'use strict';

angular.module('snippit.services', ['snippit'])
  .factory('ThreeFactory', function() {

    // This is a helper function that creates a CSS3D object
    // to be added to  a THREE.js. It takes an iteration count,
    // a collection of image sources, a THREE.js scene,
    // an array to save the object in, and a function to be called on each click.
    var createObject = function(i, collection, scene, objects, click) {
      var el = document.createElement('div');
      el.className = 'element';
      el.setAttribute('ng-show', 'picData[-1]');

      var image = document.createElement('img');
      image.className = 'picImg';
      image.src = collection[i];
      el.appendChild(image);


      var object = new THREE.CSS3DObject(el);
      object.position.x = Math.random() * 4000 - 2000;
      object.position.y = Math.random() * 4000 - 2000;
      object.position.z = Math.random() * 4000 - 2000;
      scene.add(object);

      if (click) {
        var bound = click.bind(i);
        el.addEventListener('click', bound);
      }

      objects.push(object);
    };

    // This is a helper function to create the position necessary for the table shape.
    // It takes a number denoting the columns, an iterator, and a target array to push the object positions into.
    var table = function(n, i, target) {
      var object = new THREE.Object3D();
      object.position.x = ((i % n) * 140) - 280;
      object.position.y = -((Math.floor(i / n) + 1) * 180) + 540;
      target.push(object);
    };

    // This is a helper function to create the position necessary for the sphere shape.
    // It takes an iterator, a vector to lookat, a target array to push the object positions into,
    // a radius, and the number of nodes to be in the sphere.
    var sphere = function(i, vector, target, r, n) {
      var phi = Math.acos(-1 + (2 * i) / n);
      var theta = Math.sqrt(n * Math.PI) * phi;

      var object = new THREE.Object3D();

      object.position.x = r * Math.cos(theta) * Math.sin(phi);
      object.position.y = r * Math.sin(theta) * Math.sin(phi);
      object.position.z = r * Math.cos(phi);

      vector.copy(object.position).multiplyScalar(2);

      object.lookAt(vector);

      target.push(object);
    };

    // This is a helper function to create the position necessary for the helix shapes.
    // It takes a number denoting the strings, an iterator, a vector to lookat,
    // a target array to push the object positions into, a spacing variable, the offset,
    // an X radius, a Z radius,and the step height.
    var helix = function(n, i, vector, target, spacing, offset, xRad, zRad, step) {
      var object = new THREE.Object3D();
      var phi = i * spacing + (i % n) / n * (Math.PI * 2);

      object.position.x = xRad * Math.sin(phi);
      object.position.y = -(i * step) + offset;
      object.position.z = zRad * Math.cos(phi);

      vector.x = object.position.x * 2;
      vector.y = object.position.y;
      vector.z = object.position.z * 2;

      object.lookAt(vector);
      target.push(object);
    };

    // This is a helper function to create the position necessary for the grid shapes.
    // It takes a number denoting the columns and rows, an iterator,
    // and a target array to push the object positions into.
    var grid = function(n, i, target) {
      var object = new THREE.Object3D();

      object.position.x = ((i % n) * 400) - 800;
      object.position.y = (-(Math.floor(i / n) % n) * 400) + 800;
      object.position.z = (Math.floor(i / (n * n))) * 1000 - 2000;

      target.push(object);
    };

    return {
      createObject: createObject,
      table: table,
      sphere: sphere,
      helix: helix,
      grid: grid
    };
  })
  .factory('Facebook', ['$http', function($http) {

    // This is a helper function to get the Wall Photos of the current user.
    var getWallData = function() {
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

    return {
      getWallData: getWallData,
      getAlbumData: getAlbumData,
      getAlbumPhotos: getAlbumPhotos
    };
  }])
;
