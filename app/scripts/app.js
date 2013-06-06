/*global define */
define(['sheetengine'], function (sheetengine) {
    'use strict';


    console.log(sheetengine)


    var w = window.innerWidth;
    var h = window.innerHeight - $('header').height();

    var canvasElement = document.getElementById('galaxy');
    sheetengine.scene.init(canvasElement, {w:900, h:500});

    var bookid= 'dtB9Y1S18jaTqf'

    var url = 'http://ec2-54-216-139-182.eu-west-1.compute.amazonaws.com/geo/' + bookid;

    // draw the walls
    // the back y wall
    for (var x=-1; x<=1; x++) {
      var basesheet = new sheetengine.BaseSheet(
        {x:x*200,y:-300,z:50}, 
        {alphaD:0,betaD:0,gammaD:0}, 
        {w:200,h:100}
      );
      basesheet.color = '#171133';
    }

    // the front y wall
    for (var x=-1; x<=1; x++) {
      var basesheet = new sheetengine.BaseSheet(
        {x:x*200,y:300,z:-25}, 
        {alphaD:0,betaD:0,gammaD:0}, 
        {w:200,h:50}
      );
      basesheet.color = '#100515';
    }


    // the front x wall
    for (var y=-1; y<=1; y++) {
      var basesheet = new sheetengine.BaseSheet(
        {x:300,y:y*-200,z:-25}, 
        {alphaD:0,betaD:0,gammaD:90}, 
        {w:200,h:50}
      );
      basesheet.color = '#100515';
    }

    // the back x wall
    for (var y=-1; y<=1; y++) {
      var basesheet = new sheetengine.BaseSheet(
        {x:-300,y:y*-200,z:50}, 
        {alphaD:0,betaD:0,gammaD:90}, 
        {w:200,h:100}
      );
      basesheet.color = '#171133';
    }



        // draw the floor
    for (var x=-1; x<=1; x++) {
        for (var y=-1; y<=1; y++) {
          console.log('x', x, x*200, 'y', y, y*200)
          var basesheet = new sheetengine.BaseSheet(
            {x:x*200,y:y*200,z:0}, 
            {alphaD:90,betaD:0,gammaD:0}, 
            {w:200,h:200}
          );
          basesheet.color = '#171133';
        }
      }

    function makeStar(w, x, y, z, color) {
      
      var sheet1 = new sheetengine.Sheet(
        {x:0,y:0,z:0}, 
        {alphaD:0,betaD:0,gammaD:0}, 
        {w:w,h:w}
        );

      var sheet2 = new sheetengine.Sheet(
        {x:0,y:0,z:0}, 
        {alphaD:90,betaD:0,gammaD:0}, 
        {w:w,h:w}
        );

      // var ctx = sheet1.context;
      // ctx.fillStyle = '#fff';
      // ctx.beginPath();
      // ctx.arc(w/2, w/2, w/4, 0, Math.PI*2, true);
      // ctx.fill();
      // ctx.closePath();

      var ctx = sheet2.context;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(w/2, w/2, w/4, 0, Math.PI*2, true);
      ctx.fill();
      ctx.closePath();



      var star = new sheetengine.SheetObject(
        {x:x,y:y,z:z}, 
        {alphaD:0,betaD:0,gammaD:0}, 
        [sheet1, sheet2], 
        {w:w,h:w*2,relu:w/2,relv:w/2}
        );
      
      return star;

    }

    var stars = []

    stars.push(makeStar(50, 0, 0, 50, '#Faa'));


    // $.getJSON('data/books.json', function(data) {
    $.getJSON(url, function(data) {

      for (var key in data) {
        var starInfo = data[key];
        var r = mapToCoordinates(starInfo.radious, 0, 1, 0, 30)
        var x = mapToCoordinates(starInfo.x, -1, 1, -300, 300)
        var y = mapToCoordinates(starInfo.y, -1, 1, -300, 300)
        var z = getRandomArbitrary(5, 100);

        stars.push(makeStar(r, x, y, z, '#aaF'))
      }

    });
    

    // a function to map from coordinates to others
    function mapToCoordinates(value, istart, istop, ostart, ostop) {
      return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));

    }

    // Returns a random number between min and max
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }


    sheetengine.calc.calculateAllSheets();
    sheetengine.drawing.drawScene(true);

    
    function draw() {
      sheetengine.calc.calculateChangedSheets();
      sheetengine.drawing.drawScene();
    }

    function update(star) {
          star.move({x:0, y:0, z:getRandomArbitrary(-1,1)})
          //star.rotate({x:0, y:0, z:1}, Math.PI/10)
        } 

    function updateAll() {
      stars.map(update);
    }

    //draw();

    setInterval(function() {
      updateAll();
      draw();
    }, 1000/24);

    





    return '\'Allo \'Allo!';
});