var camera, scene, renderer;
var controls;

var view = 'table';
var objects = [];
var targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 800;
  scene = new THREE.Scene();

  // init objects
  createScene(data.photos.data, scene);

  // create shapes
  table(5, objects, 'table');
  sphere(objects, 'sphere', 800);
  helix(1, objects, 'helix', 0.175, 450, 900, 900, 8);
  helix(2, objects, 'doubleHelix', 0.175, 450, 500, 500, 50);
  helix(3, objects, 'tripleHelix', 0.1, 450, 500, 500, 50);
  cube(5, objects, 'grid');

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  document.getElementById('container').appendChild(renderer.domElement);

  //Set up the camera controls, overwrite some of the native controls like lookAt()

  var buttons = document.getElementsByTagName('button');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', buttonClick, false);
  };
  transform(targets.table, 2000);

  window.addEventListener('resize', onWindowResize, false);

  controls = new THREE.OrbitControls(camera);
  controls.damping = 0.2;
  controls.addEventListener( 'change', render );
};

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
};

function buttonClick(event){
  view = this.id;
  transform(targets[view], 2000);
  
  new TWEEN.Tween(camera.position)
    .to({x: 0, y: 0, z: 3000}, 2000)
    .start();

  new TWEEN.Tween(camera.rotation)
    .to({_x: -0, _y: 0, _z: -0}, 2000)
    .start();

  new TWEEN.Tween(controls.center)
    .to({x: 0, y: 0, z: 0}, 2000)
    .start();
};

function createScene(collection, scene){
  for (var i = 0; i < collection.length; i++) {
    var el = document.createElement('div');
    el.className = 'element';

    var image = document.createElement('img');
    image.src = collection[i].source;
    el.appendChild(image);

    var object = new THREE.CSS3DObject(el);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    scene.add(object);

    var bound = cardClick.bind(i);

    el.addEventListener('click', bound);

    objects.push(object);
  }
};

function table(n, collection, targetArr){
  for (var i = 0; i < collection.length; i++) {
    var object = new THREE.Object3D();
    object.position.x = ((i % n) * 140) - 280;
    object.position.y = -((Math.floor(i / n) + 1) * 180) + 540;
    targets[targetArr].push(object);
  }
};

function sphere(collection, targetArr, r){
  var vector = new THREE.Vector3();

  for (var i = 0, l = collection.length; i < l; i++) {

    var phi = Math.acos(-1 + (2 * i) / l);
    var theta = Math.sqrt(l * Math.PI) * phi;

    var object = new THREE.Object3D();

    object.position.x = r * Math.cos(theta) * Math.sin(phi);
    object.position.y = r * Math.sin(theta) * Math.sin(phi);
    object.position.z = r * Math.cos(phi);

    vector.copy(object.position).multiplyScalar(2);

    object.lookAt(vector);

    targets[targetArr].push(object);
  } 
};

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
};

function cube(n, collection, targetArr){
  for (var i = 0; i < collection.length; i++) {

  var object = new THREE.Object3D();

  object.position.x = ((i % n) * 400) - 800;
  object.position.y = (-(Math.floor(i / n) % n) * 400) + 800;
  object.position.z = (Math.floor(i / (n * n))) * 1000 - 2000;

  targets[targetArr].push(object);
  }
};

function cardClick(){
  console.log(objects[this]);
};

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
};

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  if(controls){
    controls.update();
  }
};

function render() {
  renderer.render(scene, camera);
};