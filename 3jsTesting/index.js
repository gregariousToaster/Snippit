var camera, scene, renderer;
var controls;

var view = 'table';
var objects = [];
var targets = { table: [], sphere: [], helix: [],doubleHelix: [],tripleHelix: [], grid: [] };

init();
animate();
// console.log(camera);

function init() {

  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 800;
  scene = new THREE.Scene();
  camera.lookAt(new THREE.Vector3(999,100,0));
  window.camera = camera;

  // init objects
  var pics = data.photos.data.concat(data.photos.data).concat(data.photos.data);

  for ( var i = 0; i < pics.length; i++ ) {

    var el = document.createElement( 'div' );
    el.className = 'element';

    var image = document.createElement( 'img' );
    image.src = pics[i].source;
    el.appendChild( image );

    var back = document.createElement( 'div' );
    back.className = 'back';
    el.appendChild( back );

    var object = new THREE.CSS3DObject(el);
    console.log(object);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    scene.add( object );

    var cardClick = function(){
      console.log(this);
    }

    var bound = cardClick.bind(i);

    el.addEventListener('click', bound);

    objects.push( object );

    // table

    var tableObject = new THREE.Object3D();
    tableObject.position.x = ((i % 5) * 140) - 280; // 18 columns
    tableObject.position.y = - ((Math.floor(i / 5) + 1) * 180) + 540; // 10 rows

    targets.table.push( tableObject );

  }

  // sphere

  var sphereVector = new THREE.Vector3();

  for ( var i = 0, l = objects.length; i < l; i ++ ) {

    var phi = Math.acos( -1 + ( 2 * i ) / l );
    var theta = Math.sqrt( l * Math.PI ) * phi;

    var sphereObject = new THREE.Object3D();

    sphereObject.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
    sphereObject.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
    sphereObject.position.z = 800 * Math.cos( phi );

    sphereVector.copy( sphereObject.position ).multiplyScalar( 2 );

    sphereObject.lookAt( sphereVector );

    targets.sphere.push( sphereObject );

  }

  // helix

  var helixVector = new THREE.Vector3();

  for ( var i = 0, l = objects.length; i < l; i ++ ) {

    var phi = i * 0.175 + Math.PI;

    var helixObject = new THREE.Object3D();

    helixObject.position.x = 900 * Math.sin( phi );
    helixObject.position.y = - ( i * 8 ) + 450;
    helixObject.position.z = 900 * Math.cos( phi );

    helixVector.x = helixObject.position.x * 2;
    helixVector.y = helixObject.position.y;
    helixVector.z = helixObject.position.z * 2;

    helixObject.lookAt( helixVector );

    targets.helix.push( helixObject );

  }
  // double helix
  var doubleHelixVector = new THREE.Vector3();

  for ( var i = 0, l = objects.length; i < l; i ++ ) {
    var doubleHelixObject = new THREE.Object3D();
    if(i%2===0){
      var phi = i * 0.175;
    }else{
      var phi = i * 0.175 + Math.PI;
    }
     doubleHelixObject.position.x = 500 * Math.sin( phi );
    doubleHelixObject.position.y = - ( i * 50 ) + 450;
    doubleHelixObject.position.z = 500 * Math.cos( phi );

    doubleHelixVector.x = doubleHelixObject.position.x * 2;
    doubleHelixVector.y = doubleHelixObject.position.y;
    doubleHelixVector.z = doubleHelixObject.position.z * 2;

    doubleHelixObject.lookAt( doubleHelixVector );
    targets.doubleHelix.push( doubleHelixObject );
  }

  // triple helix
  var tripleHelixVector = new THREE.Vector3();
  for ( var i = 0, l = objects.length; i < l; i ++ ) {
    var tripleHelixObject = new THREE.Object3D();
    if(i%3===0){
      var phi = i * 0.1;
    }else if(i%3===1){
      var phi = i * 0.1 + (2/3)*Math.PI;
    }else{
      var phi = i * 0.1 + (4/3)*Math.PI;
    }
    tripleHelixObject.position.x = 500 * Math.sin( phi );
    tripleHelixObject.position.y = - ( i * 50 ) + 450;
    tripleHelixObject.position.z = 500 * Math.cos( phi );

    tripleHelixVector.x = tripleHelixObject.position.x * 2;
    tripleHelixVector.y = tripleHelixObject.position.y;
    tripleHelixVector.z = tripleHelixObject.position.z * 2;

    tripleHelixObject.lookAt( tripleHelixVector );
    targets.tripleHelix.push( tripleHelixObject );
  }
  // grid

  for ( var i = 0; i < objects.length; i ++ ) {

    var gridObject = new THREE.Object3D();

    gridObject.position.x = ((i % 5) * 400) - 800;
    gridObject.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
    gridObject.position.z = (Math.floor(i / 25)) * 1000 - 2000;

    targets.grid.push( gridObject );

  }

  //

  renderer = new THREE.CSS3DRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.domElement.style.position = 'absolute';
  document.getElementById( 'container' ).appendChild( renderer.domElement );

  //

  controls = new THREE.OrbitControls( camera );
  controls.damping = 0.2;
  controls.addEventListener( 'change', render );


  var buttonClick = function(event){
    debugger;
    view = this.id;
    transform(targets[view], 2000);
    
    new TWEEN.Tween(camera.position)
      .to( { x: 0, y: 0, z: 3000 }, 2000)
      .start();

    new TWEEN.Tween(camera.rotation)
      .to( {_x: -0, _y: 0, _z: -0}, 2000)
      .start();

      //tween the value of the orbit controls center
      //since they have taken over the lookAt function
    new TWEEN.Tween(controls.center)
      .to( {x: 0, y: 0, z: 0}, 2000)
      .start();
  }

  var buttons = document.getElementsByTagName('button');
  for (var i = 1; i < 7; i++) {
    buttons[i].addEventListener('click', buttonClick, false);
  };
  transform( targets.table, 2000 );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

  TWEEN.removeAll();

  for ( var i = 0; i < objects.length; i ++ ) {
    console.log(targets);
    var object = objects[i];
    var target = targets[i];

    new TWEEN.Tween( object.position )
      .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

    new TWEEN.Tween(object.rotation)
      .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
      .easing( TWEEN.Easing.Exponential.InOut )
      .start();

  }

  new TWEEN.Tween( this )
    .to( {}, duration * 2 )
    .onUpdate( render )
    .start();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  controls.update();
}

function render() {
  renderer.render( scene, camera );
}

$('#sign').on('click', function(){
  $('#container').toggleClass('blur');
  $('.hidden').fadeIn();
  $('.overlay').fadeOut();
  $('#sign').fadeOut();

})
