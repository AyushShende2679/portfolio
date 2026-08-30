// stars-background.js — vanilla port of provided React StarBackground
// "use client" React code converted to vanilla Three.js for movement test
// Remove when user says — just comment <canvas id="stars-canvas"> and this script in index.html
import * as THREE from 'three';

const canvas = document.getElementById('stars-canvas');
if (!canvas) {
  console.warn('[stars] canvas not found');
} else {
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 769;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 1);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
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

  // maath/random inSphere — 5000 points, radius 1.2
  const COUNT = 5000;
  const positions = new Float32Array(COUNT * 3);
  const radius = 1.2;
  for (let i = 0; i < COUNT; i++) {
    // uniform in sphere
    let x, y, z, r2;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      r2 = x * x + y * y + z * z;
    } while (r2 > 1);
    // scale to radius with cubic root for uniform
    const r = Math.cbrt(Math.random()) * radius;
    const scale = r / Math.sqrt(r2);
    positions[i * 3] = x * scale;
    positions[i * 3 + 1] = y * scale;
    positions[i * 3 + 2] = z * scale;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.002,
    transparent: true,
    opacity: 0.92,
    sizeAttenuation: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.rotation.set(0, 0, Math.PI / 4);
  group.add(points);
  scene.add(group);

  let last = performance.now();
  let raf = null;
  let paused = false;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (paused || document.hidden) return;
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    group.rotation.x -= delta / 10;
    group.rotation.y -= delta / 15;
    const sc = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1);
    group.position.y = -sc * 0.12;
    group.rotation.z = Math.PI / 4 + sc * 0.08;
    // small→big with scroll (like next page)
    const sScale = 0.72 + sc * 0.52;
    group.scale.set(sScale, sScale, sScale);
    renderer.render(scene, camera);
  }
  frame(performance.now());

  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused && !raf) frame(performance.now());
  });

  // expose for removal
  window.__starsBG = { scene, camera, renderer, group, pause: () => (paused = true), resume: () => (paused = false) };
  console.log('[stars] 5000-point sphere active — comment canvas+script to remove');
}
