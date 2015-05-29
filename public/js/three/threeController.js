'use strict';

angular.module('snippit.three', ['snippit'])
  .controller('ThreeController', ['$scope', 'ThreeFactory', '$window', '$document', 'Facebook', function($scope, ThreeFactory, $window, $document, Facebook) {
    
    var scene, renderer, camera, controls, picData;

    var viewHeight = function(){
      return $window.innerHeight - (document.getElementsByClassName('header')[0].offsetHeight);
    }

    $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};

    var init = function(){
      console.log('INITIATED');
      if(!picData){
        picData = data;
      }

      if(renderer){
        document.getElementById('container').removeChild(renderer.domElement);
      }

      $scope.objects = [];
      $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
      
      camera = new THREE.PerspectiveCamera(30, $window.innerWidth / viewHeight(), 1, 10000);
      camera.position.z = 2500;
      scene = new THREE.Scene();

      var vector = new THREE.Vector3();

      var len = picData.length

      for (var i = 0; i < len; i++) {
        ThreeFactory.createScene(i, picData, scene, $scope.objects, $scope.log);
        ThreeFactory.table(5, i, $scope.targets.table);
        ThreeFactory.sphere(i, vector, $scope.targets.sphere, 800, len);
        ThreeFactory.helix(1, i, vector, $scope.targets.helix, 0.175, 450, 900, 900, 8);
        ThreeFactory.helix(2, i, vector, $scope.targets.doubleHelix, 0.175, 450, 500, 500, 50);
        ThreeFactory.helix(3, i, vector, $scope.targets.tripleHelix, 0.1, 450, 500, 500, 50);
        ThreeFactory.grid(5, i, $scope.targets.grid);
      };

      renderer = new THREE.CSS3DRenderer();
      renderer.setSize($window.innerWidth, viewHeight());
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.classList.add('render');

      $scope.transform($scope.targets.table, 2000);

      document.getElementById('container').appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.damping = 0.2;
      controls.addEventListener('change', $scope.render);
    };

    $scope.log = function(){
      console.log(this);
    }

    $scope.clicked = function(targets){
      $scope.transform(targets, 2000);

      new TWEEN.Tween(camera.position)
        .to({x: 0, y: 0, z: 3000}, 2000)
        .start();

      new TWEEN.Tween(camera.rotation)
        .to({_x: -0, _y: 0, _z: -0}, 2000)
        .start();

      new TWEEN.Tween(controls.center)
        .to({x: 0, y: 0, z: 0}, 2000)
        .start();
    }

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

      camera.aspect = window.innerWidth / viewHeight();
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, viewHeight());

      $scope.render();
    };

    var animate = function() {
      requestAnimationFrame(animate);
      TWEEN.update();
      controls.update();
    };

    angular.element(document).ready(function () {
      init();
      animate();
    });

    $scope.render = function(){
      renderer.render(scene, camera);
    };

    $scope.getPics = function(){
      console.log('SENT REQ');
      Facebook.getWallData()
        .then(function(resp){
          picData = JSON.parse(resp.data);
          console.log(picData);
          init();
        });
    };

  }]);

