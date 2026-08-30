// stars-background.js — vanilla Three.js star field (uses global THREE)

(function() {

var starsCanvas = document.getElementById('stars-canvas');
if (!starsCanvas) {
  console.warn('[stars] canvas not found');
} else {
  var isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 769;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 1);

  const renderer = new THREE.WebGLRenderer({ canvas: starsCanvas, alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.6));
  renderer.setClearColor(0x000000, 0);

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  // 5000 points in a sphere
  const COUNT = isMobile ? 2000 : 5000;
  const positions = new Float32Array(COUNT * 3);
  const radius = 1.2;
  for (let i = 0; i < COUNT; i++) {
    let x, y, z, r2;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      r2 = x * x + y * y + z * z;
    } while (r2 > 1);
    const r = Math.cbrt(Math.random()) * radius;
    const scale = r / Math.sqrt(r2);
    positions[i * 3]     = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * scale;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.002,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const pts   = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.rotation.set(0, 0, Math.PI / 4);
  group.add(pts);
  scene.add(group);

  let last   = performance.now();
  let rafId2 = null;
  let paused2 = false;

  function frame(now) {
    rafId2 = requestAnimationFrame(frame);
    if (paused2 || document.hidden) return;
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    group.rotation.x -= delta / 10;
    group.rotation.y -= delta / 15;
    const sc = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    group.position.y = -sc * 0.12;
    group.rotation.z = Math.PI / 4 + sc * 0.08;
    const sScale = 0.72 + sc * 0.52;
    group.scale.set(sScale, sScale, sScale);
    renderer.render(scene, camera);
  }
  frame(performance.now());

  document.addEventListener('visibilitychange', () => {
    paused2 = document.hidden;
    if (!paused2 && !rafId2) frame(performance.now());
  });

  window.__starsBG = { scene, camera, renderer, group };
}

})(); // end IIFE
