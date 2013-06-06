/*global define */
define(['three'], function (three) {
    'use strict';

    
    var container = document.getElementById('space-graph');
    var rect = container.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var mouseX = 0;
    var mouseY = 0;
    var theta = 0;
    var radius = 500;

    var scene = new THREE.Scene();
    var projector = new THREE.Projector();
    var renderer = new THREE.CanvasRenderer();
        renderer.setSize(w, h);

    var camera = new THREE.PerspectiveCamera( 75, w / h, 1, 10000 );
        camera.position.z = 100;

    container.appendChild( renderer.domElement );

    var PI2 = Math.PI * 2;

    var geometry = new THREE.Geometry();

    var selectedBook = {
      r : mapToCoordinates(20, 0, 1, 0, 20),
      x : mapToCoordinates(0, -1, 1, -side, side),
      y : mapToCoordinates(0, -1, 1, -side, side),
      z : 0,
      id :'dkDEdg1exwK1yg'
    };


    var url = 'http://ec2-54-216-139-182.eu-west-1.compute.amazonaws.com/geo/';

    var side = w/2;

    var stars = [];
    var lines = [];

    function makeStar(starInfo) {

      var geometry = new THREE.CubeGeometry( starInfo.r, starInfo.r, starInfo.r );

      var op = (Math.exp(starInfo.radious))
      

      var object = new THREE.Mesh(
        geometry, 
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: op } ) 
      );
      object.position.x = starInfo.x;
      object.position.y = starInfo.y;
      object.position.z = starInfo.z;

      object.scale.x = 1;
      object.scale.y = 1;
      object.scale.z = 1;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      scene.add( object );
      object.info = starInfo;

      stars.push( object );

      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new THREE.Vector3(starInfo.x, starInfo.y, starInfo.z));
      
      var linemat = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.1 })
      var line = new THREE.Line(geometry, linemat);
      scene.add(line)
      lines.push(line);
    }

    
    makeStar(selectedBook);

    getBooks(selectedBook.id)

    function getBooks(id) {

      // $.getJSON('data/books.json', function(data) {
      $.getJSON(url + id, function(data) {

        for (var key in data) {
          var starInfo = data[key];
          starInfo.r = mapToCoordinates(starInfo.radious, 0, 1, 0, 20);
          starInfo.x = mapToCoordinates(starInfo.x, -1, 1, -side, side);
          starInfo.y = mapToCoordinates(starInfo.y, -1, 1, -side, side);
          starInfo.z = getRandomArbitrary(-side, side);
          starInfo.id = key;
          makeStar(starInfo)
        }

        render();

      });
    }
    
    

    // a function to map from coordinates to others
    function mapToCoordinates(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));

    }

    // Returns a random number between min and max
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    function onDocumentMouseDown( event ) {

        event.preventDefault();
        console.log(rect, event.clientX, event)
        var vector = new THREE.Vector3( ( event.offsetX / rect.width ) * 2 - 1, - ( event.offsetY / rect.height ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( stars );

        console.log('intersects:', intersects)

        if ( intersects.length > 0 ) {
          var selectedStar = intersects[0].object;


          if (selectedStar.selected) {
            stars.map(function(star, i) {
              if (star === selectedStar) {
                star.position.x = 0;
                star.position.y = 0;
                star.position.z = 0;
              } else {
                scene.remove(star)
                delete stars[i]
              }
            });
            lines.map(function(line) {
              scene.remove(line)
              });
            getBooks(selectedBook.id)
          } else {
            stars.map(function(star, i) {
              star.material.color.setHex( 0xffffff);
            })
            selectedStar.selected = true;
            selectedStar.material.color.setHex( 0x0000ff );
          }


          selectedBook = selectedStar.info;
          selectedBook.position = selectedStar.position;

          

          // var particle = new THREE.Particle( particleMaterial );
          // particle.position = intersects[ 0 ].point;
          // particle.scale.x = particle.scale.y = 8;
          // scene.add( particle );

        }

      }


    function animate() {

        requestAnimationFrame( animate );

        render();

      }

    
    function render() {

        theta += 0.1;

        camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
        //camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
        // if (selectedBook.hasOwnProperty('position')){
        //   camera.lookAt( selectedBook.position );
        // } else {
          camera.lookAt( scene.position )
        // }

        renderer.render( scene, camera );

      }

    document.addEventListener( 'mousedown', onDocumentMouseDown, false );

    animate();




    return '\'Allo \'Allo!';
});