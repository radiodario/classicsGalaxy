/*! sheetengine v1.2.0 sheetengine.codeplex.com | sheetengine.codeplex.com/license */
var sheetengine = (function() {
  var E = {
    sheets: [],
    basesheets: [],
    polygons: [],
    objects: [],
    currentSheet: -1,
    hoverSheet: -1,
    canvas: null,
    context: null,
    canvasCenter: {
      u: 250,
      v: 260
    },
    viewSource: {
      x: -1,
      y: -1,
      z: -Math.SQRT1_2
    },
    tempCanvasSize: {
      w: 115,
      h: 115
    },
    backgroundColor: "none",
    drawObjectContour: false,
    boundingBoxMaxsheetDistance: 150,
    objectsintersect: false,
    debug: false
  };
  var p = [];
  var S = {};
  var aJ = null;
  var aT = {};
  E.shadows = aT;
  aT.baseshadowCanvas = null;
  aT.baseshadowContext = null;
  aT.baseShadowCenter = {
    u: 212,
    v: 2 * 106
  };
  aT.lightSource = {
    x: 1,
    y: -3,
    z: -10
  };
  aT.lightSourcep1 = {
    x: 1,
    y: -3,
    z: 1
  };
  aT.lightSourcep2 = {
    x: -33,
    y: 11,
    z: 0
  };
  aT.shadowAlpha = 0.3;
  aT.shadeAlpha = 0.3;
  aT.drawShadows = true;

  function r(bH) {
    var bM = bH;
    var by = aT.lightSource;
    var bz = {
      x: bM.centerp.x,
      y: bM.centerp.y,
      z: bM.centerp.z
    };
    var bL = {
      x: bz.x + bM.p0.x,
      y: bz.y + bM.p0.y,
      z: bz.z + bM.p0.z
    };
    var bK = {
      x: bz.x + bM.p1.x,
      y: bz.y + bM.p1.y,
      z: bz.z + bM.p1.z
    };
    var bJ = {
      x: bz.x + bM.p2.x,
      y: bz.y + bM.p2.y,
      z: bz.z + bM.p2.z
    };
    var bA = bz.z / -by.z;
    var bF = bL.z / -by.z;
    var bD = bK.z / -by.z;
    var bC = bJ.z / -by.z;
    var bI = {
      x: bz.x + by.x * bA,
      y: bz.y + by.y * bA,
      z: bz.z + by.z * bA
    };
    var bG = {
      x: bL.x + by.x * bF - bI.x,
      y: bL.y + by.y * bF - bI.y,
      z: bL.z + by.z * bF - bI.z
    };
    var bE = {
      x: bK.x + by.x * bD - bI.x,
      y: bK.y + by.y * bD - bI.y,
      z: bK.z + by.z * bD - bI.z
    };
    var bB = {
      x: bJ.x + by.x * bC - bI.x,
      y: bJ.y + by.y * bC - bI.y,
      z: bJ.z + by.z * bC - bI.z
    };
    bM.baseShadoweData = bt(bI, bG, bE, bB, u.transformPoint, u.transformPointz, aT.baseShadowCenter, bM.corners);
    bM.baseShadoweData.translatex -= Z.center.u;
    bM.baseShadoweData.translatey -= Z.center.v
  }
  function e(bz, bG) {
    for (var bC = 0; bC < E.sheets.length; bC++) {
      var bE = E.sheets[bC];
      if (bE.dirty) {
        continue
      }
      if (bE.hidden) {
        continue
      }
      if (bz) {
        bE.shadowdirty = false
      } else {
        if (bE.shadowdirty) {
          continue
        }
      }
      for (var bB = 0; bB < bE.polygons.length; bB++) {
        var bF = bE.polygons[bB];
        var bD = bz ? bF.prevshadowconstraints : bF.shadowconstraints;
        if (bD == null) {
          bE.shadowdirty = true;
          break
        }
        for (var bA = 0; bA < bD.length; bA++) {
          var by = E.polygons[bD[bA]].sheetindex;
          if (bG.indexOf(by) != -1) {
            bE.shadowdirty = true;
            break
          }
        }
        if (bE.shadowdirty) {
          break
        }
      }
    }
  }
  function a8(bB, bD, bz, by) {
    if (!aT.drawShadows) {
      return
    }
    bB.clearRect(0, 0, bD.w, bD.h);
    for (var bC = 0; bC < E.sheets.length; bC++) {
      var bE = E.sheets[bC];
      if (bE.hidden) {
        continue
      }
      if (!bE.castshadows) {
        continue
      }
      if (by) {
        var bA = bE.data;
        if (bA.centerpuv.u < by.minu || bA.centerpuv.u > by.maxu || bA.centerpuv.v < by.minv || bA.centerpuv.v > by.maxv) {
          continue
        }
      }
      bE.baseShadoweData.translatex += bz.u;
      bE.baseShadoweData.translatey += bz.v;
      t.drawRect(bE.baseShadoweData, bB, ak, bE.baseshadowcanvas, false);
      bE.baseShadoweData.translatex -= bz.u;
      bE.baseShadoweData.translatey -= bz.v
    }
  }
  function L() {
    E.context.save();
    E.context.globalAlpha = aT.shadowAlpha;
    E.context.drawImage(aT.baseshadowCanvas, E.canvasCenter.u - Z.tilesize.x, E.canvasCenter.v - 2 * Z.tilesize.y);
    E.context.restore()
  }
  function s(bG) {
    if (bG.hidden) {
      return
    }
    var bH = !bG.shaded && aT.drawShadows && bG.allowshadows;
    if (bH) {
      bG.shadowtempcontext.clearRect(0, 0, bG.width, bG.height);
      bG.shadowData = [];
      for (var bA = 0; bA < bG.polygons.length; bA++) {
        var bJ = bG.polygons[bA];
        var bE = bJ.shadowconstraints;
        var bB = [];
        for (var by = 0; by < bE.length; by++) {
          var bz = E.polygons[bE[by]].sheetindex;
          if (bB.indexOf(bz) != -1) {
            continue
          }
          bB.push(bz);
          var bF = E.sheets[bz];
          if (bF.hidden) {
            continue
          }
          if (!bF.castshadows) {
            continue
          }
          bG.shadowtempcontext.save();
          bG.shadowtempcontext.beginPath();
          for (var bD = 0; bD < bJ.points.length; bD++) {
            bG.shadowtempcontext.lineTo(bJ.pointscanvasuv[bD].u, bJ.pointscanvasuv[bD].v)
          }
          bG.shadowtempcontext.closePath();
          bG.shadowtempcontext.clip();
          if (bG.shadowData[bF.index] == null) {
            bG.shadowData[bF.index] = aP(bG, bF)
          }
          var bC = bG.shadowData[bF.index];
          bG.shadowtempcontext.transform(bC.ta, bC.tb, bC.tc, bC.td, bC.translatex, bC.translatey);
          bG.shadowtempcontext.drawImage(bF.shadowcanvas, 0, 0);
          bG.shadowtempcontext.restore()
        }
      }
    }
    bG.compositecontext.save();
    bG.compositecontext.drawImage(bG.canvas, 0, 0);
    if (bG.shaded) {
      bG.compositecontext.globalCompositeOperation = "source-over";
      bG.compositecontext.globalAlpha = aT.shadeAlpha;
      bG.compositecontext.drawImage(bG.shadowcanvas, 0, 0)
    } else {
      var bI = 0;
      if (bG.shadealpha > bI) {
        bG.compositecontext.globalCompositeOperation = "source-over";
        bG.compositecontext.globalAlpha = bG.shadealpha;
        bG.compositecontext.drawImage(bG.shadowcanvas, 0, 0)
      } else {
        bG.compositecontext.globalCompositeOperation = "source-atop";
        bG.compositecontext.globalAlpha = (bI - bG.shadealpha * 6);
        bG.compositecontext.fillStyle = "#FFF";
        bG.compositecontext.fillRect(0, 0, bG.width, bG.height)
      }
    } if (bH) {
      bG.compositecontext.globalAlpha = aT.shadowAlpha - bG.shadealpha;
      bG.compositecontext.globalCompositeOperation = "source-atop";
      bG.compositecontext.drawImage(bG.shadowtempcanvas, 0, 0)
    }
    bG.compositecontext.restore()
  }
  function ao(by) {
    for (var bA = 0; bA < E.sheets.length; bA++) {
      var bz = E.sheets[bA];
      if (bz.shadowdirty || bz.dirty || by) {
        s(bz)
      }
    }
  }
  function aP(bE, bI) {
    var bL = bI;
    var bO = aT.lightSource;
    var bR = {
      x: bL.centerp.x,
      y: bL.centerp.y,
      z: bL.centerp.z
    };
    var bC = {
      x: bL.centerp.x + bL.p0.x,
      y: bL.centerp.y + bL.p0.y,
      z: bL.centerp.z + bL.p0.z
    };
    var bA = {
      x: bL.centerp.x + bL.p1.x,
      y: bL.centerp.y + bL.p1.y,
      z: bL.centerp.z + bL.p1.z
    };
    var by = {
      x: bL.centerp.x + bL.p2.x,
      y: bL.centerp.y + bL.p2.y,
      z: bL.centerp.z + bL.p2.z
    };
    var bF = bf(bE.normalp, bE.centerp, bR, bO);
    var bJ = bf(bE.normalp, bE.centerp, bC, bO);
    var bH = bf(bE.normalp, bE.centerp, bA, bO);
    var bG = bf(bE.normalp, bE.centerp, by, bO);
    var bB = {
      x: bR.x + bO.x * bF,
      y: bR.y + bO.y * bF,
      z: bR.z + bO.z * bF
    };
    var bN = {
      x: bC.x + bO.x * bJ - bB.x,
      y: bC.y + bO.y * bJ - bB.y,
      z: bC.z + bO.z * bJ - bB.z
    };
    var bD = {
      x: bA.x + bO.x * bH - bB.x,
      y: bA.y + bO.y * bH - bB.y,
      z: bA.z + bO.z * bH - bB.z
    };
    var bP = {
      x: by.x + bO.x * bG - bB.x,
      y: by.y + bO.y * bG - bB.y,
      z: by.z + bO.z * bG - bB.z
    };
    var bK = bt(bB, bN, bD, bP, u.transformPoint, null, E.canvasCenter, null);
    var bz = a1.getBaseMatrixInverse({
      x: bE.data.ta,
      y: bE.data.tb,
      z: 0
    }, {
      x: bE.data.tc,
      y: bE.data.td,
      z: 0
    }, {
      x: bE.data.translatex,
      y: bE.data.translatey,
      z: 1
    });
    var bM = aD(bz.b1, bz.b2, bz.b3, {
      x: bK.ta,
      y: bK.tb,
      z: 0
    }, {
      x: bK.tc,
      y: bK.td,
      z: 0
    }, {
      x: bK.translatex,
      y: bK.translatey,
      z: 1
    });
    var bQ = {
      translatex: bM.c3.x,
      translatey: bM.c3.y,
      ta: bM.c1.x,
      tb: bM.c1.y,
      tc: bM.c2.x,
      td: bM.c2.y
    };
    return bQ
  }
  function F(bE, bD) {
    var bG = bD;
    var bz = aT.lightSource;
    var bF = {
      x: bE.centerp.x - (bz.x * 100),
      y: bE.centerp.y - (bz.y * 100),
      z: bE.centerp.z - (bz.z * 100)
    };
    var by = {
      x: bE.centerp.x - (bG.x * 100),
      y: bE.centerp.y - (bG.y * 100),
      z: bE.centerp.z - (bG.z * 100)
    };
    var bA = bE.normalp.x * (bF.x - bE.centerp.x) + bE.normalp.y * (bF.y - bE.centerp.y) + bE.normalp.z * (bF.z - bE.centerp.z);
    var bB = -bE.normalp.x * (by.x - bE.centerp.x) - bE.normalp.y * (by.y - bE.centerp.y) - bE.normalp.z * (by.z - bE.centerp.z);
    var bC = bA < 0;
    var bH = bB < 0;
    return (bC && bH) || (!bC && !bH)
  }
  function ai(bA) {
    if (!bA.allowshadows) {
      bA.shaded = false;
      bA.shadealpha = 0;
      return
    }
    var by = aT.lightSource;
    var bE = bA.normalp;
    var bD = 3;
    var bB = a1.vectorMagnitude(bg(by, bE));
    var bC = a1.vectorMagnitude(by) * a1.vectorMagnitude(bE);
    var bz = Math.asin(bB / bC) / (Math.PI * bD);
    bA.shaded = F(bA, E.viewSource);
    bA.shadealpha = bz - 0.05
  }
  function av(by, bz) {
    if (!bz) {
      bz = {
        u: 0,
        v: 0
      }
    }
    by.save();
    by.globalAlpha = aT.shadowAlpha;
    by.drawImage(aT.baseshadowCanvas, bz.u, bz.v);
    by.restore()
  }
  aT.calculateSheetBaseShadow = r;
  aT.initBaseRectShadow = a8;
  aT.drawBaseRectShadow = L;
  aT.calculateSheetsShadows = ao;
  aT.calculateSheetShade = ai;
  var t = {};
  E.drawing = t;
  t.drawBaseRect = null;
  t.drawBeforeSheets = null;
  t.drawAfterSheets = null;
  t.useClipCorrection = false;
  t.dimmedAlpha = 0.2;
  t.allowContourDrawing = true;
  t.hoveredSheetColor = "#F80";
  t.selectedSheetColor = "#00F";
  t.selectrectlinewidth = 2;

  function aU(by, bA) {
    var bz = document.createElement("canvas");
    bz.width = by;
    bz.height = bA;
    return bz
  }
  function aj() {
    E.context.clearRect(0, 0, E.canvas.width, E.canvas.height);
    if (t.drawBaseRect) {
      t.drawBaseRect()
    }
    if (aT.drawShadows) {
      aT.initBaseRectShadow(aT.baseshadowContext, {
        w: aT.baseshadowCanvas.width,
        h: aT.baseshadowCanvas.height
      }, {
        u: 0,
        v: 0
      });
      aT.drawBaseRectShadow()
    }
    if (t.drawBeforeSheets) {
      t.drawBeforeSheets()
    }
    t.drawSheets(E.context);
    if (t.drawAfterSheets) {
      t.drawAfterSheets()
    }
  }
  function X(bG, by, bA, bz, bN, bC) {
    var bM = k(bG.p1uv.u, 1000);
    var bL = k(bG.p1uv.v, 1000);
    var bK = k(bG.p2uv.u, 1000);
    var bJ = k(bG.p2uv.v, 1000);
    if ((bM == 0 && bK == 0) || (bK == 0 && bJ == 0) || (bM == 0 && bL == 0) || (bL == 0 && bJ == 0) || (bM + bL == 0 && bK + bJ == 0)) {
      if (bN && t.allowContourDrawing) {
        o(bG, by, 0)
      }
      return
    }
    by.save();
    if (bC != null) {
      var bH = true;
      for (var bI = 0; bI < 4; bI++) {
        var bK = bG.cornersuv[bI];
        var bB = false;
        for (var bD = 0; bD < bC.points.length; bD++) {
          var bE = bC.data.pointsuv[bD];
          if (bK.u == bE.u && bK.v == bE.v) {
            bB = true;
            break
          }
        }
        if (!bB) {
          bH = false;
          break
        }
      }
      if (!bH) {
        by.beginPath();
        for (var bD = 0; bD < bC.points.length; bD++) {
          var bE = bC.data.pointsuv[bD];
          if (t.useClipCorrection) {
            var bF = bC.data.avguv;
            var bP = (bE.u - bF.u) * 0.03;
            var bO = (bE.v - bF.v) * 0.03;
            by.lineTo(bE.u + bP, bE.v + bO)
          } else {
            by.lineTo(bE.u, bE.v)
          }
        }
        by.closePath();
        by.clip()
      }
    }
    by.transform(bG.ta, bG.tb, bG.tc, bG.td, bG.translatex, bG.translatey);
    bA(by, bz);
    by.beginPath();
    by.restore()
  }
  function Q(bz, by) {
    bz.drawImage(by, 0, 0)
  }
  function ak(bz, by) {
    bz.drawImage(by, 0, 0)
  }
  function o(by, bz, bA) {
    bz.save();
    bz.globalAlpha = 1;
    switch (bA) {
      case 0:
        bz.strokeStyle = "#000";
        break;
      case 1:
        bz.strokeStyle = "#00F";
        bz.globalAlpha = 0.5;
        break;
      case 2:
        bz.strokeStyle = "#F80";
        bz.globalAlpha = 0.5;
        break;
      case 3:
        bz.strokeStyle = "#00F";
        break
    }
    bz.lineWidth = t.selectrectlinewidth;
    bz.beginPath();
    bz.moveTo(by.cornersuv[0].u, by.cornersuv[0].v);
    bz.lineTo(by.cornersuv[1].u, by.cornersuv[1].v);
    bz.lineTo(by.cornersuv[2].u, by.cornersuv[2].v);
    bz.lineTo(by.cornersuv[3].u, by.cornersuv[3].v);
    bz.lineTo(by.cornersuv[0].u, by.cornersuv[0].v);
    bz.closePath();
    bz.stroke();
    bz.restore()
  }
  function aC(by) {
    by.baseshadowcontext.save();
    by.baseshadowcontext.clearRect(0, 0, by.width, by.height);
    by.baseshadowcontext.drawImage(by.canvas, 0, 0);
    by.baseshadowcontext.globalCompositeOperation = "source-in";
    by.baseshadowcontext.fillStyle = "#000";
    by.baseshadowcontext.fillRect(0, 0, by.width, by.height);
    by.baseshadowcontext.restore();
    by.shadowcontext.save();
    by.shadowcontext.clearRect(0, 0, by.width, by.height);
    by.shadowcontext.drawImage(by.canvas, 0, 0);
    by.shadowcontext.globalCompositeOperation = "source-in";
    by.shadowcontext.fillStyle = "#000";
    by.shadowcontext.fillRect(0, 0, by.width, by.height);
    by.shadowcontext.restore()
  }
  function a9(bD, bF, bC, by) {
    var bG = E.hoverSheet != -1 ? E.sheets[E.hoverSheet] : null;
    var bz = E.hoverSheet == bD.index || (bG != null && bD.group != null && bD.group == bG.group) || (bG != null && bD.objectsheet && bD.object == bG.object);
    var bB = E.currentSheet == bD.index;
    var bE = bD.inSelection;
    if (bz || bB || bE) {
      var bA = 1;
      if (bE || bB) {
        bA = 2
      }
      J(bC, by, bA, bD, bF)
    }
  }
  function J(by, bC, bz, bB, bE) {
    bC.save();
    bC.globalAlpha = 1;
    switch (bz) {
      case 1:
        bC.strokeStyle = t.hoveredSheetColor;
        break;
      case 2:
        bC.strokeStyle = t.selectedSheetColor;
        break
    }
    bC.lineWidth = 2;
    bC.beginPath();
    for (var bA = 0; bA < bE.points.length; bA++) {
      var bD = bA == bE.points.length - 1 ? 0 : bA + 1;
      bC.moveTo(bE.data.pointsuv[bA].u, bE.data.pointsuv[bA].v);
      var bF = G(bE.data.pointsuv[bA], bE.data.pointsuv[bD], by.cornersuv);
      if (bF) {
        bC.lineTo(bE.data.pointsuv[bD].u, bE.data.pointsuv[bD].v)
      }
    }
    bC.closePath();
    bC.stroke();
    bC.restore()
  }
  function G(bA, bz, by) {
    return aE(bA, bz, by[0], by[1]) || aE(bA, bz, by[1], by[2]) || aE(bA, bz, by[2], by[3]) || aE(bA, bz, by[3], by[0])
  }
  function aE(bN, bL, bF, bD) {
    var bC = bN.u - bF.u;
    var bA = bL.u - bF.u;
    var by = bD.u - bF.u;
    var bO = bN.v - bF.v;
    var bM = bL.v - bF.v;
    var bK = bD.v - bF.v;
    var bI = (bC / by);
    var bH = (bO / bK);
    var bG = (bA / by);
    var bE = (bM / bK);
    var bB = 0.1;
    var bz = 2;
    var bJ = (Math.abs(bI - bH) < bB && Math.abs(bG - bE) < bB) || (Math.abs(by) < bz && Math.abs(bA) < bz & Math.abs(bC) < bz) || (Math.abs(bK) < bz && Math.abs(bM) < bz && Math.abs(bO) < bz);
    return bJ
  }
  function bb(bD, by) {
    if (E.sheets.length == 0) {
      return
    }
    for (var bC = 0; bC < E.orderedPolygons.length; bC++) {
      var bB = E.polygons[E.orderedPolygons[bC]];
      var bA = E.sheets[bB.sheetindex];
      if (by) {
        var bz = bA.data;
        if (bz.centerpuv.u < by.minu || bz.centerpuv.u > by.maxu || bz.centerpuv.v < by.minv || bz.centerpuv.v > by.maxv) {
          continue
        }
      }
      if (bA.hidden) {
        continue
      }
      if (bA.dimmed) {
        bD.save();
        bD.globalAlpha = t.dimmedAlpha
      }
      t.drawRect(bA.data, bD, Q, bA.compositecanvas, true, bB);
      if (bA.dimmed) {
        bD.restore()
      }
      a9(bA, bB, bA.data, bD)
    }
  }
  function ba(bz) {
    var by = u.transformPoint(bz);
    return {
      u: by.u + E.canvasCenter.u - Z.center.u,
      v: by.v + E.canvasCenter.v - Z.center.v
    }
  }
  function d(bK) {
    var bI = bK.viewPort;
    var bA = bK.targetContext;
    var bB = bK.targetBaseShadowContext;
    var bD = bK.targetBaseShadowCanvas;
    if (!bA) {
      bA = E.temppartcontext;
      bB = E.temppartshadowcontext;
      bD = E.temppartshadowcanvas
    }
    bA.fillStyle = E.backgroundColor;
    bA.fillRect(0, 0, bI.w, bI.h);
    var bH = bI.u + E.canvasCenter.u;
    var bG = bI.v + E.canvasCenter.v;
    bA.save();
    bA.translate(-bH, -bG);
    bo(bA);
    var bz = E.boundingBoxMaxsheetDistance;
    var by = bI.u - bz;
    var bJ = bI.v - bz;
    var bF = bI.u + bI.w + bz;
    var bE = bI.v + bI.h + bz;
    var bC = {
      u: -bH + Z.center.u + E.canvasCenter.u - aT.baseShadowCenter.u,
      v: -bG + Z.center.v + E.canvasCenter.v - aT.baseShadowCenter.v
    };
    a8(bB, {
      w: bI.w,
      h: bI.h
    }, bC, {
      minu: by,
      maxu: bF,
      minv: bJ,
      maxv: bE
    });
    bA.save();
    bA.globalAlpha = aT.shadowAlpha;
    bA.drawImage(bD, bH, bG);
    bA.restore();
    bb(bA, {
      minu: by,
      maxu: bF,
      minv: bJ,
      maxv: bE
    });
    bA.restore()
  }
  function aN(bG) {
    if (bG) {
      if (E.backgroundcanvas) {
        E.backgroundcontext.clearRect(0, 0, E.backgroundcanvas.width, E.backgroundcanvas.height);
        E.backgroundcontext.save();
        E.backgroundcontext.translate(-E.canvasCenter.u + aT.baseShadowCenter.u, -E.canvasCenter.v + aT.baseShadowCenter.v);
        bo(E.backgroundcontext);
        E.backgroundcontext.restore();
        var bH = {
          u: Z.center.u,
          v: Z.center.v
        };
        aT.initBaseRectShadow(aT.baseshadowContext, {
          w: aT.baseshadowCanvas.width,
          h: aT.baseshadowCanvas.height
        }, bH, null);
        av(E.backgroundcontext, {
          u: E.backgroundtranslate.u,
          v: E.backgroundtranslate.v
        });
        E.backgroundcontext.save();
        E.backgroundcontext.translate(-E.canvasCenter.u + aT.baseShadowCenter.u, -E.canvasCenter.v + aT.baseShadowCenter.v);
        t.drawSheets(E.backgroundcontext, null);
        E.backgroundcontext.restore()
      } else {
        E.context.clearRect(0, 0, E.canvas.width, E.canvas.height);
        bo(E.context);
        var bH = {
          u: Z.center.u,
          v: Z.center.v
        };
        aT.initBaseRectShadow(aT.baseshadowContext, {
          w: aT.baseshadowCanvas.width,
          h: aT.baseshadowCanvas.height
        }, bH, null);
        av(E.context);
        t.drawSheets(E.context, null)
      } if (E.drawObjectContour) {
        for (var bE = 0; bE < E.objects.length; bE++) {
          var bD = E.objects[bE];
          bD.canvasdirty = true;
          bD.draw()
        }
      }
    } else {
      for (var bE = 0; bE < E.sheets.length; bE++) {
        var bL = E.sheets[bE];
        var bB = bL.dimmed != bL.dimmedprev;
        bL.dimmedprev = bL.dimmed;
        if (bB) {
          var bI = Math.ceil(bL.data.umax - bL.data.umin);
          var bF = Math.ceil(bL.data.vmax - bL.data.vmin);
          var bK = bL.data.umin - E.canvasCenter.u;
          var bJ = bL.data.vmin - E.canvasCenter.v;
          d({
            viewPort: {
              u: bK,
              v: bJ,
              w: bI,
              h: bF
            }
          });
          var bA = E.backgroundcanvas ? E.backgroundcanvas : E.canvas;
          var by = E.backgroundcanvas ? E.backgroundcontext : E.context;
          bK += bA.width / 2;
          bJ += bA.height / 2;
          bI -= 1;
          bF -= 1;
          by.drawImage(E.temppartcanvas, 0, 0, bI, bF, bK, bJ, bI, bF)
        }
      }
      for (var bE = 0; bE < E.objects.length; bE++) {
        var bD = E.objects[bE];
        bD.draw()
      }
    } if (E.backgroundcanvas) {
      E.context.clearRect(0, 0, E.canvas.width, E.canvas.height);
      var bC = -Z.center.u - E.backgroundcanvas.width / 2 + E.canvas.width / 2;
      var bz = -Z.center.v - E.backgroundcanvas.height / 2 + E.canvas.height / 2;
      bC += E.backgroundtranslate.u;
      bz += E.backgroundtranslate.v;
      E.context.drawImage(E.backgroundcanvas, bC, bz)
    }
  }
  function bo(bz) {
    for (var by = 0; by < E.basesheets.length; by++) {
      var bA = E.basesheets[by];
      t.drawRect(bA.data, bz, function(bB, bC) {
        bB.fillStyle = bA.color;
        bB.fillRect(0, 0, bA.width, bA.height)
      }, null, false)
    }
  }
  t.createCanvas = aU;
  t.redraw = aj;
  t.drawRect = X;
  t.redrawSheetCanvases = aC;
  t.drawSheets = bb;
  t.getPointuv = ba;
  t.drawScene = aN;
  var ah = {};
  E.intersections = ah;
  ah.intersections = true;
  var az = [{
      dist: 50,
      numpoints: 4
    }, {
      dist: 20,
      numpoints: 3
    }, {
      dist: 10,
      numpoints: 2
    }, {
      dist: 0,
      numpoints: 1
    }
  ];

  function K(bB, bA, bF, bD) {
    var bH = bF;
    var bG = {
      x: bD.x - bF.x,
      y: bD.y - bF.y,
      z: bD.z - bF.z
    };
    var by = {
      x: bA.x - bH.x,
      y: bA.y - bH.y,
      z: bA.z - bH.z
    };
    var bE = bg(by, bB);
    var bC = bg(bG, bB);
    var bI = a1.vectorMagnitude(bE) / a1.vectorMagnitude(bC);
    var bz = bC.x * bI + bC.y * bI + bC.z * bI - bE.x - bE.y - bE.z;
    if (Math.round(bz) != 0) {
      bI = -bI
    }
    return {
      p: {
        x: bH.x + bI * bG.x,
        y: bH.y + bI * bG.y,
        z: bH.z + bI * bG.z
      },
      inside: bI >= 0 && bI <= 1,
      t: bI
    }
  }
  function aR(bz, by) {
    return Math.round(bz.x) == Math.round(by.x) && Math.round(bz.y) == Math.round(by.y) && Math.round(bz.z) == Math.round(by.z)
  }
  function bn(bF, bB, bA) {
    var bJ = [];
    var bI = null;
    var bG = null;
    var bD = false;
    for (var bE = 0; bE < bF.length; bE++) {
      var bC = bE == bF.length - 1 ? 0 : bE + 1;
      var bK = false;
      if ((bJ.length == 0) || (!aR(bJ[bJ.length - 1], bF[bE]))) {
        bJ[bJ.length] = bF[bE];
        bK = true
      }
      var bL = K(bB, bA, bF[bE], bF[bC]);
      if (bL.inside) {
        var by = aR(bJ[bJ.length - 1], bL.p);
        if (!by) {
          if (bI == null) {
            bI = bJ.length
          } else {
            if (bG == null) {
              bG = bJ.length
            }
          }
          bJ[bJ.length] = bL.p
        }
        if ((by) && (bK)) {
          if (bI == null) {
            bI = bJ.length - 1
          } else {
            if (bG == null) {
              bG = bJ.length - 1
            }
          }
        }
      }
    }
    if (bG == null) {
      return null
    }
    var bz = [];
    bz[0] = [];
    bz[1] = [];
    var bH = bI;
    for (;;) {
      bz[0][bz[0].length] = a1.clonePoint(bJ[bH]);
      if (bH == bG) {
        break
      }
      bH--;
      if (bH < 0) {
        bH = bJ.length - 1
      }
    }
    bH = bI;
    for (;;) {
      bz[1][bz[1].length] = a1.clonePoint(bJ[bH]);
      if (bH == bG) {
        break
      }
      bH++;
      if (bH > bJ.length - 1) {
        bH = 0
      }
    }
    return bz
  }
  function aX(by, bD, bB) {
    for (var bA = 0; bA < by.length; bA++) {
      var bz = bA == by.length - 1 ? 0 : bA + 1;
      var bC = K(bD, bB, by[bA], by[bz]);
      if (bC.inside) {
        return true
      }
    }
    return false
  }
  function aA(bK, bJ) {
    var bL = bK.maxdiag + bJ.maxdiag;
    var bA = Math.sqrt(((bK.centerp.x - bJ.centerp.x) * (bK.centerp.x - bJ.centerp.x)) + ((bK.centerp.y - bJ.centerp.y) * (bK.centerp.y - bJ.centerp.y)) + ((bK.centerp.z - bJ.centerp.z) * (bK.centerp.z - bJ.centerp.z)));
    if (bA > bL) {
      return null
    }
    var bF = bK.normalp.x * bJ.normalp.x + bK.normalp.y * bJ.normalp.y + bK.normalp.z * bJ.normalp.z;
    if (bF == 1) {
      return null
    }
    var bH = bK.normalp.x * bK.normalp.x + bK.normalp.y * bK.normalp.y + bK.normalp.z * bK.normalp.z;
    var bI = bJ.normalp.x * bJ.normalp.x + bJ.normalp.y * bJ.normalp.y + bJ.normalp.z * bJ.normalp.z;
    var bC = bg(bK.normalp, bJ.normalp);
    var bz = (bK.normalp.x * bK.centerp.x + bK.normalp.y * bK.centerp.y + bK.normalp.z * bK.centerp.z);
    var by = (bJ.normalp.x * bJ.centerp.x + bJ.normalp.y * bJ.centerp.y + bJ.normalp.z * bJ.centerp.z);
    var bG = bH * bI - bF * bF;
    var bE = (bz * bI - by * bF) / bG;
    var bD = (by * bH - bz * bF) / bG;
    var bB = {
      x: bE * bK.normalp.x + bD * bJ.normalp.x,
      y: bE * bK.normalp.y + bD * bJ.normalp.y,
      z: bE * bK.normalp.z + bD * bJ.normalp.z
    };
    return {
      n: bC,
      p: ad(bB, 10000)
    }
  }
  function aS(bC, bB) {
    var by = aA(bC, bB);
    bC.intersectionParams[bB.index] = {
      line: by
    };
    bB.intersectionParams[bC.index] = {
      line: by
    };
    if (by == null) {
      return false
    }
    var bA = aX(bC.corners, by.n, by.p);
    var bz = aX(bB.corners, by.n, by.p);
    bC.intersectionParams[bB.index].insideThis = bA;
    bC.intersectionParams[bB.index].insideOther = bz;
    bB.intersectionParams[bC.index].insideThis = bz;
    bB.intersectionParams[bC.index].insideOther = bA;
    return bA && bz
  }
  function aB(bH, bG) {
    if (bH.hidden) {
      return
    }
    if (!bG) {
      bG = E.sheets
    }
    for (var bK = 0; bK < bG.length; bK++) {
      var bF = bG[bK];
      if (bF.index == bH.index) {
        continue
      }
      if (bF.hidden) {
        continue
      }
      var bJ = bH.intersectionParams[bF.index];
      var bL = bJ == null ? aA(bH, bF) : bJ.line;
      if (bL == null) {
        continue
      }
      var bA = null;
      var bD = false;
      var bz = null;
      var by = false;
      var bC = false;
      if (bH.polygons.length == 1) {
        bA = bn(bH.corners, bL.n, bL.p);
        bC = !(bA == null);
        bD = true
      } else {
        bC = bJ == null ? aX(bH.corners, bL.n, bL.p) : bJ.insideThis
      } if (!bC) {
        continue
      }
      bC = bJ == null ? aX(bF.corners, bL.n, bL.p) : bJ.insideOther;
      if (!bC) {
        continue
      }
      var bB = [];
      for (var bE = 0; bE < bH.polygons.length; bE++) {
        var bI = null;
        if (bD) {
          bI = bA;
          bD = false
        } else {
          bI = bn(bH.polygons[bE].points, bL.n, bL.p)
        } if (bI == null) {
          bB[bB.length] = bH.polygons[bE]
        } else {
          bB[bB.length] = {
            points: bI[0]
          };
          bB[bB.length] = {
            points: bI[1]
          }
        }
      }
      bH.polygons = bB;
      bH.intersectors.push(bF.index)
    }
  }
  function v(by) {
    var bB = [];
    for (var bA = 0; bA < by.length; bA++) {
      var bz = by[bA];
      if (bz.points.length == 2) {
        continue
      }
      bB.push(bz)
    }
    return bB
  }
  function aG(bD, bI, bN) {
    var bP = bD;
    if (bI) {
      bP.polygons = [];
      bP.polygons[0] = {
        points: bP.corners
      };
      bP.intersectors = [];
      if (ah.intersections) {
        aB(bP, bN)
      }
      bP.polygons = v(bP.polygons)
    }
    for (var bJ = 0; bJ < bP.polygons.length; bJ++) {
      var bF = bP.polygons[bJ];
      var bA = 10000,
        bC = -10000,
        bE = 10000,
        bG = -10000,
        bQ = 10000,
        bU = -10000;
      bF.pointscanvasuv = [];
      bF.data = {
        umin: bA,
        umax: bC,
        vmin: bE,
        vmax: bG,
        zmin: bQ,
        zmax: bU,
        pointsuv: []
      };
      bF.shData = {
        umin: bA,
        umax: bC,
        vmin: bE,
        vmax: bG,
        zmin: bQ,
        zmax: bU,
        pointsuv: []
      };
      var bK = {
        u: 0,
        v: 0
      };
      for (var bS = 0; bS < bF.points.length; bS++) {
        var bB = bF.points[bS];
        bF.pointscanvasuv[bS] = a(bP, bB);
        bF.data.pointsuv[bS] = u.transformPointuvz(bB, u.transformPointz, E.canvasCenter);
        bK.u += bF.data.pointsuv[bS].u;
        bK.v += bF.data.pointsuv[bS].v;
        var bH = a1.getCoordsInBase(aT.shadowBaseMatrixInverse, bB);
        bF.shData.pointsuv[bS] = {
          u: bH.x,
          v: bH.y,
          z: bH.z
        };
        aO(bF.data, bS);
        aO(bF.shData, bS)
      }
      bK.u /= bF.points.length;
      bK.v /= bF.points.length;
      bF.data.avguv = {
        u: bK.u,
        v: bK.v
      };
      bF.midpoints = [];
      bF.data.midpointsuv = [];
      bF.shData.midpointsuv = [];
      for (var bS = 0; bS < bF.points.length; bS++) {
        var bR = bS == bF.points.length - 1 ? 0 : bS + 1;
        var bM = aq(bF.points[bS], bF.points[bR]);
        var bL = N(bM) + 1;
        for (var bO = 1; bO < bL; bO++) {
          var bV = bO;
          var bT = bL - bV;
          bF.midpoints[bF.midpoints.length] = aI(bF.points[bS], bF.points[bR], bV, bT, bL)
        }
        var bz = bF.data.pointsuv[bS];
        var by = bF.data.pointsuv[bR];
        for (var bO = 1; bO < bL; bO++) {
          var bV = bO;
          var bT = bL - bV;
          bF.data.midpointsuv[bF.data.midpointsuv.length] = bs(bz, by, bV, bT, bL)
        }
        var bz = bF.shData.pointsuv[bS];
        var by = bF.shData.pointsuv[bR];
        for (var bO = 1; bO < bL; bO++) {
          var bV = bO;
          var bT = bL - bV;
          bF.shData.midpointsuv[bF.shData.midpointsuv.length] = bs(bz, by, bV, bT, bL)
        }
      }
      bF.sheetindex = bP.index;
      bF.index = E.polygons.length;
      bF.constraints = [];
      bF.shadowconstraints = [];
      E.polygons.push(bF)
    }
  }
  function aO(by, bz) {
    if (by.pointsuv[bz].u < by.umin) {
      by.umin = by.pointsuv[bz].u
    }
    if (by.pointsuv[bz].u > by.umax) {
      by.umax = by.pointsuv[bz].u
    }
    if (by.pointsuv[bz].v < by.vmin) {
      by.vmin = by.pointsuv[bz].v
    }
    if (by.pointsuv[bz].v > by.vmax) {
      by.vmax = by.pointsuv[bz].v
    }
    if (by.pointsuv[bz].z < by.zmin) {
      by.zmin = by.pointsuv[bz].z
    }
    if (by.pointsuv[bz].z > by.zmax) {
      by.zmax = by.pointsuv[bz].z
    }
  }
  function N(bz) {
    for (var by = 0; by < az.length; by++) {
      if (bz > az[by].dist) {
        return az[by].numpoints
      }
    }
    return az[az.length - 1].numpoints
  }
  function a(bz, bB) {
    var by = bz.A1;
    var bC = bz.corners[0];
    var bA = {
      x: bB.x - bC.x,
      y: bB.y - bC.y,
      z: bB.z - bC.z
    };
    return {
      u: bA.x * by.b1.x + bA.y * by.b2.x + bA.z * by.b3.x,
      v: bA.x * by.b1.y + bA.y * by.b2.y + bA.z * by.b3.y
    }
  }
  function bh(by) {
    I(by, 0);
    I(by, 1)
  }
  function I(bA, bB) {
    if (!bB) {
      bA.constraints = []
    }
    for (var bz = 0; bz < E.polygons.length; bz++) {
      var by = E.polygons[bz];
      if (by.sheetindex == bA.sheetindex) {
        continue
      }
      if (E.sheets[by.sheetindex].hidden || E.sheets[bA.sheetindex].hidden) {
        continue
      }
      W(bA, by, bB)
    }
  }
  function ay(bz, by) {
    W(bz, by, 0);
    W(bz, by, 1)
  }
  function W(bF, bC, bG) {
    var bA = bG ? bF.shData : bF.data;
    var bB = bG ? bC.shData : bC.data;
    var bD = bG ? aT.lightSource : E.viewSource;
    var bE = E.sheets[bF.sheetindex];
    var by = E.sheets[bC.sheetindex];
    if (bE.hidden || by.hidden) {
      return
    }
    var bz = f(bC, bF, by, bE, bB, bA, bD, bG);
    if (!bz) {
      return
    }
    if (!bG) {
      bF.constraints.push(bC.index);
      if (by.dimSheets && !bE.dimmingDisabled) {
        if (by.intersectors.indexOf(bE.index) == -1) {
          bE.dimmed = 1
        }
      }
    } else {
      bC.shadowconstraints.push(bF.index)
    }
  }
  function a6() {
    var bG = {};
    var bD = [];
    for (var bE = 0; bE < E.polygons.length; bE++) {
      if (E.sheets[E.polygons[bE].sheetindex].hidden) {
        continue
      }
      bD.push(bE)
    }
    for (;;) {
      var bz = [];
      var bF = [];
      for (var bE = 0; bE < bD.length; bE++) {
        var bA = E.polygons[bD[bE]].constraints;
        var bB = true;
        for (var bC = 0; bC < bA.length; bC++) {
          var bI = "k" + bA[bC];
          if (typeof(bG[bI]) === "undefined") {
            bB = false;
            break
          }
        }
        if (bB) {
          bF.push(bD[bE])
        } else {
          bz.push(bD[bE])
        }
      }
      for (var bE = 0; bE < bF.length; bE++) {
        var bI = "k" + bF[bE];
        bG[bI] = bF[bE]
      }
      var by = bD.length == bz.length;
      bD = bz;
      if (bD.length == 0) {
        break
      }
      if (by) {
        var bJ = -10000;
        for (var bE = 0; bE < bD.length; bE++) {
          if (E.polygons[bD[bE]].data.zmax > bJ) {
            maxidx = bE;
            bJ = E.polygons[bD[bE]].data.zmax
          }
        }
        var bI = "k" + bD[maxidx];
        bG[bI] = bD[maxidx];
        bD.splice(maxidx, 1);
        if (bD.length == 0) {
          break
        }
      }
    }
    var bH = [];
    for (var bI in bG) {
      bH.push(bG[bI])
    }
    return bH
  }
  function f(bH, bG, bC, bF, bA, bz, bE, bI) {
    if (bA.umin >= bz.umax || bA.umax <= bz.umin || bA.vmin >= bz.vmax || bA.vmax <= bz.vmin) {
      return false
    }
    if (bz.zmin > bA.zmax) {
      return false
    }
    var by = 0.3;
    if (!bI && (bC.objectsheet || bF.objectsheet) && (bC.object != bF.object)) {
      by = 5
    }
    for (var bB = 0; bB < bA.pointsuv.length; bB++) {
      var bJ = bf(bF.normalp, bF.centerp, bH.points[bB], bE);
      if (bJ < -by) {
        var bD = ar.checkInboundsPolygon(bz.pointsuv, bA.pointsuv[bB].u, bA.pointsuv[bB].v);
        if (bD.inbounds) {
          return true
        }
      }
    }
    for (var bB = 0; bB < bA.midpointsuv.length; bB++) {
      var bJ = bf(bF.normalp, bF.centerp, bH.midpoints[bB], bE);
      if (bJ < -by) {
        var bD = ar.checkInboundsPolygon(bz.pointsuv, bA.midpointsuv[bB].u, bA.midpointsuv[bB].v);
        if (bD.inbounds) {
          return true
        }
      }
    }
    for (var bB = 0; bB < bz.pointsuv.length; bB++) {
      var bJ = bf(bC.normalp, bC.centerp, bG.points[bB], bE);
      if (bJ > by) {
        var bD = ar.checkInboundsPolygon(bA.pointsuv, bz.pointsuv[bB].u, bz.pointsuv[bB].v);
        if (bD.inbounds) {
          return true
        }
      }
    }
    for (var bB = 0; bB < bz.midpointsuv.length; bB++) {
      var bJ = bf(bC.normalp, bC.centerp, bG.midpoints[bB], bE);
      if (bJ > by) {
        var bD = ar.checkInboundsPolygon(bA.pointsuv, bz.midpointsuv[bB].u, bz.midpointsuv[bB].v);
        if (bD.inbounds) {
          return true
        }
      }
    }
    return false
  }
  function ac() {
    var bD = [];
    for (var bA = 0; bA < E.sheets.length; bA++) {
      var bC = E.sheets[bA];
      if (bC.dimSheets && !bC.hidden) {
        for (var bz = 0; bz < bC.polygons.length; bz++) {
          bD.push(bC.polygons[bz].index)
        }
      }
    }
    if (bD.length > 0) {
      for (var bA = 0; bA < E.sheets.length; bA++) {
        var bC = E.sheets[bA];
        if (bC.dimmed == 0) {
          continue
        }
        var bB = false;
        for (var bz = 0; bz < bC.polygons.length; bz++) {
          var by = bC.polygons[bz];
          var bF = by.constraints;
          for (var bE = 0; bE < bF.length; bE++) {
            if (bD.indexOf(bF[bE]) != -1) {
              bB = true;
              break
            }
          }
        }
        if (!bB) {
          bC.dimmed = 0
        }
      }
    }
  }
  function an(by, bA) {
    if (!bA) {
      return
    }
    var bz = bA.indexOf(by);
    if (bz != -1) {
      bA.splice(bz, 1)
    }
  }
  function aM(bB, by, bA) {
    if (!bA) {
      return
    }
    var bz = bA.indexOf(bB);
    if (bz != -1) {
      bA[bz] = by
    }
  }
  var ar = {};
  E.calc = ar;

  function ag() {
    for (var bB = 0; bB < E.sheets.length; bB++) {
      E.sheets[bB].intersectionParams = []
    }
    for (var bB = 0; bB < E.sheets.length; bB++) {
      var bH = E.sheets[bB];
      if (!bH.dirty) {
        continue
      }
      if (!E.objectsintersect && bH.objectsheet && !bH.object.intersectionsenabled) {
        continue
      }
      if (bH.intersectors != null) {
        for (var bz = 0; bz < bH.intersectors.length; bz++) {
          var bE = bH.intersectors[bz];
          E.sheets[bE].madedirty = true
        }
      }
      for (var bz = 0; bz < E.sheets.length; bz++) {
        if (bz == bB) {
          continue
        }
        var bA = E.sheets[bz];
        if (bA.hidden) {
          continue
        }
        if (bA.madedirty) {
          continue
        }
        if (!E.objectsintersect && bH.objectsheet && !bH.object.intersectionsenabled) {
          continue
        }
        if (!E.objectsintersect && bA.objectsheet && !bA.object.intersectionsenabled) {
          continue
        }
        if (aS(bH, bA)) {
          bA.madedirty = true
        }
        if (bA.intersectors != null) {
          if (bA.intersectors.indexOf(bB) != -1) {
            bA.madedirty = true
          }
        }
      }
    }
    var bD = [];
    var bG = [];
    var by = [];
    for (var bB = 0; bB < E.sheets.length; bB++) {
      var bC = E.sheets[bB];
      if (E.objectsintersect) {
        if (bC.dirty || bC.madedirty) {
          bG.push(bB);
          by.push(bB)
        }
      } else {
        var bI = bC.objectsheet && (bC.object.intersectionsredefine || bC.object.intersectionsrecalc) && !bC.object.intersectionsenabled;
        if (bC.dirty || bC.madedirty || bI) {
          bG.push(bB);
          var bF = bC.objectsheet && !bC.object.intersectionsenabled;
          if (!bF) {
            by.push(bB)
          }
        }
      } if (bC.dirty) {
        bD.push(bB)
      }
    }
    return {
      dirtySheets: bG,
      movedSheets: bD,
      dirtySheetsRedefinePolygons: by
    }
  }
  function bq(bD) {
    if (E.polygons == null) {
      E.polygons = []
    }
    var by = [];
    for (var bz = 0; bz < E.polygons.length; bz++) {
      var bB = E.polygons[bz];
      var bE = bD.indexOf(bB.sheetindex);
      if (bE != -1) {
        for (var bA = 0; bA < E.polygons.length; bA++) {
          var bC = E.polygons[bA];
          an(bB.index, bC.constraints);
          an(bB.index, bC.shadowconstraints);
          an(bB.index, bC.prevshadowconstraints)
        }
      } else {
        by[by.length] = E.polygons[bz]
      }
    }
    E.polygons = by;
    for (var bz = 0; bz < E.polygons.length; bz++) {
      if (E.polygons[bz].index != bz) {
        for (var bA = 0; bA < E.polygons.length; bA++) {
          var bC = E.polygons[bA];
          aM(E.polygons[bz].index, bz, bC.constraints);
          aM(E.polygons[bz].index, bz, bC.shadowconstraints);
          aM(E.polygons[bz].index, bz, bC.prevshadowconstraints)
        }
        E.polygons[bz].index = bz
      }
    }
  }
  function al(by) {
    for (var bA = by; bA < E.polygons.length; bA++) {
      var bC = E.polygons[bA];
      bh(bC);
      for (var bz = 0; bz < by; bz++) {
        var bD = E.polygons[bz];
        var bB = E.sheets[bD.sheetindex];
        if (bB.hidden) {
          continue
        }
        ay(bD, bC)
      }
    }
  }
  function a7() {
    for (var bz = 0; bz < E.polygons.length; bz++) {
      E.polygons[bz].prevshadowconstraints = [];
      for (var by = 0; by < E.polygons[bz].shadowconstraints.length; by++) {
        E.polygons[bz].prevshadowconstraints[E.polygons[bz].prevshadowconstraints.length] = E.polygons[bz].shadowconstraints[by]
      }
    }
  }
  function bc() {
    E.orderedPolygons = a6()
  }
  function a3() {
    if (aJ != null) {
      return aJ
    }
    var by = [];
    for (var bz = 0; bz < E.sheets.length; bz++) {
      var bA = E.sheets[bz];
      if (!bA.objectsheet || bA.object.intersectionsenabled) {
        by.push(bA)
      }
    }
    aJ = by;
    return aJ
  }
  function aH() {
    var bN = +new Date;
    var bU = ag();
    var bY = bU.dirtySheets;
    var by = bU.movedSheets;
    var bL = bU.dirtySheetsRedefinePolygons;
    var b1 = +new Date;
    var bM = +new Date;
    for (var bT = 0; bT < E.sheets.length; bT++) {
      var bG = E.sheets[bT];
      if (bG.canvasdirty) {
        bG.refreshCanvas()
      }
    }
    e(true, by);
    var b0 = +new Date;
    var bK = +new Date;
    bq(bY);
    var bz = E.polygons.length;
    var bZ = +new Date;
    var bJ = +new Date;
    if (E.objectsintersect) {
      var bP = E.sheets;
      for (var bI = 0; bI < bL.length; bI++) {
        aG(E.sheets[bL[bI]], true, bP)
      }
    } else {
      var bP = a3();
      for (var bI = 0; bI < bL.length; bI++) {
        aG(E.sheets[bL[bI]], true, bP)
      }
      for (var bI = 0; bI < E.objects.length; bI++) {
        var bD = E.objects[bI];
        if (bD.intersectionsenabled) {
          continue
        }
        if (bD.intersectionsredefine) {
          B(bD)
        } else {
          if (bD.intersectionsrecalc) {
            for (var bT = 0; bT < bD.sheets.length; bT++) {
              aG(bD.sheets[bT], false, bD.sheets)
            }
          }
        }
        bD.intersectionsredefine = false;
        bD.intersectionsrecalc = false
      }
    }
    var bX = +new Date;
    var bH = +new Date;
    al(bz);
    var bW = +new Date;
    var bF = +new Date;
    ac();
    var bV = +new Date;
    var bE = +new Date;
    e(false, by);
    var bS = +new Date;
    var bC = +new Date;
    a7();
    var bR = +new Date;
    var bB = +new Date;
    aT.calculateSheetsShadows(false);
    var bQ = +new Date;
    var bA = +new Date;
    bc();
    var bO = +new Date;
    for (var bT = 0; bT < E.sheets.length; bT++) {
      E.sheets[bT].dirty = false;
      E.sheets[bT].madedirty = false
    }
    a5();
    if (E.debug) {
      console.log((b1 - bN) + " - " + (b0 - bM) + " - " + (bZ - bK) + " - " + (bX - bJ) + " - " + (bW - bH) + " - " + (bV - bF) + " - " + (bS - bE) + " - " + (bR - bC) + " - " + (bQ - bB) + " - " + (bO - bA))
    }
  }
  function bw() {
    for (var bA = 0; bA < E.sheets.length; bA++) {
      var bB = E.sheets[bA];
      bB.dimmed = 0;
      bB.intersectionParams = [];
      if (bB.canvasdirty) {
        bB.refreshCanvas()
      }
    }
    E.polygons = [];
    aJ = null;
    var bz = E.objectsintersect ? E.sheets : a3();
    for (var by = 0; by < bz.length; by++) {
      aG(bz[by], true, bz)
    }
    if (!E.objectsintersect) {
      for (var by = 0; by < E.objects.length; by++) {
        var bC = E.objects[by];
        if (bC.intersectionsenabled) {
          continue
        }
        if (bC.intersectionsredefine) {
          B(bC)
        } else {
          for (var bA = 0; bA < bC.sheets.length; bA++) {
            aG(bC.sheets[bA], true, bC.sheets)
          }
        }
        bC.intersectionsredefine = false;
        bC.intersectionsrecalc = false
      }
    }
    for (var bA = 0; bA < E.polygons.length; bA++) {
      bh(E.polygons[bA])
    }
    a7();
    aT.calculateSheetsShadows(true);
    bc();
    for (var bA = 0; bA < E.sheets.length; bA++) {
      var bB = E.sheets[bA];
      bB.dirty = false;
      bB.madedirty = false
    }
    a5()
  }
  function a5() {
    if (!E.sheetsbeingdeleted) {
      return
    }
    var bL = [];
    var bz = [];
    for (var bJ = 0; bJ < E.polygons.length; bJ++) {
      var bD = E.polygons[bJ];
      var bS = E.sheets[bD.sheetindex];
      if (!bS.deleting) {
        bL.push(bD)
      } else {
        bz.push(bJ)
      }
    }
    E.polygons = bL;
    var bH = [];
    for (var bJ = 0; bJ < E.orderedPolygons.length; bJ++) {
      var bK = E.orderedPolygons[bJ];
      if (bz.indexOf(bK) == -1) {
        bH.push(bK)
      }
    }
    E.orderedPolygons = bH;
    for (var bJ = 0; bJ < E.polygons.length; bJ++) {
      var bD = E.polygons[bJ];
      var bB = [];
      for (var bQ = 0; bQ < bD.constraints.length; bQ++) {
        var bK = bD.constraints[bQ];
        if (bz.indexOf(bK) == -1) {
          bB.push(bK)
        }
      }
      bD.constraints = bB;
      var bC = [];
      for (var bQ = 0; bQ < bD.shadowconstraints.length; bQ++) {
        var bK = bD.shadowconstraints[bQ];
        if (bz.indexOf(bK) == -1) {
          bC.push(bK)
        }
      }
      bD.shadowconstraints = bC;
      var bC = [];
      for (var bQ = 0; bQ < bD.prevshadowconstraints.length; bQ++) {
        var bK = bD.prevshadowconstraints[bQ];
        if (bz.indexOf(bK) == -1) {
          bC.push(bK)
        }
      }
      bD.prevshadowconstraints = bC
    }
    var bO = [];
    var bF = [];
    for (var bI = 0; bI < E.sheets.length; bI++) {
      var bA = E.sheets[bI];
      if (!bA.deleting) {
        bO.push(bA)
      } else {
        bF.push(bI)
      }
    }
    E.sheets = bO;
    for (var bI = 0; bI < E.sheets.length; bI++) {
      var bA = E.sheets[bI];
      if (!bA.intersectors) {
        continue
      }
      var bG = [];
      for (var bE = 0; bE < bA.intersectors.length; bE++) {
        var by = bA.intersectors[bE];
        if (bF.indexOf(by) == -1) {
          bG.push(by)
        }
      }
      bA.intersectors = bG
    }
    for (var bN = 0; bN < E.sheets.length; bN++) {
      var bR = E.sheets[bN].index;
      E.sheets[bN].index = bN;
      if (bR != bN) {
        for (var bM = 0; bM < E.polygons.length; bM++) {
          var bD = E.polygons[bM];
          if (bD.sheetindex == bR) {
            bD.sheetindex = bN
          }
        }
        for (var bI = 0; bI < E.sheets.length; bI++) {
          var bA = E.sheets[bI];
          aM(bR, bN, bA.intersectors)
        }
      }
    }
    for (var bM = 0; bM < E.polygons.length; bM++) {
      var bR = E.polygons[bM].index;
      if (bR != bM) {
        aM(bR, bM, E.orderedPolygons);
        for (var bN = 0; bN < E.polygons.length; bN++) {
          var bP = E.polygons[bN];
          aM(bR, bM, bP.constraints);
          aM(bR, bM, bP.shadowconstraints);
          aM(bR, bM, bP.prevshadowconstraints)
        }
        E.polygons[bM].index = bM
      }
    }
    E.sheetsbeingdeleted = false;
    aJ = null
  }
  function y(bz) {
    var by = E.objects.indexOf(bz);
    if (by != -1) {
      E.objects.splice(by, 1)
    }
  }
  ar.allowLimitToCorners = false;
  ar.sheetLimits = {
    xmin: -150,
    xmax: 150,
    ymin: -150,
    ymax: 150,
    zmin: 0,
    zmax: 100
  };
  var w = 0.001;

  function C(bF, bD, bB) {
    var bz = [];
    var bA = true;
    var by = true;
    var bG = true;
    for (var bE = 0; bE < bF.length; bE++) {
      var bC = bE == bF.length - 1 ? 0 : bE + 1;
      bz[bz.length] = bD * bF[bC].v - bF[bC].u * bB - bD * bF[bE].v + bF[bE].u * bB + bF[bC].u * bF[bE].v - bF[bE].u * bF[bC].v;
      if ((bz[bz.length - 1]) > w) {
        by = false;
        bG = false
      }
      if ((bz[bz.length - 1]) < -w) {
        bA = false;
        bG = false
      }
    }
    return {
      inbounds: (by || bA) && !bG,
      areas: bz,
      allzero: bG
    }
  }
  function bv(by) {
    var bz = by.width / 2;
    var bA = by.height / 2;
    by.udif = {
      x: by.p1.x * bz,
      y: by.p1.y * bz,
      z: by.p1.z * bz
    };
    by.vdif = {
      x: by.p2.x * bA,
      y: by.p2.y * bA,
      z: by.p2.z * bA
    }
  }
  function aV(by) {
    var bz = by.centerp;
    var bC = by.p0;
    var bB = by.p1;
    var bA = by.p2;
    bv(by);
    by.corners = af(bz, by.udif, by.vdif);
    by.A1 = a1.getBaseMatrixInverse(by.p1, by.p2, by.normalp);
    by.data = bt(bz, bC, bB, bA, u.transformPoint, u.transformPointz, E.canvasCenter, by.corners);
    if (aT.drawShadows) {
      aT.calculateSheetBaseShadow(by)
    }
    by.dirty = true
  }
  function bt(bX, bQ, bU, bZ, bP, by, bN, bS) {
    var bT = bP(bX);
    var bE = {
      x: bQ.x,
      y: bQ.y,
      z: bQ.z
    };
    var bR = {
      x: bU.x,
      y: bU.y,
      z: bU.z
    };
    var bD = {
      x: bZ.x,
      y: bZ.y,
      z: bZ.z
    };
    var bB = bP(bE);
    var bA = bP(bR);
    var bz = bP(bD);
    var bI = bN.u + bB.u + bT.u;
    var bH = bN.v + bB.v + bT.v;
    var bO = bA.u;
    var bM = bA.v;
    var bL = bz.u;
    var bK = bz.v;
    if (bS == null) {
      return {
        p0uv: bB,
        p1uv: bA,
        p2uv: bz,
        translatex: bI,
        translatey: bH,
        ta: bO,
        tb: bM,
        tc: bL,
        td: bK,
        centerpuv: bT
      }
    }
    var bW = [];
    bW[0] = u.transformPointuvz(bS[0], by, bN);
    bW[1] = u.transformPointuvz(bS[1], by, bN);
    bW[2] = u.transformPointuvz(bS[2], by, bN);
    bW[3] = u.transformPointuvz(bS[3], by, bN);
    var bF = Math.max(bW[0].u, bW[1].u, bW[2].u, bW[3].u);
    var bC = Math.min(bW[0].u, bW[1].u, bW[2].u, bW[3].u);
    var bJ = Math.max(bW[0].v, bW[1].v, bW[2].v, bW[3].v);
    var bG = Math.min(bW[0].v, bW[1].v, bW[2].v, bW[3].v);
    var bY = Math.max(bW[0].z, bW[1].z, bW[2].z, bW[3].z);
    var bV = Math.min(bW[0].z, bW[1].z, bW[2].z, bW[3].z);
    return {
      p0uv: bB,
      p1uv: bA,
      p2uv: bz,
      translatex: bI,
      translatey: bH,
      ta: bO,
      tb: bM,
      tc: bL,
      td: bK,
      centerpuv: bT,
      cornersuv: bW,
      umax: bF,
      umin: bC,
      vmax: bJ,
      vmin: bG,
      zmax: bY,
      zmin: bV
    }
  }
  function af(bB, bA, bz) {
    var by = [];
    by[0] = {
      x: -bA.x - bz.x + bB.x,
      y: -bA.y - bz.y + bB.y,
      z: -bA.z - bz.z + bB.z
    };
    by[1] = {
      x: +bA.x - bz.x + bB.x,
      y: +bA.y - bz.y + bB.y,
      z: +bA.z - bz.z + bB.z
    };
    by[2] = {
      x: +bA.x + bz.x + bB.x,
      y: +bA.y + bz.y + bB.y,
      z: +bA.z + bz.z + bB.z
    };
    by[3] = {
      x: -bA.x + bz.x + bB.x,
      y: -bA.y + bz.y + bB.y,
      z: -bA.z + bz.z + bB.z
    };
    return by
  }
  function bj(bz) {
    bv(bz);
    bz.corners = af(bz.centerp, bz.udif, bz.vdif);
    if (!ar.allowLimitToCorners) {
      return
    }
    bz.xsnap = bz.ysnap = bz.zsnap = bz.xexactsnap = bz.yexactsnap = bz.zexactsnap = bz.xminsnap = bz.xmaxsnap = bz.yminsnap = bz.ymaxsnap = bz.zminsnap = bz.zmaxsnap = false;
    for (var by = 0; by < 4; by++) {
      x(bz, bz.corners[by], by)
    }
  }
  function x(bA, bC, bz) {
    var bB = bA.udif;
    var by = bA.vdif;
    if (bC.x <= ar.sheetLimits.xmin) {
      if (bC.x == ar.sheetLimits.xmin && !bA.xsnap) {
        bA.xexactsnap = true
      }
      bC.x = ar.sheetLimits.xmin;
      bA.xsnap = true;
      bA.xminsnap = true
    }
    if (bC.x >= ar.sheetLimits.xmax) {
      if (bC.x == ar.sheetLimits.xmax && !bA.xsnap) {
        bA.xexactsnap = true
      }
      bC.x = ar.sheetLimits.xmax;
      bA.xsnap = true;
      bA.xmaxsnap = true
    }
    if (bC.y <= ar.sheetLimits.ymin) {
      if (bC.y == ar.sheetLimits.ymin && !bA.ysnap) {
        bA.yexactsnap = true
      }
      bC.y = ar.sheetLimits.ymin;
      bA.ysnap = true;
      bA.yminsnap = true
    }
    if (bC.y >= ar.sheetLimits.ymax) {
      if (bC.y == ar.sheetLimits.ymax && !bA.ysnap) {
        bA.yexactsnap = true
      }
      bC.y = ar.sheetLimits.ymax;
      bA.ysnap = true;
      bA.ymaxsnap = true
    }
    if (bC.z <= ar.sheetLimits.zmin) {
      if (bC.z == ar.sheetLimits.zmin && !bA.zsnap) {
        bA.zexactsnap = true
      }
      bC.z = ar.sheetLimits.zmin;
      bA.zsnap = true;
      bA.zminsnap = true
    }
    if (bC.z >= ar.sheetLimits.zmax) {
      if (bC.z == ar.sheetLimits.zmax && !bA.zsnap) {
        bA.zexactsnap = true
      }
      bC.z = ar.sheetLimits.zmax;
      bA.zsnap = true;
      bA.zmaxsnap = true
    }
    if (bz == 0) {
      bA.centerp = {
        x: bC.x + bB.x + by.x,
        y: bC.y + bB.y + by.y,
        z: bC.z + bB.z + by.z
      }
    }
    if (bz == 1) {
      bA.centerp = {
        x: bC.x - bB.x + by.x,
        y: bC.y - bB.y + by.y,
        z: bC.z - bB.z + by.z
      }
    }
    if (bz == 2) {
      bA.centerp = {
        x: bC.x - bB.x - by.x,
        y: bC.y - bB.y - by.y,
        z: bC.z - bB.z - by.z
      }
    }
    if (bz == 3) {
      bA.centerp = {
        x: bC.x + bB.x - by.x,
        y: bC.y + bB.y - by.y,
        z: bC.z + bB.z - by.z
      }
    }
    bA.corners = af(bA.centerp, bB, by)
  }
  function A(by) {
    by.p0orig = {
      x: -by.width / 2,
      y: 0,
      z: by.height / 2
    };
    by.p1orig = {
      x: 1,
      y: 0,
      z: 0
    };
    by.p2orig = {
      x: 0,
      y: 0,
      z: -1
    };
    by.normalporig = {
      x: 0,
      y: 1,
      z: 0
    };
    if (!by.objectsheet) {
      alpha = by.rot.alphaD * Math.PI / 180;
      beta = by.rot.betaD * Math.PI / 180;
      gamma = by.rot.gammaD * Math.PI / 180;
      by.p0 = by.p0start = a1.rotatePoint(by.p0orig, alpha, beta, gamma);
      by.p1 = by.p1start = a1.rotatePoint(by.p1orig, alpha, beta, gamma);
      by.p2 = by.p2start = a1.rotatePoint(by.p2orig, alpha, beta, gamma);
      by.normalp = by.normalpstart = a1.rotatePoint(by.normalporig, alpha, beta, gamma)
    }
    by.maxdiag = Math.ceil(Math.sqrt(by.width * by.width + by.height * by.height) / 2)
  }
  ar.checkInboundsPolygon = C;
  ar.calculateSheetData = aV;
  ar.limitToCorners = bj;
  ar.defineSheetParams = A;
  ar.calculateChangedSheets = aH;
  ar.calculateAllSheets = bw;
  var Z = {};
  E.scene = Z;
  Z.yardcenterstart = {
    yardx: 0,
    yardy: 0
  };
  Z.yardcenter = {
    yardx: 0,
    yardy: 0
  };
  Z.center = {
    x: 0,
    y: 0,
    u: 0,
    v: 0
  };
  Z.tilewidth = 300;
  Z.tilesize = {
    x: 212,
    y: 106
  };

  function aL(by, bz) {
    t.allowContourDrawing = false;
    E.sheets = [];
    E.basesheets = [];
    E.polygons = [];
    E.objects = [];
    p = [];
    S = {};
    aJ = null;
    E.canvas = by;
    E.context = E.canvas.getContext("2d");
    E.canvasCenter = {
      u: E.canvas.width / 2,
      v: E.canvas.height / 2
    };
    aT.baseshadowCanvas = t.createCanvas(E.canvas.width, E.canvas.height);
    if (bz) {
      aT.baseshadowCanvas.width = bz.w;
      aT.baseshadowCanvas.height = bz.h;
      E.backgroundcanvas = t.createCanvas(bz.w, bz.h);
      E.backgroundcontext = E.backgroundcanvas.getContext("2d");
      E.backgroundtranslate = {
        u: 0,
        v: 0
      };
      E.temppartcanvas = t.createCanvas(E.tempCanvasSize.w, E.tempCanvasSize.h);
      E.temppartcontext = E.temppartcanvas.getContext("2d");
      E.temppartshadowcanvas = t.createCanvas(E.tempCanvasSize.w, E.tempCanvasSize.h);
      E.temppartshadowcontext = E.temppartshadowcanvas.getContext("2d")
    }
    aT.baseshadowContext = aT.baseshadowCanvas.getContext("2d");
    aT.baseShadowCenter = {
      u: aT.baseshadowCanvas.width / 2,
      v: aT.baseshadowCanvas.height / 2
    }
  }
  function ab(bL, bD) {
    var bN = [];
    var bI = [];
    if (bL) {
      for (var bK = 0; bK < bL.length; bK++) {
        var bG = bL[bK];
        var bF = {
          x: (bG.x - Z.yardcenterstart.yardx) * Z.tilewidth,
          y: (bG.y - Z.yardcenterstart.yardy) * Z.tilewidth,
          z: 0
        };
        var bC = new E.BaseSheet(bF, {
          alphaD: -90,
          betaD: 0,
          gammaD: 0
        }, {
          w: Z.tilewidth,
          h: Z.tilewidth
        });
        bC.color = bG.baserectcolor;
        var bE;
        if (bG.sheets) {
          bE = n(bG.sheets, bF);
          bN = bN.concat(bE)
        } else {
          bE = []
        }
        var by = bG.objects;
        var bB = [];
        if (by) {
          for (var bJ = 0; bJ < by.length; bJ++) {
            var bA = by[bJ];
            var bM = aK.defineObject(bA.name);
            if (!bM) {
              continue
            }
            bM.id = "x" + bG.x + "y" + bG.y + "i" + bJ;
            bB.push(bM);
            bI.push(bM);
            bM.setPosition(a1.addPoint(bA.centerp, bF));
            bM.oldcenterp = c(bM.centerp);
            bM.setOrientation(bA.rot);
            bN = bN.concat(bM.sheets)
          }
        }
        var bH = {
          sheets: bE,
          basesheet: bC,
          x: bG.x,
          y: bG.y,
          objects: bB
        };
        var bO = "x" + bG.x + "y" + bG.y;
        S[bO] = bH
      }
    }
    p = bN;
    if (bN.length == 0) {
      bD([], []);
      return
    }
    E.imgCount = 0;
    for (var bK = 0; bK < bN.length; bK++) {
      var bP = new Image();
      var bz = bN[bK].canvas.getContext("2d");
      bP.onload = U(bN[bK], bz, bP, bN.length, function() {
        bD(bN, bI)
      });
      bP.src = bN[bK].canvasdata;
      bN[bK].canvasdata = null
    }
  }
  function n(by, bD) {
    var bC = [];
    if (by == null) {
      return bC
    }
    for (var bA = 0; bA < by.length; bA++) {
      var bB = by[bA];
      var bz = new E.Sheet(a1.addPoint(bB.centerp, bD), bB.rot, {
        w: bB.width,
        h: bB.height
      });
      bz.canvasdata = bB.canvas;
      bC.push(bz)
    }
    return bC
  }
  function U(bA, bz, by, bB, bC) {
    return function() {
      bz.drawImage(by, 0, 0);
      bA.canvasChanged();
      E.imgCount++;
      if (E.imgCount == bB) {
        bC()
      }
    }
  }
  function aQ(by, bB) {
    if (!aT.drawShadows) {
      return
    }
    var bB = bB ? bB : E.sheets;
    for (var bz = 0; bz < bB.length; bz++) {
      var bA = bB[bz];
      bA.baseShadoweData.translatex -= by.u;
      bA.baseShadoweData.translatey -= by.v
    }
  }
  function T(bz) {
    ar.calculateAllSheets();
    var by = u.transformPoint(bz);
    Z.center = {
      x: bz.x,
      y: bz.y,
      u: by.u,
      v: by.v
    };
    aQ(Z.center)
  }
  function V(bz, by) {
    if (!by) {
      if (!bz.z) {
        by = u.transformPoint({
          x: bz.x,
          y: bz.y,
          z: 0
        })
      } else {
        by = u.transformPointz(bz)
      }
    }
    if (!bz) {
      bz = ae(by)
    }
    Z.center.x += bz.x;
    Z.center.y += bz.y;
    Z.center.u += by.u;
    Z.center.v += by.v;
    aQ(by)
  }
  function bp(bz, by) {
    if (!by) {
      if (!bz.z) {
        by = u.transformPoint({
          x: bz.x,
          y: bz.y,
          z: 0
        })
      } else {
        by = u.transformPointz(bz)
      }
    }
    if (!bz) {
      bz = ae(by)
    }
    Z.center.x = bz.x;
    Z.center.y = bz.y;
    var bA = {
      u: by.u - Z.center.u,
      v: by.v - Z.center.v
    };
    Z.center.u = by.u;
    Z.center.v = by.v;
    aQ(bA)
  }
  function at() {
    var bC;
    var by = /\+/g;
    var bA = /([^&=]+)=?([^&]*)/g;
    var bD = function(bE) {
      return decodeURIComponent(bE.replace(by, " "))
    };
    var bB = window.location.search.substring(1);
    var bz = {};
    while (bC = bA.exec(bB)) {
      bz[bD(bC[1])] = bD(bC[2])
    }
    return bz
  }
  function bx() {
    var by = Z.getUrlParams();
    return {
      yardcenter: {
        yardx: parseInt(by.x),
        yardy: parseInt(by.y)
      }
    }
  }
  function be(by, bz) {
    $.ajax({
      url: by,
      cache: false,
      dataType: "json",
      success: bz
    })
  }
  function aw(bz, by, bB, bC, bD) {
    Z.yardcenterstart = {
      yardx: by.yardx,
      yardy: by.yardy
    };
    var bA = bz + "/yard?x=" + by.yardx + "&y=" + by.yardy + "&levelsize=" + bB + "&appid=" + bC + "&appobjects=1";
    be(bA, function(bE) {
      if (bE) {
        if (bE.center) {
          Z.yardcenterstart = {
            yardx: bE.center.x,
            yardy: bE.center.y
          };
          Z.yardcenter = {
            yardx: bE.center.x,
            yardy: bE.center.y
          };
          Z.level = bE.level
        }
        aK.defineAppObjects(bE.appobjects);
        E.objects = [];
        ab(bE.yards, function(bF, bG) {
          bD()
        })
      } else {
        bD()
      }
    })
  }
  function a4(bF, by, bB, bL, bM) {
    var bJ = Z.yardcenter;
    Z.yardcenter = {
      yardx: by.yardx,
      yardy: by.yardy
    };
    var bN = Z.yardcenter;
    var bE = {
      x1: bJ.yardx - bB,
      x2: bJ.yardx + bB,
      y1: bJ.yardy - bB,
      y2: bJ.yardy + bB
    };
    var bG = {
      x1: bN.yardx - bB,
      x2: bN.yardx + bB,
      y1: bN.yardy - bB,
      y2: bN.yardy + bB
    };
    var bA = [];
    for (var bI = bE.x1; bI <= bE.x2; bI++) {
      for (var bH = bE.y1; bH <= bE.y2; bH++) {
        if (bI < bG.x1 || bI > bG.x2 || bH < bG.y1 || bH > bG.y2) {
          bA.push({
            x: bI,
            y: bH
          })
        }
      }
    }
    var bD = [];
    for (var bI = bG.x1; bI <= bG.x2; bI++) {
      for (var bH = bG.y1; bH <= bG.y2; bH++) {
        if (bI < bE.x1 || bI > bE.x2 || bH < bE.y1 || bH > bE.y2) {
          bD.push({
            x: bI,
            y: bH
          })
        }
      }
    }
    var bK = "";
    for (var bC = 0; bC < bD.length; bC++) {
      bK += bD[bC].x + "," + bD[bC].y;
      if (bC < bD.length - 1) {
        bK += ";"
      }
    }
    var bz = bF + "/yard?x=" + Z.yardcenterstart.yardx + "&y=" + Z.yardcenterstart.yardy + "&yards=" + bK + "&appid=" + bL + "&appobjects=0";
    be(bz, function(bO) {
      var bP = {
        x: bJ.yardx * Z.tilewidth,
        y: bJ.yardy * Z.tilewidth,
        z: 0
      };
      var bS = {
        x: bN.yardx * Z.tilewidth,
        y: bN.yardy * Z.tilewidth,
        z: 0
      };
      Z.translateBackground(bP, bS);
      if (bO) {
        ab(bO.yards, function(bT, bV) {
          var bU = {
            sheets: []
          };
          var bW = {
            objects: []
          };
          a2(bT, bU, bW, bA);
          bM(bT, bV, bU.sheets, bW.objects)
        })
      } else {
        var bQ = {
          sheets: []
        };
        var bR = {
          objects: []
        };
        a2(null, bQ, bR, bA);
        bM([], [], bQ.sheets, bR.objects)
      }
    })
  }
  function R(bA) {
    for (var bD = 0; bD < bA.sheets.length; bD++) {
      var bC = bA.sheets[bD];
      bC.destroy()
    }
    var bz = E.basesheets.indexOf(bA.basesheet);
    if (bz != -1) {
      E.basesheets.splice(bz, 1)
    }
    for (var bF = 0; bF < bA.objects.length; bF++) {
      var bE = bA.objects[bF];
      var by = E.objects.indexOf(bE);
      if (by != -1) {
        E.objects.splice(by, 1)
      }
      bE.destroy()
    }
    delete S["x" + bA.x + "y" + bA.y];
    for (var bB = 0; bB < E.sheets.length; bB++) {
      E.sheets[bB].index = bB
    }
  }
  function a2(by, bC, bF, bD) {
    if (by) {}
    for (var bB = 0; bB < bD.length; bB++) {
      var bE = bD[bB];
      var bA = "x" + bE.x + "y" + bE.y;
      var bz = S[bA];
      if (!bz) {
        continue
      }
      bC.sheets = bC.sheets.concat(bz.sheets);
      bF.objects = bF.objects.concat(bz.objects);
      R(bz)
    }
  }
  function bk(bA) {
    var bz = Math.round(bA.x / Z.tilewidth);
    var by = Math.round(bA.y / Z.tilewidth);
    return {
      relyardx: bz,
      relyardy: by,
      yardx: bz + Z.yardcenterstart.yardx,
      yardy: by + Z.yardcenterstart.yardy
    }
  }
  function H(by, bz) {
    if (typeof(by.z) == "undefined") {
      by.z = 0
    }
    if (typeof(bz.z) == "undefined") {
      bz.z = 0
    }
    var bC = u.transformPoint(by);
    var bD = u.transformPoint(bz);
    var bB = bD.u - bC.u;
    var bA = bD.v - bC.v;
    E.backgroundcontext.translate(-bB, -bA);
    aT.baseshadowContext.translate(-bB, -bA);
    E.backgroundtranslate.u += bB;
    E.backgroundtranslate.v += bA;
    E.backgroundcontext.clearRect(E.backgroundtranslate.u, E.backgroundtranslate.v, E.backgroundcanvas.width, E.backgroundcanvas.height);
    aT.baseshadowContext.clearRect(E.backgroundtranslate.u, E.backgroundtranslate.v, E.backgroundcanvas.width, E.backgroundcanvas.height)
  }
  Z.init = aL;
  Z.initScene = T;
  Z.moveCenter = V;
  Z.setCenter = bp;
  Z.getUrlParams = at;
  Z.getUrlLoadInfo = bx;
  Z.getYards = aw;
  Z.getNewYards = a4;
  Z.getYardFromPos = bk;
  Z.translateBackground = H;
  var a1 = {};
  E.geometry = a1;

  function D(bD, bB, bz) {
    var bE = bD.x * (bz.z * bB.y - bB.z * bz.y) - bD.y * (bz.z * bB.x - bB.z * bz.x) + bD.z * (bz.y * bB.x - bB.y * bz.x);
    var bC = {
      x: (bz.z * bB.y - bB.z * bz.y) / bE,
      y: (bD.z * bz.y - bz.z * bD.y) / bE,
      z: (bB.z * bD.y - bD.z * bB.y) / bE
    };
    var bA = {
      x: (bB.z * bz.x - bz.z * bB.x) / bE,
      y: (bz.z * bD.x - bD.z * bz.x) / bE,
      z: (bD.z * bB.x - bB.z * bD.x) / bE
    };
    var by = {
      x: (bz.y * bB.x - bB.y * bz.x) / bE,
      y: (bD.y * bz.x - bz.y * bD.x) / bE,
      z: (bB.y * bD.x - bD.y * bB.x) / bE
    };
    return {
      b1: bC,
      b2: bA,
      b3: by
    }
  }
  function bg(bz, by) {
    return {
      x: (bz.z * by.y) - (bz.y * by.z),
      y: -(bz.z * by.x) + (bz.x * by.z),
      z: (bz.y * by.x) - (bz.x * by.y)
    }
  }
  function q(by) {
    return Math.sqrt(by.x * by.x + by.y * by.y + by.z * by.z)
  }
  function k(by, bz) {
    return Math.round(by * bz) / bz
  }
  function ad(by, bz) {
    return {
      x: k(by.x, bz),
      y: k(by.y, bz),
      z: k(by.z, bz)
    }
  }
  function bf(bB, bz, bA, by) {
    return (bB.x * bz.x + bB.y * bz.y + bB.z * bz.z - bB.x * bA.x - bB.y * bA.y - bB.z * bA.z) / (bB.x * by.x + bB.y * by.y + bB.z * by.z)
  }
  function aD(bA, bz, by, bG, bF, bE) {
    var bD = {
      x: bA.x * bG.x + bz.x * bG.y + by.x * bG.z,
      y: bA.y * bG.x + bz.y * bG.y + by.y * bG.z,
      z: bA.z * bG.x + bz.z * bG.y + by.z * bG.z
    };
    var bC = {
      x: bA.x * bF.x + bz.x * bF.y + by.x * bF.z,
      y: bA.y * bF.x + bz.y * bF.y + by.y * bF.z,
      z: bA.z * bF.x + bz.z * bF.y + by.z * bF.z
    };
    var bB = {
      x: bA.x * bE.x + bz.x * bE.y + by.x * bE.z,
      y: bA.y * bE.x + bz.y * bE.y + by.y * bE.z,
      z: bA.z * bE.x + bz.z * bE.y + by.z * bE.z
    };
    return {
      c1: bD,
      c2: bC,
      c3: bB
    }
  }
  function bu(bz, bA) {
    var by = bz.b1.x * bA.x + bz.b2.x * bA.y + bz.b3.x * bA.z;
    var bC = bz.b1.y * bA.x + bz.b2.y * bA.y + bz.b3.y * bA.z;
    var bB = bz.b1.z * bA.x + bz.b2.z * bA.y + bz.b3.z * bA.z;
    return {
      x: by,
      y: bC,
      z: bB
    }
  }
  function aF(bz, bB, by, bA) {
    return {
      x: bz.x * bB.x + bz.y * by.x + bz.z * bA.x,
      y: bz.x * bB.y + bz.y * by.y + bz.z * bA.y,
      z: bz.x * bB.z + bz.y * by.z + bz.z * bA.z
    }
  }
  function j(bz, by) {
    return {
      x: bz.x + by.x,
      y: bz.y + by.y,
      z: bz.z + by.z
    }
  }
  function m(bz, by) {
    return {
      x: bz.x - by.x,
      y: bz.y - by.y,
      z: bz.z - by.z
    }
  }
  function aI(bC, bB, bA, bz, by) {
    return {
      x: (bC.x * bA + bB.x * bz) / by,
      y: (bC.y * bA + bB.y * bz) / by,
      z: (bC.z * bA + bB.z * bz) / by
    }
  }
  function bs(bC, bB, bA, bz, by) {
    return {
      u: (bC.u * bA + bB.u * bz) / by,
      v: (bC.v * bA + bB.v * bz) / by
    }
  }
  function aq(bz, by) {
    return Math.abs(bz.x - by.x) + Math.abs(bz.y - by.y) + Math.abs(bz.z - by.z)
  }
  function i(bz, by) {
    return a1.vectorMagnitude({
      x: by.x - bz.x,
      y: by.y - bz.y,
      z: by.z - bz.z
    })
  }
  function c(by) {
    return {
      x: by.x,
      y: by.y,
      z: by.z
    }
  }
  function h(bz) {
    var by = Math.max(Math.abs(bz.x), Math.max(Math.abs(bz.y), Math.abs(bz.z)));
    return {
      x: bz.x / by,
      y: bz.y / by,
      z: bz.z / by
    }
  }
  function au(bz, bE, bA, bK) {
    var bF = Math.sin(bE);
    var bJ = Math.cos(bE);
    var bC = Math.sin(bA);
    var bD = Math.cos(bA);
    var by = Math.sin(bK);
    var bB = Math.cos(bK);
    var bI = bz.x * bD * bB + bz.y * bD * by - bz.z * bC;
    var bH = bz.x * (-bJ * by + bF * bC * bB) + bz.y * (bJ * bB + bF * bC * by) + bz.z * bF * bD;
    var bG = bz.x * (bF * by + bJ * bC * bB) + bz.y * (-bF * bB + bJ * bC * by) + bz.z * bJ * bD;
    return {
      x: bI,
      y: bH,
      z: bG
    }
  }
  function bl(bH, bG, bI) {
    var bA = 0;
    var bF = 0;
    var bz = 0;
    nz = bH.x;
    ny = bH.y;
    nx = bH.z;
    lz = bG.x;
    ly = bG.y;
    lx = bG.z;
    mz = bI.x;
    my = bI.y;
    mx = bI.z;
    if (ly == 0 && lx == 0) {
      if (lz == 1) {
        bF = -Math.PI / 2;
        bA = 0;
        bz = Math.atan2(ny, nx)
      } else {
        bF = Math.PI / 2;
        bA = 0;
        bz = Math.atan2(mx, my)
      }
    } else {
      bA = Math.atan2(ly, lx);
      var bE = Math.sin(bA);
      var bB = Math.cos(bA);
      bF = Math.atan2(-lz, bE * ly + bB * lx);
      bz = Math.atan2(bE * nx - bB * ny, -bE * mx + bB * my)
    }
    bA = bA + Math.PI;
    bF = -bF;
    bz = bz + Math.PI;
    if (bA == 2 * Math.PI) {
      bA = 0
    }
    if (bz == 2 * Math.PI) {
      bz = 0
    }
    if (bF < 0) {
      bF = 2 * Math.PI + bF
    }
    if (bF == 2 * Math.PI) {
      bF = 0
    }
    var by = Math.round(180 / Math.PI * bA);
    var bC = Math.round(180 / Math.PI * bF);
    var bD = Math.round(180 / Math.PI * bz);
    return {
      alpha: bA,
      beta: bF,
      gamma: bz,
      alphaD: by,
      betaD: bC,
      gammaD: bD
    }
  }
  function O(bD, bA, bC) {
    var bB = Math.cos(bC);
    var by = Math.sin(bC);
    var bE = bD.x * bA.x + bD.y * bA.y + bD.z * bA.z;
    var bz = {
      x: bA.y * bD.z - bD.y * bA.z,
      y: -bA.x * bD.z + bD.x * bA.z,
      z: bA.x * bD.y - bD.x * bA.y
    };
    prot = {
      x: bD.x * bB + bz.x * by + bA.x * (bE) * (1 - bB),
      y: bD.y * bB + bz.y * by + bA.y * (bE) * (1 - bB),
      z: bD.z * bB + bz.z * by + bA.z * (bE) * (1 - bB)
    };
    return prot
  }
  function aW(bB, bD, bz, bA) {
    var by = {
      x: bB.x - bD.x,
      y: bB.y - bD.y,
      z: bB.z - bD.z
    };
    var bC = a1.rotateAroundAxis(by, bz, bA);
    return {
      x: bC.x + bD.x,
      y: bC.y + bD.y,
      z: bC.z + bD.z
    }
  }
  function z(bD, by, bA, bF, bB, bC) {
    var bz = {
      x: bD.x + by.x,
      y: bD.y + by.y,
      z: bD.z + by.z
    };
    var bE = a1.rotateAroundArbitraryAxis(bz, bF, bB, bC);
    return {
      x: bE.x - bA.x,
      y: bE.y - bA.y,
      z: bE.z - bA.z
    }
  }
  a1.getBaseMatrixInverse = D;
  a1.vectorMagnitude = q;
  a1.getCoordsInBase = bu;
  a1.getPointInBase = aF;
  a1.addPoint = j;
  a1.subPoint = m;
  a1.pointDist = i;
  a1.clonePoint = c;
  a1.normalPoint = h;
  a1.rotatePoint = au;
  a1.inverseRPY = bl;
  a1.rotateAroundAxis = O;
  a1.rotateAroundArbitraryAxis = aW;
  a1.rotateAroundArbitraryAxisp = z;
  var u = {};
  E.transforms = u;
  var a0 = Math.SQRT1_2;
  var aZ = Math.SQRT1_2 / 2;

  function aa(bA) {
    var bz = (bA.x - bA.y) * a0;
    var by = (bA.x + bA.y) * aZ - bA.z;
    return {
      u: bz,
      v: by
    }
  }
  function b(bA) {
    var bz = (bA.x - bA.y) * a0;
    var by = (bA.x + bA.y) * aZ - bA.z;
    var bB = -(bA.x + bA.y);
    return {
      u: bz,
      v: by,
      z: bB
    }
  }
  function bi(bB, bz, by) {
    var bA = bz(bB);
    return {
      u: by.u + bA.u,
      v: by.v + bA.v
    }
  }
  function bm(bB, bz, by) {
    var bA = bz(bB);
    return {
      u: by.u + bA.u,
      v: by.v + bA.v,
      z: bA.z
    }
  }
  function aY(bB) {
    var bA = Math.SQRT1_2;
    var bz = bA / 2;
    var by = ((bB.u - E.canvasCenter.u) / bA + (bB.v - E.canvasCenter.v) / bz) / 2;
    var bC = (bB.v - E.canvasCenter.v) / bz - by;
    return {
      x: Math.floor(by),
      y: Math.floor(bC),
      z: null
    }
  }
  function ae(bB) {
    var bA = Math.SQRT1_2;
    var bz = bA / 2;
    var by = ((bB.u) / bA + (bB.v) / bz) / 2;
    var bC = (bB.v) / bz - by;
    return {
      x: by,
      y: bC,
      z: null
    }
  }
  u.transformPoint = aa;
  u.transformPointz = b;
  u.transformPointuv = bi;
  u.transformPointuvz = bm;
  u.inverseTransformPoint = aY;
  var aK = {};
  E.objhelpers = aK;

  function ap(bF, by) {
    var bC = Math.floor(by.u - bF.canvasSize.relu);
    var bA = Math.floor(by.v - bF.canvasSize.relv);
    var bz = bF.canvasSize.w;
    var bE = bF.canvasSize.h;
    d({
      viewPort: {
        u: bC,
        v: bA,
        w: bz,
        h: bE
      }
    });
    var bB = E.backgroundcanvas ? E.backgroundcanvas : E.canvas;
    var bD = E.backgroundcanvas ? E.backgroundcontext : E.context;
    bC += bB.width / 2;
    bA += bB.height / 2;
    bz -= 1;
    bE -= 1;
    if (E.drawObjectContour) {
      E.temppartcontext.strokeStyle = "#FFF";
      E.temppartcontext.strokeRect(0, 0, bz, bE)
    }
    bD.drawImage(E.temppartcanvas, 0, 0, bz, bE, bC, bA, bz, bE)
  }
  function br(bA) {
    E.appobjects = {};
    for (var by = 0; by < bA.length; by++) {
      var bz = bA[by];
      E.appobjects[bz.name] = bz
    }
  }
  function l(bz) {
    var bE = E.appobjects[bz];
    if (!bE) {
      return null
    }
    var bD = [];
    for (var bA = 0; bA < bE.sheets.length; bA++) {
      var bB = new E.Sheet(bE.sheets[bA].centerp, bE.sheets[bA].rot, {
        w: bE.sheets[bA].width,
        h: bE.sheets[bA].height
      });
      bB.canvasdata = bE.sheets[bA].canvas;
      bD.push(bB)
    }
    var by = bE.canvasSize;
    var bC = new E.SheetObject({
      x: 0,
      y: 0,
      z: 0
    }, {
      alphaD: 0,
      betaD: 0,
      gammaD: 0
    }, bD, by, bE.intersectionsenabled);
    for (var bA = 0; bA < bD.length; bA++) {
      bD[bA].objecttypehidden = bE.hidden
    }
    bC.name = bz;
    return bC
  }
  function P(by) {
    return by / Math.PI * 180
  }
  function ax(by) {
    return by / 180 * Math.PI
  }
  function am(by) {
    var bz = {
      alpha: by.alpha,
      beta: by.beta,
      gamma: by.gamma,
      alphaD: by.alphaD,
      betaD: by.betaD,
      gammaD: by.gammaD
    };
    if (typeof(bz.alpha) === "undefined") {
      bz.alpha = ax(bz.alphaD)
    }
    if (typeof(bz.beta) === "undefined") {
      bz.beta = ax(bz.betaD)
    }
    if (typeof(bz.gamma) === "undefined") {
      bz.gamma = ax(bz.gammaD)
    }
    if (typeof(bz.alphaD) === "undefined") {
      bz.alphaD = P(bz.alpha)
    }
    if (typeof(bz.betaD) === "undefined") {
      bz.betaD = P(bz.beta)
    }
    if (typeof(bz.gammaD) === "undefined") {
      bz.gammaD = P(bz.gamma)
    }
    return bz
  }
  function Y(bz, bA) {
    var by = [];
    by[0] = a1.rotatePoint(bA[0], bz.alpha, bz.beta, bz.gamma);
    by[1] = a1.rotatePoint(bA[1], bz.alpha, bz.beta, bz.gamma);
    by[2] = a1.rotatePoint(bA[2], bz.alpha, bz.beta, bz.gamma);
    return by
  }
  function g(bz, bC) {
    var bA = document.createElement("img");
    var bB = document.createElement("canvas");
    bB.width = 16;
    bB.height = 16;
    var by = bB.getContext("2d");
    bA.onload = function() {
      by.drawImage(bA, 0, 0);
      bC(bB.toDataURL())
    };
    bA.src = bz
  }
  function M() {
    if (E.currentSheet == -1) {
      return {
        name: "my object",
        thumbnail: "",
        hidden: false,
        canvasSize: {
          w: 0,
          h: 0,
          relu: 0,
          relv: 0
        },
        sheets: {}
      }
    }
    var bI = E.sheets[E.currentSheet];
    var bK = bI.group;
    var bC = [];
    if (typeof(bK) !== "undefined" && bK !== null) {
      for (var bz = 0; bz < E.sheets.length; bz++) {
        var bM = E.sheets[bz];
        if (bM.group != bK) {
          continue
        }
        bC.push({
          centerp: bM.centerp,
          rot: {
            alphaD: bM.rot.alphaD,
            betaD: bM.rot.betaD,
            gammaD: bM.rot.gammaD
          },
          width: bM.width,
          height: bM.height,
          canvas: bM.canvas.toDataURL()
        })
      }
    } else {
      var bM = bI;
      bC.push({
        centerp: bM.centerp,
        rot: {
          alphaD: bM.rot.alphaD,
          betaD: bM.rot.betaD,
          gammaD: bM.rot.gammaD
        },
        width: bM.width,
        height: bM.height,
        canvas: bM.canvas.toDataURL()
      })
    }
    var by = 0;
    for (var bz = 0; bz < bC.length; bz++) {
      var bG = bC[bz];
      var bA = bG.width / 2;
      var bF = bG.height / 2;
      var bH = Math.sqrt(bA * bA + bF * bF) + i(bG.centerp, {
        x: 0,
        y: 0,
        z: 0
      });
      if (bH > by) {
        by = bH
      }
    }
    var bJ = Math.round(by * 2);
    var bB = bJ;
    var bE = Math.round(by);
    var bD = Math.round(by);
    var bL = {
      w: bJ,
      h: bB,
      relu: bE,
      relv: bD
    };
    return {
      name: "my object",
      thumbnail: "",
      hidden: false,
      intersectionsenabled: true,
      canvasSize: bL,
      sheets: bC
    }
  }
  function bd() {
    var by = M();
    return JSON.stringify(by)
  }
  function B(bD) {
    for (var bE = 0; bE < bD.sheets.length; bE++) {
      aG(bD.sheets[bE], true, bD.sheets)
    }
    for (var bE = 0; bE < bD.sheets.length; bE++) {
      var bI = bD.sheets[bE];
      bI.startpolygons = [];
      var bB = E.geometry.getBaseMatrixInverse(bI.p1start, bI.p2start, bI.normalpstart);
      for (var bC = 0; bC < bI.polygons.length; bC++) {
        var by = bI.polygons[bC];
        var bH = [];
        var bF = [];
        for (var bA = 0; bA < by.points.length; bA++) {
          var bz = a1.subPoint(by.points[bA], bD.centerp);
          bz = a1.rotatePoint(bz, -bD.rot.alpha, -bD.rot.beta, -bD.rot.gamma);
          bH.push(bz);
          var bG = E.geometry.getCoordsInBase(bB, bz);
          bF.push(bG)
        }
        bI.startpolygons.push({
          points: bH,
          relpoints: bF
        });
        bI.startpolygonscenterp = a1.clonePoint(bI.startcenterp)
      }
    }
  }
  aK.fillRot = am;
  aK.defineAppObjects = br;
  aK.defineObject = l;
  aK.getThumbnailString = g;
  aK.getCurrentSheetsObject = M;
  aK.getCurrentSheetsObjectStr = bd;
  E.BaseSheet = function(bB, bz, bA) {
    var by = aK.fillRot(bz);
    this.width = bA.w;
    this.height = bA.h;
    this.centerp = a1.clonePoint(bB);
    this.rot = {
      alphaD: by.alphaD,
      betaD: by.betaD,
      gammaD: by.gammaD
    };
    ar.defineSheetParams(this);
    ar.limitToCorners(this);
    ar.calculateSheetData(this);
    aT.calculateSheetShade(this);
    E.basesheets.push(this)
  };
  E.BaseSheet.prototype.destroy = function() {
    var by = E.basesheets.indexOf(this);
    if (by != -1) {
      E.basesheets.splice(by, 1)
    }
  };
  E.Sheet = function(bB, bz, bA) {
    var by = aK.fillRot(bz);
    this.width = bA.w;
    this.height = bA.h;
    this.centerp = a1.clonePoint(bB);
    this.rot = {
      alphaD: by.alphaD,
      betaD: by.betaD,
      gammaD: by.gammaD
    };
    this.objectsheet = false;
    this.skipDensityMap = false;
    this.dimSheets = false;
    this.dimmingDisabled = false;
    this.hidden = false;
    this.dirty = false;
    this.canvasdirty = true;
    this.dimmed = 0;
    this.dimmedprev = 0;
    this.castshadows = true;
    this.allowshadows = true;
    this.canvas = t.createCanvas(this.width, this.height);
    this.context = this.canvas.getContext("2d");
    this.shadowcanvas = t.createCanvas(this.width, this.height);
    this.shadowcontext = this.shadowcanvas.getContext("2d");
    this.shadowtempcanvas = t.createCanvas(this.width, this.height);
    this.shadowtempcontext = this.shadowtempcanvas.getContext("2d");
    this.baseshadowcanvas = t.createCanvas(this.width, this.height);
    this.baseshadowcontext = this.baseshadowcanvas.getContext("2d");
    this.compositecanvas = t.createCanvas(this.width, this.height);
    this.compositecontext = this.compositecanvas.getContext("2d");
    ar.defineSheetParams(this);
    ar.limitToCorners(this);
    ar.calculateSheetData(this);
    aT.calculateSheetShade(this);
    this.index = E.sheets.length;
    E.sheets.push(this);
    aJ = null
  };
  E.Sheet.prototype.canvasChanged = function() {
    this.canvasdirty = true;
    if (this.objectsheet) {
      this.object.canvasdirty = true;
      this.object.intersectionsrecalc = true
    }
    this.dirty = true
  };
  E.Sheet.prototype.destroy = function() {
    this.hidden = true;
    this.dirty = true;
    this.deleting = true;
    E.sheetsbeingdeleted = true
  };
  E.Sheet.prototype.refreshCanvas = function() {
    if (!this.canvasdirty) {
      return
    }
    this.compositecontext.clearRect(0, 0, this.width, this.height);
    t.redrawSheetCanvases(this);
    this.canvasdirty = false
  };
  E.Sheet.prototype.setShadows = function(bz, by) {
    this.castshadows = bz;
    if (this.allowshadows != by) {
      this.allowshadows = by;
      aT.calculateSheetShade(this)
    }
    this.dirty = true
  };
  E.Sheet.prototype.setDimming = function(bz, by) {
    this.dimSheets = bz;
    this.dimmingDisabled = by;
    this.dirty = true
  };
  E.SheetObject = function(bP, bF, bC, bA, bO) {
    for (var bM = 0; bM < bC.length; bM++) {
      var bH = bC[bM];
      bH.objectsheet = true;
      bH.object = this;
      bH.startcenterp = {
        x: bH.centerp.x,
        y: bH.centerp.y,
        z: bH.centerp.z
      };
      bH.rotcenterp = {
        x: bH.centerp.x,
        y: bH.centerp.y,
        z: bH.centerp.z
      };
      bH.centerp.x += bP.x;
      bH.centerp.y += bP.y;
      bH.centerp.z += bP.z;
      bH.intersectionParams = [];
      ar.calculateSheetData(bH)
    }
    this.intersectionsenabled = bO ? true : false;
    if (!E.objectsintersect && !this.intersectionsenabled) {
      for (var bM = 0; bM < bC.length; bM++) {
        aG(bC[bM], true, bC)
      }
      for (var bM = 0; bM < bC.length; bM++) {
        var bH = bC[bM];
        var bE = [];
        var bz = E.geometry.getBaseMatrixInverse(bH.p1start, bH.p2start, bH.normalpstart);
        for (var bJ = 0; bJ < bH.polygons.length; bJ++) {
          var bD = bH.polygons[bJ];
          var bL = [];
          var by = [];
          for (var bI = 0; bI < bD.points.length; bI++) {
            var bK = a1.subPoint(bD.points[bI], bP);
            bL.push(bK);
            var bB = E.geometry.getCoordsInBase(bz, bK);
            by.push(bB)
          }
          bE.push({
            points: bL,
            relpoints: by
          })
        }
        bH.startpolygons = bE;
        bH.startpolygonscenterp = a1.clonePoint(bH.startcenterp)
      }
    }
    this.centerp = bP;
    this.rot = aK.fillRot(bF);
    this.rotvectorstart = [{
        x: 1,
        y: 0,
        z: 0
      }, {
        x: 0,
        y: 0,
        z: -1
      }, {
        x: 0,
        y: 1,
        z: 0
      }
    ];
    this.rotvector = Y(this.rot, this.rotvectorstart);
    this.sheets = bC;
    this.hidden = false;
    this.intersectionsredefine = false;
    this.intersectionsrecalc = false;
    this.canvasSize = bA;
    if (bA.w > E.tempCanvasSize.w || bA.h > E.tempCanvasSize.h) {
      var bG = Math.max(bA.w, E.tempCanvasSize.w);
      var bN = Math.max(bA.h, E.tempCanvasSize.h);
      E.tempCanvasSize = {
        w: bG,
        h: bN
      };
      E.temppartcanvas.width = bG;
      E.temppartcanvas.height = bN;
      E.temppartshadowcanvas.width = bG;
      E.temppartshadowcanvas.height = bN
    }
    this.oldcenterp = c(this.centerp);
    this.centerpuv = u.transformPoint(this.centerp);
    this.centerpuvrel = u.transformPointuvz(this.centerp, u.transformPointz, E.canvasCenter);
    this.oldcenterpuv = u.transformPoint(this.oldcenterp);
    this.setOrientation(this.rot);
    E.objects.push(this)
  };
  E.SheetObject.prototype.setDimming = function(bB, by) {
    for (var bz = 0; bz < this.sheets.length; bz++) {
      var bA = this.sheets[bz];
      bA.dimSheets = bB;
      bA.dimmingDisabled = by;
      bA.dirty = true
    }
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.setShadows = function(bB, bA) {
    for (var by = 0; by < this.sheets.length; by++) {
      var bz = this.sheets[by];
      bz.setShadows(bB, bA)
    }
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.setCollision = function(by) {
    for (var bz = 0; bz < this.sheets.length; bz++) {
      var bA = this.sheets[bz];
      bA.skipDensityMap = !by
    }
  };
  E.SheetObject.prototype.destroy = function() {
    this.hide();
    for (var bz = 0; bz < this.sheets.length; bz++) {
      var by = this.sheets[bz];
      by.deleting = true
    }
    E.sheetsbeingdeleted = true;
    this.deleting = true
  };
  E.SheetObject.prototype.setPosition = function(by) {
    this.move(by, true)
  };
  E.SheetObject.prototype.move = function(bC, bA) {
    this.oldcenterp = c(this.centerp);
    if (bA) {
      this.centerp.x = bC.x;
      this.centerp.y = bC.y;
      this.centerp.z = bC.z
    } else {
      this.centerp.x += bC.x;
      this.centerp.y += bC.y;
      this.centerp.z += bC.z
    }
    var bF = this.centerp.x - this.oldcenterp.x;
    var bE = this.centerp.y - this.oldcenterp.y;
    var bD = this.centerp.z - this.oldcenterp.z;
    for (var bH = 0; bH < this.sheets.length; bH++) {
      var bI = this.sheets[bH];
      bI.centerp.x = bI.rotcenterp.x + this.centerp.x;
      bI.centerp.y = bI.rotcenterp.y + this.centerp.y;
      bI.centerp.z = bI.rotcenterp.z + this.centerp.z;
      ar.calculateSheetData(bI);
      if (bI.polygons && !E.objectsintersect && !this.intersectionsenabled) {
        for (var bG = 0; bG < bI.polygons.length; bG++) {
          var by = bI.polygons[bG];
          for (var bz = 0; bz < by.points.length; bz++) {
            var bB = by.points[bz];
            bB.x += bF;
            bB.y += bE;
            bB.z += bD
          }
        }
      }
    }
    this.centerpuv = u.transformPoint(this.centerp);
    this.centerpuvrel = u.transformPointuvz(this.centerp, u.transformPointz, E.canvasCenter);
    this.oldcenterpuv = u.transformPoint(this.oldcenterp);
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.rotateBase = function(by, bz) {
    this.rotate(by, bz, true)
  };
  E.SheetObject.prototype.rotate = function(bC, bD, bA) {
    if (bA) {
      this.rotvector[0] = a1.rotateAroundAxis(this.rotvectorstart[0], bC, bD);
      this.rotvector[1] = a1.rotateAroundAxis(this.rotvectorstart[1], bC, bD);
      this.rotvector[2] = a1.rotateAroundAxis(this.rotvectorstart[2], bC, bD)
    } else {
      this.rotvector[0] = a1.rotateAroundAxis(this.rotvector[0], bC, bD);
      this.rotvector[1] = a1.rotateAroundAxis(this.rotvector[1], bC, bD);
      this.rotvector[2] = a1.rotateAroundAxis(this.rotvector[2], bC, bD)
    }
    this.rot = a1.inverseRPY(this.rotvector[0], this.rotvector[1], this.rotvector[2]);
    for (var bF = 0; bF < this.sheets.length; bF++) {
      var bH = this.sheets[bF];
      if (bA) {
        bH.p0 = a1.rotateAroundAxis(bH.p0start, bC, bD);
        bH.p1 = a1.rotateAroundAxis(bH.p1start, bC, bD);
        bH.p2 = a1.rotateAroundAxis(bH.p2start, bC, bD);
        bH.normalp = a1.rotateAroundAxis(bH.normalpstart, bC, bD);
        bH.rotcenterp = a1.rotateAroundAxis(bH.startcenterp, bC, bD);
        if (bH.startpolygons && !E.objectsintersect && !this.intersectionsenabled) {
          bH.polygons = [];
          for (var bE = 0; bE < bH.startpolygons.length; bE++) {
            var by = {
              points: []
            };
            bH.polygons.push(by);
            var bG = bH.startpolygons[bE];
            for (var bz = 0; bz < bG.points.length; bz++) {
              var bB = a1.rotateAroundAxis(bG.points[bz], bC, bD);
              by.points.push(a1.addPoint(bB, this.centerp))
            }
          }
        }
      } else {
        bH.p0 = a1.rotateAroundAxis(bH.p0, bC, bD);
        bH.p1 = a1.rotateAroundAxis(bH.p1, bC, bD);
        bH.p2 = a1.rotateAroundAxis(bH.p2, bC, bD);
        bH.normalp = a1.rotateAroundAxis(bH.normalp, bC, bD);
        bH.rotcenterp = a1.rotateAroundAxis(bH.rotcenterp, bC, bD);
        if (bH.polygons && !E.objectsintersect && !this.intersectionsenabled) {
          for (var bE = 0; bE < bH.polygons.length; bE++) {
            var by = bH.polygons[bE];
            for (var bz = 0; bz < by.points.length; bz++) {
              var bB = a1.subPoint(by.points[bz], this.centerp);
              bB = a1.rotateAroundAxis(bB, bC, bD);
              by.points[bz] = a1.addPoint(bB, this.centerp)
            }
          }
        }
      }
      bH.centerp.x = bH.rotcenterp.x + this.centerp.x;
      bH.centerp.y = bH.rotcenterp.y + this.centerp.y;
      bH.centerp.z = bH.rotcenterp.z + this.centerp.z;
      ar.calculateSheetData(bH);
      aT.calculateSheetShade(bH)
    }
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.setOrientation = function(bz) {
    this.rot = aK.fillRot(bz);
    this.rotvector = Y(this.rot, this.rotvectorstart);
    for (var bB = 0; bB < this.sheets.length; bB++) {
      var bC = this.sheets[bB];
      bC.p0 = a1.rotatePoint(bC.p0start, this.rot.alpha, this.rot.beta, this.rot.gamma);
      bC.p1 = a1.rotatePoint(bC.p1start, this.rot.alpha, this.rot.beta, this.rot.gamma);
      bC.p2 = a1.rotatePoint(bC.p2start, this.rot.alpha, this.rot.beta, this.rot.gamma);
      bC.normalp = a1.rotatePoint(bC.normalpstart, this.rot.alpha, this.rot.beta, this.rot.gamma);
      bC.rotcenterp = a1.rotatePoint(bC.startcenterp, this.rot.alpha, this.rot.beta, this.rot.gamma);
      bC.centerp.x = bC.rotcenterp.x + this.centerp.x;
      bC.centerp.y = bC.rotcenterp.y + this.centerp.y;
      bC.centerp.z = bC.rotcenterp.z + this.centerp.z;
      ar.calculateSheetData(bC);
      aT.calculateSheetShade(bC);
      if (bC.startpolygons && !E.objectsintersect && !this.intersectionsenabled) {
        bC.polygons = [];
        for (var bA = 0; bA < bC.startpolygons.length; bA++) {
          var bE = {
            points: []
          };
          bC.polygons.push(bE);
          var bD = bC.startpolygons[bA];
          for (var bF = 0; bF < bD.points.length; bF++) {
            var by = a1.rotatePoint(bD.points[bF], this.rot.alpha, this.rot.beta, this.rot.gamma);
            bE.points.push(a1.addPoint(by, this.centerp))
          }
        }
      }
    }
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.setSheetPos = function(bG, bD, bJ) {
    var bK = bG;
    var bE = aK.fillRot(bJ);
    bK.startcenterp = bD;
    bK.p0start = a1.rotatePoint(bK.p0orig, bE.alpha, bE.beta, bE.gamma);
    bK.p1start = a1.rotatePoint(bK.p1orig, bE.alpha, bE.beta, bE.gamma);
    bK.p2start = a1.rotatePoint(bK.p2orig, bE.alpha, bE.beta, bE.gamma);
    bK.normalpstart = a1.rotatePoint(bK.normalporig, bE.alpha, bE.beta, bE.gamma);
    if (bK.startpolygons && !E.objectsintersect && !this.intersectionsenabled) {
      var bH = a1.subPoint(bD, bK.startpolygonscenterp);
      for (var bC = 0; bC < bK.startpolygons.length; bC++) {
        var bF = bK.startpolygons[bC];
        for (var bA = 0; bA < bF.points.length; bA++) {
          var bI = bF.relpoints[bA];
          bF.points[bA] = a1.getPointInBase(bI, bK.p1start, bK.p2start, bK.normalpstart);
          bF.points[bA] = a1.addPoint(bF.points[bA], bH)
        }
      }
    }
    var bz = this.rot;
    bK.p0 = a1.rotatePoint(bK.p0start, bz.alpha, bz.beta, bz.gamma);
    bK.p1 = a1.rotatePoint(bK.p1start, bz.alpha, bz.beta, bz.gamma);
    bK.p2 = a1.rotatePoint(bK.p2start, bz.alpha, bz.beta, bz.gamma);
    bK.normalp = a1.rotatePoint(bK.normalpstart, bz.alpha, bz.beta, bz.gamma);
    bK.rotcenterp = a1.rotatePoint(bK.startcenterp, bz.alpha, bz.beta, bz.gamma);
    bK.centerp.x = bK.rotcenterp.x + this.centerp.x;
    bK.centerp.y = bK.rotcenterp.y + this.centerp.y;
    bK.centerp.z = bK.rotcenterp.z + this.centerp.z;
    ar.calculateSheetData(bK);
    aT.calculateSheetShade(bK);
    if (bK.startpolygons && !E.objectsintersect && !this.intersectionsenabled) {
      bK.polygons = [];
      for (var bC = 0; bC < bK.startpolygons.length; bC++) {
        var by = {
          points: []
        };
        bK.polygons.push(by);
        var bF = bK.startpolygons[bC];
        for (var bA = 0; bA < bF.points.length; bA++) {
          var bB = a1.rotatePoint(bF.points[bA], this.rot.alpha, this.rot.beta, this.rot.gamma);
          by.points.push(a1.addPoint(bB, this.centerp))
        }
      }
    }
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.rotateSheet = function(bE, bG, bF, bB) {
    var bH = bE;
    if (bH.startpolygons && !E.objectsintersect && !this.intersectionsenabled) {
      for (var bC = 0; bC < bH.startpolygons.length; bC++) {
        var bD = bH.startpolygons[bC];
        for (var bz = 0; bz < bD.points.length; bz++) {
          bD.points[bz] = a1.rotateAroundArbitraryAxis(bD.points[bz], bG, bF, bB)
        }
      }
    }
    bH.p0start = a1.rotateAroundAxis(bH.p0start, bF, bB);
    bH.p1start = a1.rotateAroundAxis(bH.p1start, bF, bB);
    bH.p2start = a1.rotateAroundAxis(bH.p2start, bF, bB);
    bH.normalpstart = a1.rotateAroundAxis(bH.normalpstart, bF, bB);
    bH.startcenterp = a1.rotateAroundArbitraryAxis(bH.startcenterp, bG, bF, bB);
    bG = a1.rotatePoint(bG, this.rot.alpha, this.rot.beta, this.rot.gamma);
    bF = a1.rotatePoint(bF, this.rot.alpha, this.rot.beta, this.rot.gamma);
    bH.p0 = a1.rotateAroundAxis(bH.p0, bF, bB);
    bH.p1 = a1.rotateAroundAxis(bH.p1, bF, bB);
    bH.p2 = a1.rotateAroundAxis(bH.p2, bF, bB);
    bH.normalp = a1.rotateAroundAxis(bH.normalp, bF, bB);
    bH.rotcenterp = a1.rotateAroundArbitraryAxis(bH.rotcenterp, bG, bF, bB);
    bH.centerp.x = bH.rotcenterp.x + this.centerp.x;
    bH.centerp.y = bH.rotcenterp.y + this.centerp.y;
    bH.centerp.z = bH.rotcenterp.z + this.centerp.z;
    ar.calculateSheetData(bH);
    aT.calculateSheetShade(bH);
    if (bH.startpolygons && bH.polygons && !E.objectsintersect && !this.intersectionsenabled) {
      bH.polygons = [];
      for (var bC = 0; bC < bH.startpolygons.length; bC++) {
        var by = {
          points: []
        };
        bH.polygons.push(by);
        var bD = bH.startpolygons[bC];
        for (var bz = 0; bz < bD.points.length; bz++) {
          var bA = a1.rotatePoint(bD.points[bz], this.rot.alpha, this.rot.beta, this.rot.gamma);
          by.points.push(a1.addPoint(bA, this.centerp))
        }
      }
    }
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.redefineIntersections = function() {
    this.intersectionsredefine = true
  };
  E.SheetObject.prototype.show = function() {
    for (var by = 0; by < this.sheets.length; by++) {
      this.sheets[by].hidden = false;
      this.sheets[by].dirty = true
    }
    this.hidden = false;
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.hide = function() {
    for (var by = 0; by < this.sheets.length; by++) {
      this.sheets[by].hidden = true;
      this.sheets[by].dirty = true
    }
    this.hidden = true;
    this.intersectionsrecalc = true;
    this.canvasdirty = true
  };
  E.SheetObject.prototype.getString = function() {
    var bB = [];
    for (var bz = 0; bz < this.sheets.length; bz++) {
      var bA = this.sheets[bz];
      bB.push({
        centerp: bA.centerp,
        rot: {
          alphaD: bA.rot.alphaD,
          betaD: bA.rot.betaD,
          gammaD: bA.rot.gammaD
        },
        width: bA.width,
        height: bA.height,
        canvas: bA.canvas.toDataURL()
      })
    }
    var by = {
      name: "my object",
      thumbnail: "",
      hidden: false,
      intersectionsenabled: this.intersectionsenabled,
      canvasSize: this.canvasSize,
      sheets: bB
    };
    return JSON.stringify(by)
  };
  E.SheetObject.prototype.draw = function() {
    if (!this.canvasdirty) {
      return
    }
    var bH = this.centerpuv;
    var bI = this.oldcenterpuv;
    var bA = Math.ceil(Math.abs(bH.u - bI.u) + this.canvasSize.w);
    var by = Math.ceil(Math.abs(bH.v - bI.v) + this.canvasSize.h);
    var bD = (bA < E.temppartcanvas.width && by < E.temppartcanvas.height);
    if (bD) {
      var bG = Math.floor(Math.min(bH.u, bI.u) - this.canvasSize.relu);
      var bF = Math.floor(Math.min(bH.v, bI.v) - this.canvasSize.relv);
      var bE = bA;
      var bC = by;
      d({
        viewPort: {
          u: bG,
          v: bF,
          w: bE,
          h: bC
        }
      });
      var bB = E.backgroundcanvas ? E.backgroundcanvas : E.canvas;
      var bz = E.backgroundcanvas ? E.backgroundcontext : E.context;
      bG += bB.width / 2;
      bF += bB.height / 2;
      bE -= 1;
      bC -= 1;
      bz.drawImage(E.temppartcanvas, 0, 0, bE, bC, bG, bF, bE, bC);
      if (E.drawObjectContour) {
        bz.strokeStyle = "#FFF";
        bz.strokeRect(bH.u - this.canvasSize.relu + bB.width / 2, bH.v - this.canvasSize.relv + bB.height / 2, this.canvasSize.w, this.canvasSize.h)
      }
    } else {
      ap(this, bI);
      ap(this, bH)
    }
    this.canvasdirty = false;
    if (this.deleting) {
      y(this)
    }
  };
  E.DensityMap = function(by) {
    this.map = {};
    this.granularity = by
  };
  E.DensityMap.prototype.get = function(bB) {
    var bA = this.map;
    var bz = this.granularity;
    var by = Math.round(bB.x / bz);
    var bD = Math.round(bB.y / bz);
    var bC = Math.round(bB.z / bz);
    if (bA["x" + by + "y" + bD + "z" + bC]) {
      return bA["x" + by + "y" + bD + "z" + bC]
    }
    return 0
  };
  E.DensityMap.prototype.put = function(bB) {
    var bA = this.map;
    var bz = this.granularity;
    var by = Math.round(bB.x / bz);
    var bD = Math.round(bB.y / bz);
    var bC = Math.floor(bB.z / bz);
    this.add("x" + by + "y" + bD + "z" + bC);
    this.add("x" + (by + 1) + "y" + (bD) + "z" + (bC));
    this.add("x" + (by) + "y" + (bD + 1) + "z" + (bC));
    this.add("x" + (by - 1) + "y" + (bD) + "z" + (bC));
    this.add("x" + (by) + "y" + (bD - 1) + "z" + (bC))
  };
  E.DensityMap.prototype.remove = function(bB) {
    var bA = this.map;
    var bz = this.granularity;
    var by = Math.round(bB.x / bz);
    var bD = Math.round(bB.y / bz);
    var bC = Math.floor(bB.z / bz);
    this.sub("x" + by + "y" + bD + "z" + bC);
    this.sub("x" + (by + 1) + "y" + (bD) + "z" + (bC));
    this.sub("x" + (by) + "y" + (bD + 1) + "z" + (bC));
    this.sub("x" + (by - 1) + "y" + (bD) + "z" + (bC));
    this.sub("x" + (by) + "y" + (bD - 1) + "z" + (bC))
  };
  E.DensityMap.prototype.add = function(bz) {
    var by = this.map;
    if (!by[bz]) {
      by[bz] = 1
    } else {
      by[bz] = by[bz] + 1
    }
  };
  E.DensityMap.prototype.sub = function(bz) {
    var by = this.map;
    if (!by[bz] || by[bz] == 0) {
      return
    } else {
      by[bz] = by[bz] - 1
    }
  };
  E.DensityMap.prototype.addSheet = function(by) {
    this.processSheet(by, this.put)
  };
  E.DensityMap.prototype.removeSheet = function(by) {
    this.processSheet(by, this.remove)
  };
  E.DensityMap.prototype.processSheet = function(bC, bK) {
    var bA = this.granularity;
    var bI = bC;
    if (bI.skipDensityMap) {
      return
    }
    var bz = Math.round(bI.width / bA);
    var by = Math.round(bI.height / bA);
    var bN = {
      x: (bI.corners[1].x - bI.corners[0].x) / bz,
      y: (bI.corners[1].y - bI.corners[0].y) / bz,
      z: (bI.corners[1].z - bI.corners[0].z) / bz
    };
    var bP = {
      x: (bI.corners[3].x - bI.corners[0].x) / by,
      y: (bI.corners[3].y - bI.corners[0].y) / by,
      z: (bI.corners[3].z - bI.corners[0].z) / by
    };
    var bH = bI.canvas.width;
    var bM = bI.canvas.height;
    var bO = bI.context.getImageData(0, 0, bH, bM).data;
    var bD = a1.clonePoint(a1.addPoint(bI.corners[0], {
      x: (bN.x + bP.x) / 2,
      y: (bN.y + bP.y) / 2,
      z: (bN.z + bP.z) / 2
    }));
    for (var bF = 0; bF < by; bF++) {
      actpx = a1.clonePoint(bD);
      for (var bG = 0; bG < bz; bG++) {
        var bL = Math.round(bG * bA + bA / 2);
        var bJ = Math.round(bF * bA + bA / 2);
        var bE = (bL + bH * bJ) * 4;
        var bB = bO[bE + 3];
        if (bB != 0) {
          bK.call(this, actpx)
        }
        actpx = a1.addPoint(actpx, bN)
      }
      bD = a1.addPoint(bD, bP)
    }
  };
  E.DensityMap.prototype.addSheets = function(bz) {
    for (var by = 0; by < bz.length; by++) {
      this.addSheet(bz[by])
    }
  };
  E.DensityMap.prototype.removeSheets = function(bz) {
    for (var by = 0; by < bz.length; by++) {
      this.removeSheet(bz[by])
    }
  };
  E.DensityMap.prototype.getTargetHeight = function(bB, bz) {
    var by = bB.z + bz;
    for (var bC = by; bC > 0; bC--) {
      var bA = this.get({
        x: bB.x,
        y: bB.y,
        z: bC
      });
      if (bA) {
        return bC
      }
    }
    return 0
  };
  E.DensityMap.prototype.getTargetPoint = function(bD, by, bE, bz) {
    var bF = true;
    var bB = false;
    var bA = {
      x: bD.x + by.x,
      y: bD.y + by.y,
      z: bD.z + by.z
    };
    var bC = this.getTargetHeight({
      x: bA.x,
      y: bA.y,
      z: bA.z
    }, bE);
    if (bC >= bA.z) {
      if (bC - bA.z < bz) {
        bB = true;
        bA.z = bC
      } else {
        by.x = 0;
        by.y = 0;
        bA = {
          x: bD.x,
          y: bD.y,
          z: bD.z + by.z
        };
        var bC = this.getTargetHeight({
          x: bA.x,
          y: bA.y,
          z: bA.z
        }, bE);
        if (bC >= bA.z) {
          bB = true;
          if (bC - bA.z < bz) {
            bA.z = bC
          } else {
            bF = false;
            bA.z = bC
          }
        }
      }
    }
    return {
      allowMove: bF,
      targetp: bA,
      movex: by.x,
      movey: by.y,
      stopFall: bB
    }
  };
  aT.shadowBaseMatrixInverse = a1.getBaseMatrixInverse(aT.lightSourcep1, aT.lightSourcep2, aT.lightSource);
  return E
})();
if (typeof(exports) !== "undefined" && exports !== null) {
  exports = module.exports = sheetengine
};