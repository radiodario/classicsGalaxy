/*global define */
define(['three', 'tween'], function (three) {
    'use strict';

    
    var container = document.getElementById('space-graph');
    var rect = container.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;
    var side = w/2;
    var mouseX = 0;
    var mouseY = 0;
    var theta = 0;
    var radius = h;

    var moveto = null;

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
      radious : 20,
      x : mapToCoordinates(0, -1, 1, -side, side),
      y : mapToCoordinates(0, -1, 1, -side, side),
      z : 0,
      id :'dkDEdg1exwK1yg'
    };


    var host = 'http://ec2-54-216-139-182.eu-west-1.compute.amazonaws.com/';

    var stars = [];
    var lines = [];
    var tweens = [];

    function makeStar(starInfo) {


      var op = (Math.exp(starInfo.radious))
      var r = starInfo.r
      var geometry = new THREE.CubeGeometry(r -op, r -op, r -op );

      var object = new THREE.Mesh(
        geometry, 
        new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: op } ) 
      );
      object.position.x = 0;
      object.position.y = 0;
      object.position.z = 0;

      object.scale.x = 1;
      object.scale.y = 1;
      object.scale.z = 1;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      scene.add( object );
      object.info = starInfo;

      var position = {
        x: 0, 
        y: 0, 
        z: 0
      };

      var target = {
        x: starInfo.x, 
        y: starInfo.y, 
        z: starInfo.z
      }


      stars.push( object );

      var geometry = new THREE.Geometry();
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
      geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    

      var linemat = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.1 })
      var line = new THREE.Line(geometry, linemat);

      var tween = new TWEEN.Tween(position)
            .to( target, 2000 )
            .easing(TWEEN.Easing.Quartic.Out)
            .onUpdate( function () {
              
              object.position.x = position.x;
              object.position.y = position.y;
              object.position.z = position.z;

              line.geometry.vertices[1] = new THREE.Vector3(position.x, position.y, position.z)

              
            } )
            .start();

      scene.add(line)
      lines.push(line);
    }

    
    makeStar(selectedBook);

    getBooks(selectedBook.id)
    getRelated(selectedBook.id)

    function getRelated(id) {
      $.getJSON(host+'id/'+id, function(data) {
            $('#sidebar h2.title').text(data.title);
            $('#sidebar .author').text(data.author);
          });

          $.getJSON(host+'top/'+id, function(books) {

            var html = '<ul>'

            books.forEach(function(book, i) {

              html += '<li>';
              html += '<div class="bookTitle">' + (i+1) + ': ' + book[1] + '</div>';
              html += '<div class="bookAuthor">' + book[2] + '</div>';
              html += '</li>';

            })

            html +='</ul>'

            $('#topten').html(html);

          });

    }

    function getBooks(id) {

      // $.getJSON('data/books.json', function(data) {
      $.getJSON(host + 'geo/' + id, function(data) {

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

    function onWindowResize() {

        rect = container.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        side = w/2;
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();

        renderer.setSize( rect.width, rect.height );


      }

    function onDocumentMouseMove(event) {
        event.preventDefault();

        var vector = new THREE.Vector3( ( event.offsetX / rect.width ) * 2 - 1, - ( event.offsetY / rect.height ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( stars );
        // console.log(intersects)
        if ( intersects.length > 0 ) {
          var selectedStar = intersects[0].object;

          stars.map(function(star, i) {
            star.material.color.setHex( 0xffffff);
          })
          selectedStar.selected = true;
          selectedStar.material.color.setHex( 0x000fff)
        }

    }


    function onDocumentMouseDown( event ) {

        event.preventDefault();
        
        var vector = new THREE.Vector3( ( event.offsetX / rect.width ) * 2 - 1, - ( event.offsetY / rect.height ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( stars );

        if ( intersects.length > 0 ) {
          var selectedStar = intersects[0].object;         
          stars.map(function(star, i) {
            if (star === selectedStar) {
              var pos = {
                x: star.position.x,
                y: star.position.y,
                z: star.position.z
              }

              var tween = new TWEEN.Tween(pos)
                .to({x:0, y:0, z:0}, 500)
                .onUpdate(function() {
                  star.position.x = pos.x;
                  star.position.y = pos.y;
                  star.position.z = pos.z;
                })
                .easing(TWEEN.Easing.Quartic.Out)
                .onComplete(function() {
                getBooks(selectedBook.id);
                }).start()
              
            } else {
              scene.remove(star)
              delete stars[i]
            }
          });
          lines.map(function(line) {
            scene.remove(line)
            });
          selectedBook = selectedStar.info;
          selectedBook.position = selectedStar.position;
          getRelated(selectedBook.id);
        }
        

      }




    function animate() {

        requestAnimationFrame( animate );

        render();

      }

    function moveto() {

      var x=0, y=0, z=0;
      moveto = new THREE.Vector3(object.position.x,object.position.y,object.position.z + 200);

    }

    
    function render() {

        theta += 0.01;

        camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
        // //camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
        camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );



        // if (selectedBook.hasOwnProperty('position')){
        //   // camera.translateY(selectedBook.position.y)
        //   //camera.translateX(selectedBook.position.x)

        //   camera.lookAt( selectedBook.position );
        //  } else {
          camera.lookAt( scene.position )
         // }



        TWEEN.update();

        renderer.render( scene, camera );
      }

    container.addEventListener( 'mousedown', onDocumentMouseDown, false );
    container.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false);
    animate();




    return '\'Allo \'Allo!';
});