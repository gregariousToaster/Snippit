
'use strict';

angular.module('snippit.mobile', ['snippit'])
  .controller('MobileController', ['$scope', 'ThreeFactory', '$window', '$document', 'Facebook', 'Snips', '$stateParams', '$rootScope', function($scope, ThreeFactory, $window, $document, Facebook, Snips, $stateParams, $rootScope) {

    // These instantiate the THREE.js scene, renderer, camera, controls, and data.
    var scene, renderer, camera, controls;

    //Setup is a boolean that lets us know not to render the scene until we have
    //the facebook data.
    var setup = false;
    $scope.hiddenMenu = true;


    $scope.showMobileMenu = function() {
      $scope.hiddenMenu = !$scope.hiddenMenu;
    };

    $scope.fetchUser = function() {
      Facebook.getFacebookUser().success(function(resp) {
        $rootScope.facebookUser = resp;
        Snips.getSnips(resp.snips).success(function(resp) {
          $rootScope.snips = JSON.parse(resp);
        });
      });
    };

    $scope.view3D = function(key, value) {
      $rootScope.snipPhotos = value.img;
      $rootScope.snipId = key;
      $scope.hiddenMenu = true;
      $scope.snipName = value.name;
      $scope.rerender();
    };


    $scope.objects = [];
    $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
    $scope.targetNames = [['table', 'Table'], ['sphere', 'Sphere'], ['helix', 'Helix'], ['doubleHelix', 'Double Helix'], ['tripleHelix', 'Triple Helix'], ['grid', 'Grid']];

    var prepFb = function(resp) {
      var parsed = JSON.parse(resp.data);

      data = {
        pictures: parsed.wallPhotos.picture,
        thumbnails: parsed.wallPhotos.thumbnail
      };

      return data;
    };

    var prepSnip = function(resp) {
      data = {
        pictures: [],
        thumbnails: []
      }

      for(var key in resp) {
        data.pictures.push(resp[key].src);
        data.thumbnails.push(resp[key].thumb);
      }

      return data;
    };

    var threeJS = function(data) {

      //start the camera zoomed out 1500 from the origin
      camera = new THREE.PerspectiveCamera(30, $window.innerWidth / $window.innerHeight, 1, 10000);
      camera.position.z = 2000;
      scene = new THREE.Scene();

      setup = true;

      var vector = new THREE.Vector3();

      var len = data.thumbnails.length;


      for (var i = 0; i < len; i++) {
        ThreeFactory.createObject(i, data.thumbnails, scene, $scope.objects, $scope.hit);
        ThreeFactory.table(10, i, $scope.targets.table);
        ThreeFactory.sphere(i, vector, $scope.targets.sphere, 800, len);
        ThreeFactory.helix(1, i, vector, $scope.targets.helix, 0.175, 450, 900, 900, 8);
        ThreeFactory.helix(2, i, vector, $scope.targets.doubleHelix, 0.175, 450, 500, 500, 50);
        ThreeFactory.helix(3, i, vector, $scope.targets.tripleHelix, 0.1, 450, 500, 500, 50);
        ThreeFactory.grid(5, i, $scope.targets.grid);
      }

      renderer = new THREE.CSS3DRenderer();
      renderer.setSize($window.innerWidth, $window.innerHeight);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.classList.add('render');

      $scope.transform($scope.targets.table, 2000);

      document.getElementById('container').appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);

      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.damping = 0.2;
      controls.addEventListener('change', $scope.render);
    };

    // Now checks to see if photos currently exist in the database for
    // this user. If not, it'll fetch them from Facebook, if it does, it'll
    // fetch from MongoDB.
    var init = function(){
      if ($rootScope.snipId) {
        threeJS(prepSnip($rootScope.snipPhotos));
      } else {
        Facebook.getWallData()
          .then(function(resp){
          if (resp.data.bool === 'false') {
            Facebook.refreshWallData()
            .then(function(resp) {
              threeJS(prepFb(resp));
            });
          } else {
            threeJS(prepFb(resp));
          }
        });
      }
    };

    //open a modal fram with a version of the picture when clicked
    $scope.hit = function(){
      Modal.open({
         content: "<div class='imageResize'><img src='" + data.pictures[this] + "' /></div>",
         draggable: false,
         width: 'auto',
         context: this
       });
    };

    //when a new transformatoion begins, move the camera back to its initial position
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

    $scope.hiddenMenu = true;

    };

    //This is to make the card movement from position to position more interesting
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

    //when the window is resized
    var onWindowResize = function() {

      camera.aspect = $window.innerWidth / $window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize($window.innerWidth, $window.innerHeight);

      $scope.render();
    };

    var animate = function() {
      requestAnimationFrame(animate);
      if (setup) {
        TWEEN.update();
        controls.update();
      }
    };

    angular.element(document).ready(function () {
      init();
      animate();
      $scope.fetchUser();
    });

    $scope.render = function(){
      renderer.render(scene, camera);
    };

    $scope.rerender = function() {
      document.getElementById('container').removeChild(document.getElementsByClassName('render')[0]);
      $scope.objects = [];
      $scope.targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
      init();
      animate();
    };
  }]);