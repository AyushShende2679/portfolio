// hero-3d.js — DRAMATIC Immersive Three.js Background
// Full-screen particle wave mesh + geometric accents + scroll-reactive
// Uses global THREE (loaded via CDN script tag)

(function () {

var heroCanvas = document.getElementById('hero-3d-canvas');
var fallback   = document.getElementById('webgl-fallback');
var loaderPct  = document.getElementById('loader-pct');

function isWebGLAvailable() {
  try {
    var c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch (e) { return false; }
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

var isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
var DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.8);

// ── SCENE ──────────────────────────────────────────────────────────────
var scene = new THREE.Scene();

// ── CAMERA ─────────────────────────────────────────────────────────────
var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 22);

// ── RENDERER ───────────────────────────────────────────────────────────
var renderer = new THREE.WebGLRenderer({
  canvas: heroCanvas,
  antialias: !isMobile,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(DPR);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
if (!isMobile) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
}

function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

// ── LIGHTING ───────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x080812, 1.0));

var dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
dirLight.position.set(4, 8, 12);
scene.add(dirLight);

var accent1 = new THREE.PointLight(0x7c7cff, 80, 40);
accent1.position.set(-10, 5, 8);
scene.add(accent1);

var accent2 = new THREE.PointLight(0xa855f7, 60, 35);
accent2.position.set(10, -4, 6);
scene.add(accent2);

var accent3 = new THREE.PointLight(0x22d3ee, 45, 30);
accent3.position.set(0, 12, -4);
scene.add(accent3);

// ── PARTICLE WAVE MESH ─────────────────────────────────────────────────
var COLS = isMobile ? 40 : 80;
var ROWS = isMobile ? 30 : 55;
var SPREAD_X = 50;
var SPREAD_Y = 35;
var TOTAL = COLS * ROWS;

var waveGeo    = new THREE.BufferGeometry();
var wavePos    = new Float32Array(TOTAL * 3);
var waveColors = new Float32Array(TOTAL * 3);
var waveSizes  = new Float32Array(TOTAL);
var wavePhases = new Float32Array(TOTAL);

var C1 = new THREE.Color(0x7c7cff);
var C2 = new THREE.Color(0xa855f7);
var C3 = new THREE.Color(0x22d3ee);
var C4 = new THREE.Color(0x4ade80);
var palette = [C1, C2, C3, C4];

for (var i = 0; i < COLS; i++) {
  for (var j = 0; j < ROWS; j++) {
    var idx = i * ROWS + j;
    var nx = (i / (COLS - 1)) * 2 - 1;
    var ny = (j / (ROWS - 1)) * 2 - 1;
    wavePos[idx * 3]     = nx * SPREAD_X * 0.5;
    wavePos[idx * 3 + 1] = ny * SPREAD_Y * 0.5;
    wavePos[idx * 3 + 2] = 0;
    wavePhases[idx] = Math.sin(i * 0.5 + j * 0.4);
    var dist = Math.sqrt(nx * nx + ny * ny);
    var col = palette[Math.floor(dist * 2) % palette.length].clone();
    col.lerp(palette[Math.floor(dist * 3 + 1) % palette.length], 0.4);
    waveColors[idx * 3]     = col.r;
    waveColors[idx * 3 + 1] = col.g;
    waveColors[idx * 3 + 2] = col.b;
    waveSizes[idx] = isMobile ? 0.8 : (Math.random() < 0.1 ? 2.8 : 1.2 + Math.random() * 0.8);
  }
}

waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePos, 3));
waveGeo.setAttribute('color',    new THREE.BufferAttribute(waveColors, 3));
waveGeo.setAttribute('size',     new THREE.BufferAttribute(waveSizes, 1));

// Glow sprite texture
function makeSpriteTex() {
  var c = document.createElement('canvas');
  c.width = c.height = 64;
  var ctx = c.getContext('2d');
  var g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,   'rgba(124,124,255,1)');
  g.addColorStop(0.3, 'rgba(124,124,255,0.8)');
  g.addColorStop(0.7, 'rgba(124,124,255,0.25)');
  g.addColorStop(1,   'rgba(124,124,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

var waveMat = new THREE.PointsMaterial({
  size: isMobile ? 0.18 : 0.30,
  vertexColors: true,
  transparent: true,
  opacity: 0.90,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  map: makeSpriteTex(),
});

var wavePoints = new THREE.Points(waveGeo, waveMat);
wavePoints.position.z = -2;
scene.add(wavePoints);

// ── GRID LINES ─────────────────────────────────────────────────────────
var linePositions = [];
var lineColors    = [];

for (var li = 0; li < COLS; li++) {
  for (var lj = 0; lj < ROWS; lj++) {
    var lidx = li * ROWS + lj;
    var lx = wavePos[lidx * 3];
    var ly = wavePos[lidx * 3 + 1];
    var lz = wavePos[lidx * 3 + 2];
    if (li < COLS - 1) {
      var nidx = (li + 1) * ROWS + lj;
      linePositions.push(lx, ly, lz, wavePos[nidx*3], wavePos[nidx*3+1], wavePos[nidx*3+2]);
      lineColors.push(0.30, 0.30, 0.90, 0.20, 0.20, 0.70);
    }
    if (lj < ROWS - 1) {
      var nidx2 = li * ROWS + lj + 1;
      linePositions.push(lx, ly, lz, wavePos[nidx2*3], wavePos[nidx2*3+1], wavePos[nidx2*3+2]);
      lineColors.push(0.50, 0.20, 0.80, 0.30, 0.15, 0.60);
    }
  }
}

var lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
lineGeo.setAttribute('color',    new THREE.BufferAttribute(new Float32Array(lineColors), 3));

var lineMat = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: isMobile ? 0.06 : 0.12,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

var lineSegments = new THREE.LineSegments(lineGeo, lineMat);
lineSegments.position.z = -2;
scene.add(lineSegments);

// ── FLOATING 3D ACCENTS ────────────────────────────────────────────────
var accentGroup = new THREE.Group();
scene.add(accentGroup);

var matKnot = new THREE.MeshStandardMaterial({
  color: 0x7c7cff, roughness: 0.12, metalness: 0.7,
  emissive: 0x3a10a0, emissiveIntensity: 0.55,
});
var matGlass = new THREE.MeshPhysicalMaterial({
  color: 0xa855f7, roughness: 0.05, metalness: 0.0,
  transmission: 0.88, thickness: 1.0, transparent: true, opacity: 0.90,
  clearcoat: 1.0, ior: 1.5, emissive: 0x3a0060, emissiveIntensity: 0.3,
});
var matCyan = new THREE.MeshStandardMaterial({
  color: 0x22d3ee, roughness: 0.2, metalness: 0.5,
  emissive: 0x005566, emissiveIntensity: 0.6,
});

// Main torus knot — right side background
var knot = new THREE.Mesh(new THREE.TorusKnotGeometry(2.8, 0.75, 180, 24, 2, 3), matKnot);
knot.position.set(9, 1, -6);
accentGroup.add(knot);

var knotWireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 });
var knotWire = new THREE.Mesh(new THREE.TorusKnotGeometry(2.95, 0.75, 90, 16, 2, 3), knotWireMat);
knotWire.position.copy(knot.position);
accentGroup.add(knotWire);

