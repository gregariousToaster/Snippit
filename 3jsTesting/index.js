var camera, scene, renderer;
var controls;

var view = 'table';
var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );

  camera.position.z = 3000;

  scene = new THREE.Scene();

  // init objects

  for ( var i = 0; i < table.length; i++ ) {

    var el = document.createElement( 'div' );
    el.className = 'element';
    el.style.backgroundColor = 'rgb(234,234,234)';

    var number = document.createElement( 'div' );
    var image = document.createElement( 'img' );
    image.src = 'img.jpg';
    image.className = 'image';
    number.className = 'number';
    number.appendChild( image );
    // number.textContent = i + 1;
    el.appendChild( number );

    var symbol = document.createElement( 'div' );
    symbol.className = 'symbol';
    // symbol.textContent = table[i][0];
    el.appendChild( symbol );

    var details = document.createElement( 'div' );
    details.className = 'details';
    details.innerHTML = table[i][1] + '<br>' + table[i][2];
    el.appendChild( details );


    var object = new THREE.CSS3DObject(el);
    object.position.x = Math.random() * 4000 - 2000;
    object.position.y = Math.random() * 4000 - 2000;
    object.position.z = Math.random() * 4000 - 2000;
    scene.add( object );

    var cardClick = function(){

      var target = targets[view][this]

      camera.lookAt(new THREE.Vector3(13,13,13));
      new TWEEN.Tween(camera.position)
        .to( { x: target.position.x, y: target.position.y, z: target.position.z + 200 }, 2000)
        .onUpdate(function(){
          console.log('hello');
          camera.quaternion.set(0, 0, 0, 1);
        })
        .start();

      // new TWEEN.Tween(camera.rotation)
      //   .to( { x: 0, y: 0, z: target.rotation.z }, 2000)
      //   .start();

      // console.log(targets[view][this]);
      // camera.position.x = targets[view][this].position.x;
      // camera.position.y = targets[view][this].position.y;
      // camera.position.z = targets[view][this].position.z + 500;
      // camera.rotation = 0;
      // render();
    }

    var bound = cardClick.bind(i);

    el.addEventListener('click', bound);

    objects.push( object );

    // table

    var tableObject = new THREE.Object3D();
    tableObject.position.x = (table[i][3] * 140) - 1330;
    tableObject.position.y = - (table[i][4] * 180) + 990;

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

  controls = new THREE.TrackballControls( camera, renderer.domElement );
  controls.rotateSpeed = 0.5;
  controls.minDistance = 500;
  controls.maxDistance = 6000;
  controls.addEventListener( 'change', render );

  var buttonClick = function(event){
    view = this.id;
    transform(targets[view], 2000);
  }

  var buttons = document.getElementsByTagName('button');
  for (var i = 0; i < 4; i++) {
    buttons[i].addEventListener('click', buttonClick, false);
  };
  transform( targets.table, 2000 );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

  TWEEN.removeAll();

  for ( var i = 0; i < objects.length; i ++ ) {

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
