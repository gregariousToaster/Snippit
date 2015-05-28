'use strict';

angular.module('snippit.three', ['snippit'])
  .controller('ThreeController', ['$scope', 'ThreeFactory', '$window', '$document', function($scope, ThreeFactory, $window, $document) {
    
    var scene, renderer, camera;

    $scope.objects = [];
    $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};

    var init = function(){
      camera = new THREE.PerspectiveCamera(30, $window.innerWidth / ($window.innerHeight - 200), 1, 10000);
      camera.position.z = 800;
      scene = new THREE.Scene();

      var vector = new THREE.Vector3();

      var len = data.photos.data.concat(data.photos.data).concat(data.photos.data).concat(data.photos.data).length

      for (var i = 0; i < len; i++) {
        ThreeFactory.createScene(i, data.photos.data.concat(data.photos.data).concat(data.photos.data).concat(data.photos.data), scene, $scope.objects);
        ThreeFactory.table(5, i, $scope.targets.table);
        ThreeFactory.sphere(i, vector, $scope.targets.sphere, 800, len);
        ThreeFactory.helix(1, i, vector, $scope.targets.helix, 0.175, 450, 900, 900, 8);
        ThreeFactory.helix(2, i, vector, $scope.targets.doubleHelix, 0.175, 450, 500, 500, 50);
        ThreeFactory.helix(3, i, vector, $scope.targets.tripleHelix, 0.1, 450, 500, 500, 50);
        ThreeFactory.grid(5, i, $scope.targets.grid);
      };
      console.log('TARGETS', $scope.targets);

      renderer = new THREE.CSS3DRenderer();
      renderer.setSize($window.innerWidth, $window.innerHeight - 200);
      renderer.domElement.style.position = 'absolute';

      $scope.transform($scope.targets.table, 2000);


      document.getElementById('container').appendChild(renderer.domElement);
      // $document.find('container').append(angular.element(renderer.domElement));

      window.controls = new THREE.OrbitControls(camera);
      window.controls.damping = 0.2;
      window.controls.addEventListener('change', $scope.render);
    };

    $scope.transform = function(targets, duration) {

      TWEEN.removeAll();

      for (var i = 0; i < $scope.objects.length; i++) {
        var object = $scope.objects[i];
        var target = targets[i];

        new TWEEN.Tween(object.position)
          .to({x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to({x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate($scope.render)
        .start();
    };


    var animate = function() {
      requestAnimationFrame(animate);
      TWEEN.update();
      window.controls.update();
    };

    angular.element(document).ready(function () {
      init();
      animate();
    });

    $scope.render = function(){
      renderer.render(scene, camera);
    };
  }]);