// Glass icosahedron — left
var ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 2), matGlass);
ico.position.set(-10, 3, -5);
accentGroup.add(ico);

// Cyan octahedron
var octa = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 1), matCyan);
octa.position.set(11, -5, -4);
accentGroup.add(octa);

// Orbit rings around ico
var ringMat1 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending });
var ring = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.1, 12, 60), ringMat1);
ring.position.copy(ico.position);
ring.rotation.x = Math.PI / 3;
accentGroup.add(ring);

var ringMat2 = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
var ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.07, 12, 60), ringMat2);
ring2.position.copy(ico.position);
ring2.rotation.x = Math.PI / 5;
ring2.rotation.y = Math.PI / 4;
accentGroup.add(ring2);

// ── STARS ──────────────────────────────────────────────────────────────
var starCount = isMobile ? 600 : 1600;
var starGeo   = new THREE.BufferGeometry();
var starPos   = new Float32Array(starCount * 3);
var starCol   = new Float32Array(starCount * 3);
var starPalette = [[0.48,0.48,1.0],[0.66,0.33,0.97],[0.13,0.83,0.93],[1.0,1.0,1.0]];

for (var si = 0; si < starCount; si++) {
  starPos[si*3]   = (Math.random()-0.5)*100;
  starPos[si*3+1] = (Math.random()-0.5)*60;
  starPos[si*3+2] = (Math.random()-0.5)*80 - 8;
  var sc = starPalette[Math.floor(Math.random()*starPalette.length)];
  starCol[si*3]=sc[0]; starCol[si*3+1]=sc[1]; starCol[si*3+2]=sc[2];
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));

