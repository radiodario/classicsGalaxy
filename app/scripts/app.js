/*global define */
define(['three', 'tween'], function (three) {
    'use strict';

    
    var container = document.getElementById('space-graph');

    window.navigator.standalone = true;

    $(container).height(window.innerHeight - $('header').height() - $('footer').height() - 50)
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
        camera.position.z = w/3;

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
    var selectedStar = null;

    var host = 'http://ec2-54-216-139-182.eu-west-1.compute.amazonaws.com/';

    var stars = [];
    var lines = [];
    var tweens = [];
    var starsHash = {};

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

      starsHash[starInfo.id] = object;
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
            $('#sidebar .title').text(data.title);
            $('#sidebar .author').text(data.author);
            $('.pic img').attr('src', host+ 'covers/' + data.isbn)
          });

          $.getJSON(host+'top/'+id, function(books) {

            var html = '<ul>'

            books.forEach(function(book, i) {

              html += '<li class="book" id="' + book[0] + '" >';
              html += '<div class="bookTitle">' + (i+1) + ': ' + book[1] + '</div>';
              html += '<div class="bookAuthor">' + book[2] + '</div>';
              html += '</li>';

            })

            html +='</ul>'

            $('#topten').html(html);
            $('li.book')
            .on('mouseover', function(event) {
              var id = $(this).attr('id');
              selectedStar = starsHash[id];
              hoverStar();
            })
            .on('click', function(event) {
              var id = $(this).attr('id');
              console.log(id, starsHash[id]);
              selectedStar = starsHash[id];
              selectStar();

            })
          });

    }

    function hoverStar() {
      if (!selectedStar.selected && !selectedStar.tweening) {
        var scale = {
              x: 1
            }
        selectedStar.tweening = true;
        var tween = new TWEEN.Tween(scale)
          .to({x:1.5}, 500)
          .onUpdate(function() {
            selectedStar.scale.x = scale.x;
            selectedStar.scale.y = scale.x;
            selectedStar.scale.z = scale.x;
          })
          .onComplete(function() {
            selectedStar.tweening = false;
            selectedStar.selected = true;
          })
          .easing(TWEEN.Easing.Quartic.Out)
          .start()

        stars.map(function(star, i) {
          star.material.color.setHex( 0xffffff);
        })
        selectedStar.material.color.setHex(0x000fff)
        console.log(selectedStar.info)
        $('#selectedTitle').html(selectedStar.info.title)
        
      }
    }

    function selectStar() {
      stars.map(function(star, i) {
        if (star === selectedStar) {
          var pos = {
            x: star.position.x,
            y: star.position.y,
            z: star.position.z
          }
          selectedStar.tweeningtohome = true;
          var tween = new TWEEN.Tween(pos)
            .to({x:0, y:0, z:0}, 500)
            .onUpdate(function() {
              star.position.x = pos.x;
              star.position.y = pos.y;
              star.position.z = pos.z;
            })
            .easing(TWEEN.Easing.Quartic.Out)
            .onComplete(function() {
              star.tweeningtohome = false;
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

    function getBooks(id) {

      // $.getJSON('data/books.json', function(data) {
      $.getJSON(host + 'geo/' + id, function(data) {


        for (var key in data) {
          var starInfo = data[key];
          starInfo.r = mapToCoordinates(starInfo.radious, 0, 1, 0, 20);
          starInfo.x = mapToCoordinates(starInfo.x, -1, 1, -side, side);
          starInfo.y = mapToCoordinates(starInfo.y, -1, 1, -side, side);
          starInfo.z = getRandomArbitrary(-10, 10);
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
        $(container).height(window.innerHeight - ($('header').height() + $('footer').height()) - 50)
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
          selectedStar = intersects[0].object;
          hoverStar();
        } else {
          $('#selectedTitle').html();
          if (selectedStar && (!selectedStar.tweening)) {

            selectedStar.tweening = true;

            var scale = {
                  x: selectedStar.scale.x
                }

            var tween = new TWEEN.Tween(scale)
              .to({x:1}, 500)
              .onUpdate(function() {
                selectedStar.scale.x = scale.x;
                selectedStar.scale.y = scale.x;
                selectedStar.scale.z = scale.x;
              })
              .onComplete(function() {
                selectedStar.tweening = false;
                selectedStar.selected = false;
                selectedStar.material.color.setHex( 0xffffff);
              })
              .easing(TWEEN.Easing.Quartic.Out)
              .start()
          }
        }

    }


    function onDocumentMouseDown( event ) {

        event.preventDefault();

        var vector = new THREE.Vector3( ( event.offsetX / rect.width ) * 2 - 1, - ( event.offsetY / rect.height ) * 2 + 1, 0.5 );
        projector.unprojectVector( vector, camera );

        var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

        var intersects = raycaster.intersectObjects( stars );

        if ( intersects.length > 0 ) {
          //selectedStar = intersects[0].object;         
          selectStar();
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

        theta += 0.005;

        //camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
        // //camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
        //camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

        camera.lookAt( scene.position )
        //camera.rotation.x = theta / Math.PI
        //camera.rotation.y = theta / Math.PI
        camera.rotation.z = theta / Math.PI

        
        
     

        TWEEN.update();

        renderer.render( scene, camera );
      }

    container.addEventListener( 'mousedown', onDocumentMouseDown, false );
    container.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false);
    animate();




    return '\'Allo \'Allo!';
});