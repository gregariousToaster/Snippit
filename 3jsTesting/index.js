var camera, scene, renderer;
var controls;

var view = 'table';
var objects = [];
var targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
var options = {
  table: {
    minPolar: (Math.PI/4),
    maxPolar: (Math.PI/4 * 3),
    minAzimuth: -1,
    maxAzimuth: 1
  },
  sphere: {
    minPolar: 0,
    maxPolar: Math.PI,
    minAzimuth: -Infinity,
    maxAzimuth: Infinity
  },
  helix: {
    minPolar: (Math.PI/4),
    maxPolar: (Math.PI/4 * 3),
    minAzimuth: -1,
    maxAzimuth: 1
  },
  doubleHelix: {
    minPolar: (Math.PI/4),
    maxPolar: (Math.PI/4 * 3),
    minAzimuth: -1,
    maxAzimuth: 1
  },
  tripleHelix: {
    minPolar: (Math.PI/4),
    maxPolar: (Math.PI/4 * 3),
    minAzimuth: -1,
    maxAzimuth: 1
  },
  grid: {
    minPolar: (Math.PI/4),
    maxPolar: (Math.PI/4 * 3),
    minAzimuth: -1,
    maxAzimuth: 1
  }
};

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 800;
  scene = new THREE.Scene();

  // init objects
  var pics = data.photos.data.concat(data.photos.data).concat(data.photos.data);

  for (var i = 0; i < pics.length; i++) {

    var el = document.createElement('div');
    el.className = 'element';

    var image = document.createElement('img');
    image.src = pics[i].source;
    el.appendChild(image);

    var object = new THREE.CSS3DObject(el);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    scene.add(object);

    var cardClick = function(){
      console.log(objects[this]);
    }

    var bound = cardClick.bind(i);

    el.addEventListener('click', bound);

    objects.push(object);

    // table

    var tableObject = new THREE.Object3D();
    tableObject.position.x = ((i % 5) * 140) - 280; // 18 columns
    tableObject.position.y = - ((Math.floor(i / 5) + 1) * 180) + 540; // 10 rows

    targets.table.push(tableObject);
  }

  // sphere

  var sphereVector = new THREE.Vector3();

  for (var i = 0, l = objects.length; i < l; i++) {

    var phi = Math.acos(-1 + ( 2 * i) / l);
    var theta = Math.sqrt(l * Math.PI) * phi;

    var sphereObject = new THREE.Object3D();

    sphereObject.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
    sphereObject.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
    sphereObject.position.z = 800 * Math.cos( phi );

    sphereVector.copy(sphereObject.position).multiplyScalar(2);

    sphereObject.lookAt(sphereVector);

    targets.sphere.push(sphereObject);

  }

  // helixes
  helix(1, objects, 'helix', 0.175, 450, 900, 900, 8);
  helix(2, objects, 'doubleHelix', 0.175, 450, 500, 500, 50);
  helix(3, objects, 'tripleHelix', 0.1, 450, 500, 500, 50);

  for (var i = 0; i < objects.length; i++) {

    var gridObject = new THREE.Object3D();

    gridObject.position.x = ((i % 5) * 400) - 800;
    gridObject.position.y = (-(Math.floor(i / 5) % 5) * 400) + 800;
    gridObject.position.z = (Math.floor(i / 25)) * 1000 - 2000;

    targets.grid.push(gridObject);

  }

  //

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  document.getElementById('container').appendChild(renderer.domElement);

  //Set up the camera controls, overwrite some of the native controls like lookAt()

//on button click, move the camera into position
  var buttonClick = function(event){
    view = this.id;
    transform(targets[view], 2000);
    
    new TWEEN.Tween(camera.position)
      .to({x: 0, y: 0, z: 3000}, 2000)
      .start();

   
    new TWEEN.Tween(camera.rotation)
      .to( {_x: -0, _y: 0, _z: -0}, 2000)
      .easing(TWEEN.Easing.Circular.Out)
      .start();

      //tween the value of the orbit controls center
      //since they have taken over the lookAt function
    new TWEEN.Tween(controls.center)
      .to({x: 0, y: 0, z: 0}, 2000)
      .easing(TWEEN.Easing.Circular.Out)
      .start();
  }

//add event listeners to each of the buttons on the front page
  var buttons = document.getElementsByTagName('button');
  for (var i = 0; i < 6; i++) {
    buttons[i].addEventListener('click', buttonClick, false);
  };
  transform(targets.table, 2000);

  //

  window.addEventListener('resize', onWindowResize, false);

}

function transform(targets, duration) {

  TWEEN.removeAll();

  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
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
    .onUpdate(render)
    .start();
}

function helix(n, collection, targetArr, spacing, offset, xRad, zRad, step){
  var vector = new THREE.Vector3();
  for (var i = 0; i < collection.length; i++) {
    var object = new THREE.Object3D();
    var phi = i * spacing + (i % n)/n * (Math.PI * 2);

    object.position.x = xRad * Math.sin(phi);
    object.position.y = -(i * step) + offset;
    object.position.z = zRad * Math.cos(phi);

    vector.x = object.position.x * 2;
    vector.y = object.position.y;
    vector.z = object.position.z * 2;

    object.lookAt(vector);
    targets[targetArr].push(object);
  }
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  if(controls){
    controls.update();
  }
}

function render() {
  renderer.render(scene, camera);
}

$('#sign').on('click', function(){
  $('#container').toggleClass('blur');
  $('.hidden').fadeIn();
  $('.overlay').fadeOut();
  $('#sign').fadeOut();
  $('#logo').fadeOut();
  controls = new THREE.OrbitControls(camera, null, options[view]);
  controls.damping = 0.2;
  controls.addEventListener( 'change', render );
});