var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
  size: 0.07, vertexColors: true, transparent: true, opacity: 0.65,
  blending: THREE.AdditiveBlending, depthWrite: false,
}));
scene.add(stars);

// ── STATE ──────────────────────────────────────────────────────────────
var time      = 0;
var scrollOff = 0;
var mouseX    = 0, mouseY = 0, targetX = 0, targetY = 0;
var rafId     = null;
var paused    = false;

window.addEventListener('scroll', function () {
  scrollOff = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
  document.body.classList.toggle('is-breaking', scrollOff > 0.05);
  document.body.style.setProperty('--break', scrollOff.toFixed(3));
}, { passive: true });

window.addEventListener('mousemove', function (e) {
  targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
  targetY = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

window.addEventListener('touchmove', function (e) {
  if (!e.touches[0]) return;
  targetX = (e.touches[0].clientX / window.innerWidth  - 0.5) * 2;
  targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

document.addEventListener('visibilitychange', function () {
  paused = document.hidden;
  if (!paused && !rafId) loop();
});

// Loading counter
var pct = 0;
var pctItv = setInterval(function () {
  pct = Math.min(100, pct + (pct < 60 ? 9 : pct < 85 ? 4 : 2));
  if (loaderPct) loaderPct.textContent = pct;
  if (pct >= 100) clearInterval(pctItv);
}, 80);

// ── ANIMATION LOOP ─────────────────────────────────────────────────────
function loop() {
  rafId = requestAnimationFrame(loop);
  if (paused) return;
  time += 0.010;

  mouseX += (targetX - mouseX) * 0.08;
  mouseY += (targetY - mouseY) * 0.08;

  var sp = Math.min(1, scrollOff * 2.5);

  // ── Animate particle wave ──
  var posAttr   = waveGeo.attributes.position;
  var colorAttr = waveGeo.attributes.color;

  for (var i = 0; i < COLS; i++) {
    for (var j = 0; j < ROWS; j++) {
      var idx = i * ROWS + j;
      var nx  = (i / (COLS - 1)) * 2 - 1;
      var ny  = (j / (ROWS - 1)) * 2 - 1;
      var dist = Math.sqrt(nx * nx + ny * ny);

      var wave1 = Math.sin(nx * 3.5 + time * 1.2) * Math.cos(ny * 2.8 + time * 0.9);
      var wave2 = Math.sin((nx + ny) * 2.5 + time * 0.7) * 0.5;
      var wave3 = Math.cos(dist * 5 - time * 1.5) * 0.5;

      var mx = nx * SPREAD_X * 0.5 - mouseX * 8;
      var my = ny * SPREAD_Y * 0.5 - mouseY * 4;
      var md = Math.sqrt(mx*mx + my*my);
      var mouseRepel = Math.max(0, 1 - md / 12) * 1.2;

      var waveAmp   = 1.8 + sp * 2.8;
      var vortexAmt = sp * sp;
      var angle     = Math.atan2(ny, nx);
      var vortexZ   = Math.sin(angle * 3 - time * 2 + dist * 4) * vortexAmt * 3.5;

      var z = (wave1 + wave2 + wave3) * waveAmp + mouseRepel + vortexZ;
      posAttr.setZ(idx, z);

      var r, g, b;
      if (sp < 0.3) {
        r = 0.35 + (dist % 1) * 0.35;
        g = 0.20 + Math.abs(wave1) * 0.25;
        b = 0.90 + Math.abs(wave2) * 0.10;
      } else {
        r = 0.2 + vortexAmt * 0.6;
        g = 0.6 - vortexAmt * 0.4 + Math.abs(wave3) * 0.3;
        b = 0.95 - vortexAmt * 0.3;
      }
      colorAttr.setXYZ(idx, r, g, b);
    }
  }
  posAttr.needsUpdate   = true;
  colorAttr.needsUpdate = true;

  // Update line positions
  var linePos = lineSegments.geometry.attributes.position;
  var li2 = 0;
  for (var i2 = 0; i2 < COLS; i2++) {
    for (var j2 = 0; j2 < ROWS; j2++) {
      var idx2 = i2 * ROWS + j2;
      var px = posAttr.getX(idx2), py = posAttr.getY(idx2), pz = posAttr.getZ(idx2);
      if (i2 < COLS - 1) {
        var ni = (i2+1)*ROWS+j2;
        linePos.setXYZ(li2*2,   px, py, pz);
        linePos.setXYZ(li2*2+1, posAttr.getX(ni), posAttr.getY(ni), posAttr.getZ(ni));
        li2++;
      }
      if (j2 < ROWS - 1) {
        var nj = i2*ROWS+j2+1;
        linePos.setXYZ(li2*2,   px, py, pz);
        linePos.setXYZ(li2*2+1, posAttr.getX(nj), posAttr.getY(nj), posAttr.getZ(nj));
        li2++;
      }
    }
  }
  linePos.needsUpdate = true;

  waveMat.opacity = 0.78 + Math.sin(time * 1.1) * 0.12 + sp * 0.15;
  lineMat.opacity = (isMobile ? 0.06 : 0.10) + sp * 0.12;

  wavePoints.rotation.z   = mouseX * 0.04 + time * 0.012 + sp * 0.3;
  lineSegments.rotation.z = wavePoints.rotation.z;
  wavePoints.position.y   = mouseY * 1.5 - sp * 3;
  lineSegments.position.y = wavePoints.position.y;
  wavePoints.position.z   = -2 - sp * 4;
  lineSegments.position.z = wavePoints.position.z;

  // 3D accents
  knot.rotation.y = time * 0.28 + mouseX * 0.4 + sp * Math.PI;
  knot.rotation.x = Math.sin(time * 0.22) * 0.18 + mouseY * 0.15;
  knot.rotation.z = time * 0.10;
  knot.position.y = 1 + Math.sin(time * 0.7) * 0.35;
  var kS = 1.0 + sp * 0.2;
  knot.scale.setScalar(kS);
  knotWire.rotation.copy(knot.rotation);
  knotWire.position.copy(knot.position);
  knotWire.scale.copy(knot.scale);
  matKnot.emissiveIntensity = 0.45 + Math.sin(time * 2.0) * 0.2;

  ico.rotation.y = -time * 0.35;
  ico.rotation.x =  time * 0.18;
  ico.position.y =  3 + Math.sin(time * 0.6 + 1) * 0.25;
  ico.position.z = -5 - sp * 2;
  ring.rotation.z  = time * 0.6;
  ring.position.copy(ico.position);
  ring2.rotation.z = -time * 0.45;
  ring2.rotation.y =  time * 0.2;
  ring2.position.copy(ico.position);

  octa.rotation.y  = time * 0.45;
  octa.rotation.x  = time * 0.28;
  octa.position.y  = -5 + Math.sin(time * 0.55 + 2) * 0.3;
  octa.position.z  = -4 - sp * 1.5;

  accent1.intensity  = 75 + Math.sin(time * 0.9) * 20;
  accent2.intensity  = 55 + Math.cos(time * 0.75) * 15;
  accent3.intensity  = 40 + Math.sin(time * 1.1) * 12;
  accent1.position.x = -10 + Math.sin(time * 0.4) * 3;
  accent2.position.x =  10 + Math.cos(time * 0.35) * 3;

  stars.rotation.y = time * 0.005 + mouseX * 0.05;
  stars.rotation.x = mouseY * 0.02;
  stars.position.y = -sp * 3;

  // Camera
  var camX = mouseX * 1.2;
  var camY = mouseY * 0.7 + sp * 2;
  var camZ = 22 - sp * 7;
  camera.position.x += (camX - camera.position.x) * 0.06;
  camera.position.y += (camY - camera.position.y) * 0.06;
  camera.position.z += (camZ - camera.position.z) * 0.06;
  camera.lookAt(mouseX * 0.4, -sp * 1.5, -sp);

  renderer.render(scene, camera);
}
loop();

window.__hero3D = { scene: scene, camera: camera, renderer: renderer, wavePoints: wavePoints };

})();
