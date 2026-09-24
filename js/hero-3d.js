// Three.js 3D background animation for the hero section

(function () {
  'use strict';

  var heroCanvas = document.getElementById('hero-3d-canvas');
  var fallback   = document.getElementById('webgl-fallback');

  function isWebGLAvailable() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (heroCanvas) heroCanvas.style.display = 'none';
    return;
  }
  if (!isWebGLAvailable() || !heroCanvas) {
    if (heroCanvas) heroCanvas.style.display = 'none';
    if (fallback) fallback.style.display = 'block';
    return;
  }

  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  var DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);

  // ── SCENE & CAMERA ─────────────────────────────────────────────────────────
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 18);

  var renderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    antialias: !isMobile,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(DPR);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // ── LIGHTING ───────────────────────────────────────────────────────────────
  var ambientLight = new THREE.AmbientLight(0x0e091d, 1.2);
  scene.add(ambientLight);

  var pointPurple = new THREE.PointLight(0xa855f7, 55, 38);
  pointPurple.position.set(8, 4, 10);
  scene.add(pointPurple);

  var pointIndigo = new THREE.PointLight(0x6366f1, 45, 32);
  pointIndigo.position.set(-8, -4, 8);
  scene.add(pointIndigo);

  // ── GLOW TEXTURE GENERATOR ─────────────────────────────────────────────────
  function createParticleTexture() {
    var c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    var ctx = c.getContext('2d');
    var grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(168, 85, 247, 0.95)');
    grad.addColorStop(0.6, 'rgba(99, 102, 241, 0.38)');
    grad.addColorStop(1, 'rgba(168, 85, 247, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  var particleTex = createParticleTexture();

  // ── KINETIC SHADER MATRIX FIELD ────────────────────────────────────────────
  var COLS = isMobile ? 36 : 64;
  var ROWS = isMobile ? 28 : 48;
  var SPREAD_X = isMobile ? 38 : 56;
  var SPREAD_Y = isMobile ? 28 : 42;
  var TOTAL_POINTS = COLS * ROWS;

  var matrixGeo = new THREE.BufferGeometry();
  var matrixPositions = new Float32Array(TOTAL_POINTS * 3);
  var matrixBasePositions = new Float32Array(TOTAL_POINTS * 3);
  var matrixColors = new Float32Array(TOTAL_POINTS * 3);

  var colorPurple = new THREE.Color(0xa855f7);
  var colorIndigo = new THREE.Color(0x6366f1);
  var colorLilac  = new THREE.Color(0xc084fc);

  for (var c = 0; c < COLS; c++) {
    for (var r = 0; r < ROWS; r++) {
      var idx = c * ROWS + r;
      var u = (c / (COLS - 1)) * 2 - 1;
      var v = (r / (ROWS - 1)) * 2 - 1;

      var x = u * SPREAD_X * 0.5;
      var y = v * SPREAD_Y * 0.5;
      var z = -4;

      matrixPositions[idx * 3]     = x;
      matrixPositions[idx * 3 + 1] = y;
      matrixPositions[idx * 3 + 2] = z;

      matrixBasePositions[idx * 3]     = x;
      matrixBasePositions[idx * 3 + 1] = y;
      matrixBasePositions[idx * 3 + 2] = z;

      var d = Math.sqrt(u * u + v * v);
      var mixCol = colorPurple.clone().lerp(colorIndigo, Math.min(1, d * 1.2));
      if (d < 0.4) mixCol.lerp(colorLilac, 0.40);

      matrixColors[idx * 3]     = mixCol.r;
      matrixColors[idx * 3 + 1] = mixCol.g;
      matrixColors[idx * 3 + 2] = mixCol.b;
    }
  }

  matrixGeo.setAttribute('position', new THREE.BufferAttribute(matrixPositions, 3));
  matrixGeo.setAttribute('color', new THREE.BufferAttribute(matrixColors, 3));

  var matrixMat = new THREE.PointsMaterial({
    size: isMobile ? 0.22 : 0.34,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    map: particleTex
  });

  var matrixMesh = new THREE.Points(matrixGeo, matrixMat);
  matrixMesh.position.set(0, -2, -3);
  matrixMesh.rotation.x = -Math.PI * 0.26;
  scene.add(matrixMesh);

  // ── KINETIC WIREFRAME GRID CONDUITS ───────────────────────────────────────
  var linePositions = [];
  var lineColors = [];

  for (var li = 0; li < COLS; li++) {
    for (var lj = 0; lj < ROWS; lj++) {
      var lidx = li * ROWS + lj;
      var lx = matrixPositions[lidx * 3];
      var ly = matrixPositions[lidx * 3 + 1];
      var lz = matrixPositions[lidx * 3 + 2];

      if (li < COLS - 1) {
        var nX = (li + 1) * ROWS + lj;
        linePositions.push(lx, ly, lz, matrixPositions[nX * 3], matrixPositions[nX * 3 + 1], matrixPositions[nX * 3 + 2]);
        lineColors.push(0.66, 0.33, 0.97, 0.39, 0.40, 0.95);
      }
      if (lj < ROWS - 1) {
        var nY = li * ROWS + lj + 1;
        linePositions.push(lx, ly, lz, matrixPositions[nY * 3], matrixPositions[nY * 3 + 1], matrixPositions[nY * 3 + 2]);
        lineColors.push(0.39, 0.40, 0.95, 0.75, 0.52, 0.99);
      }
    }
  }

  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3));

  var lineMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: isMobile ? 0.08 : 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var lineMesh = new THREE.LineSegments(lineGeo, lineMat);
  lineMesh.position.copy(matrixMesh.position);
  lineMesh.rotation.copy(matrixMesh.rotation);
  scene.add(lineMesh);

  // ── INTERACTIVE 3D SYSTEMS CORE (HERO FEATURE STAGE) ──────────────────────
  // Represents distributed mesh nodes & cryptographic packet pipeline
  var coreGroup = new THREE.Group();
  coreGroup.position.set(isMobile ? 0 : 7.2, isMobile ? 3.5 : 0.4, 1.5);
  scene.add(coreGroup);

  // 1. Central Cryptographic Polyhedron
  var coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
  var coreWireMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.80,
    blending: THREE.AdditiveBlending
  });
  var coreInnerMesh = new THREE.Mesh(coreGeo, coreWireMat);
  coreGroup.add(coreInnerMesh);

  // 2. High-index Refractive Core Body
  var coreSolidMat = new THREE.MeshPhysicalMaterial({
    color: 0x110b24,
    emissive: 0x3b0764,
    emissiveIntensity: 0.5,
    roughness: 0.15,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85
  });
  var coreSolidMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.95, 1), coreSolidMat);
  coreGroup.add(coreSolidMesh);

  // 3. Orbiting Gyro Telemetry Rings
  var ringMat1 = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending
  });
  var ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.035, 16, 80), ringMat1);
  ring1.rotation.x = Math.PI * 0.35;
  coreGroup.add(ring1);

  var ringMat2 = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });
  var ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.025, 16, 90), ringMat2);
  ring2.rotation.y = Math.PI * 0.42;
  coreGroup.add(ring2);

  var ringMat3 = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  var ring3 = new THREE.Mesh(new THREE.TorusGeometry(4.1, 0.02, 16, 90), ringMat3);
  ring3.rotation.z = Math.PI * 0.25;
  coreGroup.add(ring3);

  // 4. Orbiting Data Packet Satellites
  var SATELLITE_COUNT = 6;
  var satellites = [];
  var satGeo = new THREE.SphereGeometry(0.12, 12, 12);
  var satMat = new THREE.MeshBasicMaterial({
    color: 0xc084fc,
    blending: THREE.AdditiveBlending
  });

  for (var si = 0; si < SATELLITE_COUNT; si++) {
    var sat = new THREE.Mesh(satGeo, satMat);
    sat.userData = {
      radius: 3.1 + (si % 3) * 0.5,
      speed: 0.8 + si * 0.22,
      phase: (si / SATELLITE_COUNT) * Math.PI * 2,
      inclination: (si * 0.4) - 0.6
    };
    coreGroup.add(sat);
    satellites.push(sat);
  }

  // ── AMBIENT CYBERNETIC STARS / PACKET PARTICLES ───────────────────────────
  var PACKET_COUNT = isMobile ? 350 : 850;
  var packetGeo = new THREE.BufferGeometry();
  var packetPositions = new Float32Array(PACKET_COUNT * 3);
  var packetColors = new Float32Array(PACKET_COUNT * 3);

  for (var pi = 0; pi < PACKET_COUNT; pi++) {
    packetPositions[pi * 3]     = (Math.random() - 0.5) * 80;
    packetPositions[pi * 3 + 1] = (Math.random() - 0.5) * 50;
    packetPositions[pi * 3 + 2] = (Math.random() - 0.5) * 40 - 5;

    var pMix = Math.random();
    var pCol = pMix < 0.55 ? colorPurple : (pMix < 0.85 ? colorIndigo : colorLilac);
    packetColors[pi * 3]     = pCol.r;
    packetColors[pi * 3 + 1] = pCol.g;
    packetColors[pi * 3 + 2] = pCol.b;
  }

  packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPositions, 3));
  packetGeo.setAttribute('color', new THREE.BufferAttribute(packetColors, 3));

  var packetMat = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  var packetField = new THREE.Points(packetGeo, packetMat);
  scene.add(packetField);

  // ── STATE & PHYSICS ────────────────────────────────────────────────────────
  var time = 0;
  var scrollProgress = 0;
  var mouseX = 0, mouseY = 0;
  var targetMouseX = 0, targetMouseY = 0;
  var shockwaveTime = -100;
  var isPaused = false;
  var frameCount = 0;

  // Track scroll with smooth factor
  window.addEventListener('scroll', function () {
    var maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
  }, { passive: true });

  // Pointer tracking
  window.addEventListener('pointermove', function (e) {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // Shockwave interaction on click
  window.addEventListener('click', function (e) {
    // Only trigger on empty space or stage clicks
    if (e.target.closest('a, button, input, .ai-widget, .hero-terminal')) return;
    shockwaveTime = time;
  });

  document.addEventListener('visibilitychange', function () {
    isPaused = document.hidden;
  });

  // ── ANIMATION ENGINE (60 FPS HARDWARE ACCELERATED) ─────────────────────────
  function animate() {
    requestAnimationFrame(animate);
    if (isPaused) return;

    frameCount++;
    time += 0.012;

    // Smooth cursor interpolation
    mouseX += (targetMouseX - mouseX) * 0.065;
    mouseY += (targetMouseY - mouseY) * 0.065;

    // Scroll interpolation: 0 in Hero, 1 further down
    var heroProgress = Math.min(1, (window.scrollY / Math.max(1, window.innerHeight * 0.85)));

    // ── 1. Animate Kinetic Matrix Mesh ──
    var posAttr = matrixGeo.attributes.position;
    var colAttr = matrixGeo.attributes.color;

    // Cursor influence in world space
    var cursorWorldX = mouseX * 12;
    var cursorWorldY = mouseY * 8;

    for (var i = 0; i < COLS; i++) {
      for (var j = 0; j < ROWS; j++) {
        var idx = i * ROWS + j;
        var bx = matrixBasePositions[idx * 3];
        var by = matrixBasePositions[idx * 3 + 1];

        // Dual frequency harmonic wave equations
        var waveA = Math.sin(bx * 0.18 + time * 1.5) * Math.cos(by * 0.16 + time * 1.2) * 1.6;
        var waveB = Math.sin((bx + by) * 0.12 - time * 0.9) * 0.8;

        // Interactive cursor magnetic repulsion
        var dx = bx - cursorWorldX;
        var dy = by - cursorWorldY;
        var distToCursor = Math.sqrt(dx * dx + dy * dy);
        var cursorRepel = Math.max(0, 1 - distToCursor / 10) * 2.2;

        // Shockwave ripple effect
        var shockDist = Math.sqrt(bx * bx + by * by);
        var shockPhase = (time - shockwaveTime) * 14;
        var shockWave = 0;
        if (shockwaveTime > 0 && shockPhase > 0 && shockPhase < 35) {
          var ringDiff = Math.abs(shockDist - shockPhase);
          if (ringDiff < 4.0) {
            shockWave = Math.sin((4.0 - ringDiff) * Math.PI * 0.5) * 2.8;
          }
        }

        // Calculate final Z displacement
        var totalZ = matrixBasePositions[idx * 3 + 2] + waveA + waveB + cursorRepel + shockWave;
        posAttr.setZ(idx, totalZ);

        // Dynamic color shifting on excitation
        if (cursorRepel > 0.5 || shockWave > 0.8) {
          colAttr.setXYZ(idx, 0.95, 0.82, 1.0);
        } else {
          var baseMix = (Math.sin(bx * 0.1 + time) + 1) * 0.5;
          colAttr.setXYZ(
            idx,
            0.66 * (1 - baseMix) + 0.39 * baseMix,
            0.33 * (1 - baseMix) + 0.40 * baseMix,
            0.97 * (1 - baseMix) + 0.95 * baseMix
          );
        }
      }
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    // ── 2. Throttled Grid Line Updates (Desktop only, every 2 frames) ──
    if (!isMobile && frameCount % 2 === 0) {
      var lPos = lineGeo.attributes.position;
      var curLine = 0;
      for (var ci = 0; ci < COLS; ci++) {
        for (var cj = 0; cj < ROWS; cj++) {
          var pIdx = ci * ROWS + cj;
          var px = posAttr.getX(pIdx);
          var py = posAttr.getY(pIdx);
          var pz = posAttr.getZ(pIdx);

          if (ci < COLS - 1) {
            var nXIdx = (ci + 1) * ROWS + cj;
            lPos.setXYZ(curLine * 2, px, py, pz);
            lPos.setXYZ(curLine * 2 + 1, posAttr.getX(nXIdx), posAttr.getY(nXIdx), posAttr.getZ(nXIdx));
            curLine++;
          }
          if (cj < ROWS - 1) {
            var nYIdx = ci * ROWS + cj + 1;
            lPos.setXYZ(curLine * 2, px, py, pz);
            lPos.setXYZ(curLine * 2 + 1, posAttr.getX(nYIdx), posAttr.getY(nYIdx), posAttr.getZ(nYIdx));
            curLine++;
          }
        }
      }
      lPos.needsUpdate = true;
    }

    // Matrix parallax & opacity dampening on scroll
    // In Hero: bright & reactive. On scroll down: drops to ambient background without blocking text!
    matrixMat.opacity = Math.max(0.18, 0.85 - heroProgress * 0.65);
    lineMat.opacity   = Math.max(0.04, (isMobile ? 0.08 : 0.16) - heroProgress * 0.10);
    matrixMesh.position.y = -2 - heroProgress * 6 + mouseY * 0.8;
    lineMesh.position.y   = matrixMesh.position.y;
    matrixMesh.rotation.z = mouseX * 0.03 + time * 0.015;
    lineMesh.rotation.z   = matrixMesh.rotation.z;

    // ── 3. Animate Systems Gyro-Core ──
    // Rotates with time + magnetic cursor interaction
    coreInnerMesh.rotation.x = time * 0.35 + mouseY * 0.4;
    coreInnerMesh.rotation.y = time * 0.50 + mouseX * 0.4;
    coreSolidMesh.rotation.copy(coreInnerMesh.rotation);

    ring1.rotation.z = time * 0.65;
    ring1.rotation.x = Math.PI * 0.35 + mouseY * 0.2;
    ring2.rotation.z = -time * 0.45;
    ring2.rotation.y = Math.PI * 0.42 + mouseX * 0.25;
    ring3.rotation.y = time * 0.55;

    // Pulse core scale slightly
    var corePulse = 1.0 + Math.sin(time * 2.2) * 0.04;
    coreInnerMesh.scale.setScalar(corePulse);

    // Orbiting packet satellites
    for (var s = 0; s < satellites.length; s++) {
      var satItem = satellites[s];
      var uData = satItem.userData;
      var satAngle = time * uData.speed + uData.phase;
      satItem.position.x = Math.cos(satAngle) * uData.radius;
      satItem.position.y = Math.sin(satAngle) * uData.radius * Math.cos(uData.inclination);
      satItem.position.z = Math.sin(satAngle) * uData.radius * Math.sin(uData.inclination);
    }

    // Fade and scale down the core on scroll so it stays behind content
    var coreScale = Math.max(0, 1.0 - heroProgress * 1.35);
    coreGroup.scale.setScalar(coreScale);
    coreGroup.position.z = 1.5 - heroProgress * 25; // Pulls deep back into the screen
    coreWireMat.opacity = Math.max(0, 0.80 * (1.0 - heroProgress * 1.4));
    coreSolidMat.opacity = Math.max(0, 0.85 * (1.0 - heroProgress * 1.4));
    ringMat1.opacity = Math.max(0, 0.55 * (1.0 - heroProgress * 1.4));
    ringMat2.opacity = Math.max(0, 0.45 * (1.0 - heroProgress * 1.4));
    ringMat3.opacity = Math.max(0, 0.35 * (1.0 - heroProgress * 1.4));

    // Dynamic point lights tracking
    pointPurple.position.x = 8 + Math.cos(time * 0.8) * 3 + mouseX * 2;
    pointPurple.position.y = 4 + Math.sin(time * 0.6) * 2;
    pointIndigo.position.x = -8 + Math.sin(time * 0.7) * 3;

    // Ambient packet field drift
    packetField.rotation.y = time * 0.02 + mouseX * 0.04;
    packetField.position.y = -heroProgress * 10;

    // Camera micro-parallax
    camera.position.x += (mouseX * 1.4 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.9 - camera.position.y) * 0.05;
    camera.lookAt(0, -heroProgress * 2, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Expose global handles for debug or tests
  window.__hero3D = {
    scene: scene,
    camera: camera,
    renderer: renderer,
    coreGroup: coreGroup,
    matrixMesh: matrixMesh
  };

})();
