'use strict';

angular.module('snippit.auth', ['snippit'])
  .controller('AuthController', ['$scope', '$window', 'ThreeFactory', function($scope, $window, ThreeFactory) {

    var scene, renderer, camera;

    $scope.objects = [];
    $scope.targets = {sphere: []};

    var init = function(){
      camera = new THREE.PerspectiveCamera(30, $window.innerWidth / $window.innerHeight, 1, 10000);
      camera.position.z = 3000;
      scene = new THREE.Scene();

      var vector = new THREE.Vector3();

      var len = data.length

      for (var i = 0; i < len; i++) {
        ThreeFactory.createScene(i, data, scene, $scope.objects);
        ThreeFactory.sphere(i, vector, $scope.targets.sphere, 800, len);
      };

      renderer = new THREE.CSS3DRenderer();
      renderer.setSize($window.innerWidth, $window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.classList.add('render');

      $scope.transform($scope.targets.sphere, 2000);

      document.getElementById('signin').appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);
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


    var onWindowResize = function() {

      camera.aspect = window.innerWidth / $window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, $window.innerHeight);

      $scope.render();
    };


    var animate = function() {
      requestAnimationFrame(animate);
      TWEEN.update();
    };

    angular.element(document).ready(function () {
      init();
      animate();
    });

    $scope.render = function(){
      renderer.render(scene, camera);
    };

  }]);
