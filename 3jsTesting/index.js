var camera, scene, renderer, controls;

var view = 'table';
var objects = [];
var targets = {table: [], sphere: [], helix: [], doubleHelix: [], tripleHelix: [], grid: []};
var t =0;

init();
animate();

function init() {
  var els = document.getElementsByClassName('element');
  $('#container').empty();
  console.log('element', els);

  camera = new THREE.PerspectiveCamera(30, window.innerWidth / (window.innerHeight), 1, 10000);
  camera.position.z = 800;
  scene = new THREE.Scene();

  var len = data.photos.data.concat(data.photos.data).concat(data.photos.data).concat(data.photos.data).length

  var vector = new THREE.Vector3();
  // create shapes
  for (var i = 0; i < len; i++) {
    createScene(i, data.photos.data.concat(data.photos.data).concat(data.photos.data).concat(data.photos.data), scene, cardClick);
    table(5, i, 'table');
    sphere(i, vector, 'sphere', 800, len);
    helix(1, i, vector, 'helix', 0.175, 450, 900, 900, 8);
    helix(2, i, vector, 'doubleHelix', 0.175, 450, 500, 500, 50);
    helix(3, i, vector, 'tripleHelix', 0.1, 450, 500, 500, 50);
    cube(5, i, 'grid');
  };

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';

  document.getElementById('container').appendChild(renderer.domElement);

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

function createScene(i, collection, scene, click){
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

  var bound = click.bind(i);
  el.addEventListener('click', bound);

  objects.push(object);
};

function table(n, i, targetArr){
  var object = new THREE.Object3D();
  object.position.x = ((i % n) * 140) - 280;
  object.position.y = -((Math.floor(i / n) + 1) * 180) + 540;
  targets[targetArr].push(object);
};

function sphere(i, vector, targetArr, r, len){
  var phi = Math.acos(-1 + (2 * i) / len);
  var theta = Math.sqrt(len * Math.PI) * phi;

  var object = new THREE.Object3D();

  object.position.x = r * Math.cos(theta) * Math.sin(phi);
  object.position.y = r * Math.sin(theta) * Math.sin(phi);
  object.position.z = r * Math.cos(phi);

  vector.copy(object.position).multiplyScalar(2);

  object.lookAt(vector);

  targets[targetArr].push(object);
};

function helix(n, i, vector, targetArr, spacing, offset, xRad, zRad, step){
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
};

function cube(n, i, targetArr){
  var object = new THREE.Object3D();

  object.position.x = ((i % n) * 400) - 800;
  object.position.y = (-(Math.floor(i / n) % n) * 400) + 800;
  object.position.z = (Math.floor(i / (n * n))) * 1000 - 2000;

  targets[targetArr].push(object);
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
  // z = r cos(t)    x = r sin(t)
  t+=0.001;
  camera.position.x= 3000*Math.sin(t);
  camera.position.z=3000*Math.cos(t);

  
};

function render() {
  renderer.render(scene, camera);
};