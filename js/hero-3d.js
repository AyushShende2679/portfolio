// hero-3d.js — Immersive Spline-inspired Three.js hero
// Stack: Three.js vanilla (importmap) — lightweight, high performance
// Features: Spline-like soft clay materials, scroll-driven camera, mouse parallax, DPR-aware, WebGL fallback

import * as THREE from 'three';

const canvas = document.getElementById('hero-3d-canvas');
const wrap = document.getElementById('hero-3d-wrap');
const fallback = document.getElementById('webgl-fallback');
const preloaderPct = document.getElementById('loader-pct');

// WebGL support check
function isWebGLAvailable() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch { return false; }
}
if (!isWebGLAvailable() || !canvas) {
  if (canvas) canvas.style.display = 'none';
  if (fallback) fallback.style.display = 'block';
  console.warn('[hero-3d] WebGL not available — showing fallback');
} else {

const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
const DPR = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.7);

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x050507, 6, 14);

// Camera
const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
camera.position.set(0, 0.2, 6.2);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(DPR);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
if (!isMobile) renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// Sizes — hero-visual wrap size or full hero on mobile
function getSize() {
  if (wrap) {
    const r = wrap.getBoundingClientRect();
    if (r.width > 50 && r.height > 50) return { w: r.width, h: r.height };
  }
  return { w: window.innerWidth, h: window.innerHeight };
}
function resize() {
  const { w, h } = getSize();
  const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.7);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();

// Lighting — Spline-like soft studio
const ambient = new THREE.AmbientLight(0x7c7cff, 0.55);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(3, 4, 5);
scene.add(dir);
const point1 = new THREE.PointLight(0x7c7cff, 18, 12);
point1.position.set(-2.5, 1.2, 2);
scene.add(point1);
const point2 = new THREE.PointLight(0xa78bfa, 12, 10);
point2.position.set(2.2, -1, 1.5);
scene.add(point2);
const hemi = new THREE.HemisphereLight(0x7c7cff, 0x050507, 0.65);
scene.add(hemi);

// Helpers — gradient floor (subtle grid)
const grid = new THREE.GridHelper(20, 20, 0x22223a, 0x1a1a2e);
grid.position.y = -2.2;
grid.material.opacity = isMobile ? 0.10 : 0.16;
grid.material.transparent = true;
scene.add(grid);

// Materials — Spline clay
const matPrimary = new THREE.MeshStandardMaterial({
  color: 0x8b8bff,
  roughness: 0.28,
  metalness: 0.12,
  emissive: 0x1a1a3a,
  emissiveIntensity: 0.18,
});
const matSecondary = new THREE.MeshStandardMaterial({
  color: 0xa5b4fc,
  roughness: 0.35,
  metalness: 0.08,
  emissive: 0x151530,
  emissiveIntensity: 0.15,
});
const matGlass = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  roughness: 0.12,
  metalness: 0.0,
  transmission: 0.72,
  thickness: 0.5,
  transparent: true,
  opacity: 0.82,
  clearcoat: 1,
  clearcoatRoughness: 0.15,
});
const matWire = new THREE.MeshStandardMaterial({
  color: 0x7c7cff,
  wireframe: true,
  transparent: true,
  opacity: 0.28,
});

// Group for parallax
const heroGroup = new THREE.Group();
scene.add(heroGroup);

// Main shapes — Spline-like composition — decluttered: smaller, pushed right to avoid text overlap
const knotGeo = new THREE.TorusKnotGeometry(0.82, 0.24, 96, 16);
const knot = new THREE.Mesh(knotGeo, matPrimary);
knot.position.set(0.85, 0.10, 0);
heroGroup.add(knot);

const icoGeo = new THREE.IcosahedronGeometry(0.44, 2);
const ico = new THREE.Mesh(icoGeo, matGlass);
ico.position.set(1.35, 0.45, -0.5);
heroGroup.add(ico);

const icoWire = new THREE.Mesh(new THREE.IcosahedronGeometry(0.47, 1), matWire);
icoWire.position.copy(ico.position);
heroGroup.add(icoWire);

// Small floating torus (developer accent) — more subtle
const torusSmall = new THREE.Mesh(new THREE.TorusGeometry(0.30, 0.09, 16, 32), matSecondary);
torusSmall.position.set(-1.15, -0.55, 0.2);
torusSmall.rotation.x = 0.6;
heroGroup.add(torusSmall);

// Tiny spheres — code particles (like { } floating)
const sphereGeo = new THREE.SphereGeometry(0.09, 16, 16);
const sphereMat = new THREE.MeshStandardMaterial({ color: 0x7ee081, emissive: 0x1a3a1a, emissiveIntensity: 0.4, roughness: 0.4 });
for (let i=0;i< (isMobile?4:7); i++) {
  const s = new THREE.Mesh(sphereGeo, sphereMat.clone());
  const ang = (i/7)*Math.PI*2;
  const r = 1.6 + Math.random()*0.6;
  s.position.set(Math.cos(ang)*r*0.6, Math.sin(ang)*r*0.35 + (Math.random()-0.5)*0.6, (Math.random()-0.5)*1.2);
  s.userData = { baseY: s.position.y, phase: Math.random()*Math.PI*2, speed: 0.7+Math.random()*0.6 };
  heroGroup.add(s);
}

// PARTICLES REMOVED FOR CHECK — KEEP STARS BG ONLY — UNCOMMENT TO RESTORE
/*
const pCount = isMobile ? 240 : 620;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(pCount*3);
const pVel = new Float32Array(pCount*3);
for (let i=0;i<pCount;i++) {
  pPos[i*3] = (Math.random()-0.5)*14;
  pPos[i*3+1] = (Math.random()-0.5)*8;
  pPos[i*3+2] = (Math.random()-0.5)*7 -1;
  pVel[i*3]   = (Math.random()-0.5)*0.025;
  pVel[i*3+1] = (Math.random()-0.5)*0.022 + 0.008;
  pVel[i*3+2] = (Math.random()-0.5)*0.018;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({
  color: 0x8b8bff,
  size: isMobile? 0.016:0.024,
  transparent: true,
  opacity: 0.38,
  sizeAttenuation: true,
  blending: THREE.AdditiveBlending,
});
const points = new THREE.Points(pGeo, pMat);
scene.add(points);
*/

// Code glyphs floating (DOM-like but in 3D via sprites)
const glyphGroup = new THREE.Group();
scene.add(glyphGroup);
function makeTextSprite(text, color='#7c7cff') {
  const c = document.createElement('canvas');
  c.width=256; c.height=128;
  const ctx=c.getContext('2d');
  ctx.fillStyle='transparent'; ctx.fillRect(0,0,256,128);
  ctx.font='600 42px JetBrains Mono, monospace';
  ctx.fillStyle=color; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowColor=color; ctx.shadowBlur=12;
  ctx.fillText(text,128,64);
  const tex=new THREE.CanvasTexture(c);
  tex.needsUpdate=true;
  const mat=new THREE.SpriteMaterial({ map: tex, transparent:true, opacity:0.9, blending: THREE.AdditiveBlending });
  const s=new THREE.Sprite(mat);
  s.scale.set(1.1,0.55,1);
  return s;
}
if (!isMobile) {
  const glyphs = [
    {t:'< />', x:-1.6, y:1.0, c:'#7c7cff'},
    {t:'0101', x:1.35, y:-0.95, c:'#a5b4fc'},
  ];
  glyphs.forEach(g=>{
    const sp=makeTextSprite(g.t, g.c);
    sp.position.set(g.x,g.y,0.6);
    sp.userData={ baseY: g.y, phase: Math.random()*6 };
    glyphGroup.add(sp);
  });
}

// State
let scrollOff = 0;
let mouseX=0, mouseY=0, targetX=0, targetY=0;
let rafId=null;
let paused=false;
let time=0;

// Scroll-driven — immersive camera + breaking background reaction (full page)
window.addEventListener('scroll', ()=>{
  const max = document.body.scrollHeight - window.innerHeight;
  scrollOff = max>0 ? window.scrollY / max : 0;
  const sHero = Math.min(1, Math.max(0, scrollOff*3.2));
  // breaking stays active after hero so background keeps reacting
  const isBreaking = scrollOff > 0.07;
  document.body.classList.toggle('is-breaking', isBreaking);
  document.body.style.setProperty('--break', scrollOff.toFixed(3));
  document.body.style.setProperty('--break-hero', sHero.toFixed(3));
}, {passive:true});

// Mouse parallax (in hero only, but we listen globally)
window.addEventListener('mousemove', (e)=>{
  const cx = (e.clientX / window.innerWidth -0.5)*2;
  const cy = (e.clientY / window.innerHeight -0.5)*2;
  targetX = cx;
  targetY = cy;
  // also feed liquid-canvas if exists via custom event? leave as is
}, {passive:true});

// Touch
window.addEventListener('touchmove', (e)=>{
  if (!e.touches[0]) return;
  targetX = (e.touches[0].clientX / window.innerWidth -0.5)*2;
  targetY = (e.touches[0].clientY / window.innerHeight -0.5)*2;
}, {passive:true});

// Visibility — keep particles alive for Experience→Projects (no pause on scroll)
const visObs = new IntersectionObserver((entries)=>{
  // intentionally keep rendering for background particles — only pause if tab hidden
  paused = document.hidden;
  if (!paused && !rafId) loop();
}, {threshold:0});
if (wrap) visObs.observe(wrap);
else visObs.observe(canvas);

document.addEventListener('visibilitychange', ()=>{
  paused = document.hidden;
  if (!paused && !rafId) loop();
});

window.addEventListener('resize', resize);

// Loading progress simulation (real 3D is instant, but we animate preloader pct)
let pct=0;
const pctItv=setInterval(()=>{
  pct=Math.min(100, pct+ (pct<60? 8: pct<85?4:2));
  if (preloaderPct) preloaderPct.textContent=pct;
  if(pct>=100) clearInterval(pctItv);
}, 90);

// Animation loop
function loop() {
  rafId = requestAnimationFrame(loop);
  if (paused) return;
  time += 0.014;

  // Smooth mouse — faster
  mouseX += (targetX - mouseX)*0.14;
  mouseY += (targetY - mouseY)*0.14;

  // Scroll rotation + camera dolly (immersive)
  // hero: scroll 0→0.25 controls hero, beyond that we settle
  const s = Math.min(1, Math.max(0, scrollOff*3.2)); // hero occupies ~30% of page

  // Knot — main hero object rotates with scroll — stays right
  knot.rotation.y = time*0.28 + s*Math.PI*1.1 + mouseX*0.45;
  knot.rotation.x = Math.sin(time*0.3)*0.15 + mouseY*0.18 - s*0.25;
  knot.rotation.z = s*0.35;
  knot.position.y = 0.10 + Math.sin(time*0.7)*0.08 - s*0.25;
  knot.position.x = 0.85 + mouseX*0.18 + s*0.15;
  // Scale — small at first, bigger as scroll down (like next page)
  const sc = 0.62 + scrollOff*0.62; // 0.62 at hero → 1.24 at bottom
  knot.scale.set(sc,sc,sc);

  // BREAKING reaction — full-page scroll (background keeps reacting, not static)
  {
    const breakI = Math.min(1, Math.max(0, (scrollOff - 0.06)/0.14));
    const sustain = 0.55 + Math.min(1, scrollOff*1.2)*0.45;
    const eff = breakI * sustain;
    if(eff > 0.02){
      const shake = Math.sin(time*18 + scrollOff*28) * 0.045 * eff;
      const shake2 = Math.cos(time*22 + scrollOff*22) * 0.032 * eff;
      knot.position.x += shake;
      knot.position.y += shake2*0.6;
      knot.rotation.z += shake*0.9;
      const shatter = 1 - eff*0.14 + Math.sin(time*12)*0.018*eff;
      knot.scale.multiplyScalar(shatter);
      // points removed — stars bg now handles particles
      grid.scale.x = 1 + eff*0.06;
      grid.material.opacity = 0.16 + eff*0.18;
      point1.intensity = 16 + Math.sin(time*14)*6*eff + eff*5;
      point2.intensity = 11 + Math.cos(time*12)*5*eff + eff*3;
      glyphGroup.children.forEach(sp=>{
        sp.position.x += (Math.random()-0.5)*0.012*eff;
      });
    }
  }

  // Ico cluster — small→big with scroll
  ico.rotation.y = -time*0.5 - s*0.8;
  ico.rotation.x = time*0.18;
  ico.position.y = 0.55 + Math.sin(time*0.9+1)*0.08 - s*0.2;
  icoWire.rotation.copy(ico.rotation);
  icoWire.position.copy(ico.position);
  const icoSc = 0.68 + scrollOff*0.58;
  ico.scale.set(icoSc,icoSc,icoSc);
  icoWire.scale.set(icoSc,icoSc,icoSc);

  torusSmall.rotation.y = time*0.6 + s*1.2;
  torusSmall.rotation.x = 0.6 + Math.sin(time*0.5)*0.3;
  torusSmall.position.y = -0.65 + Math.sin(time*0.8+2)*0.09;
  const torusSc = 0.72 + scrollOff*0.52;
  torusSmall.scale.set(torusSc,torusSc,torusSc);

  // Spheres float
  heroGroup.children.forEach(ch=>{
    if (ch.userData && ch.userData.baseY!==undefined && ch.geometry && ch.geometry.type==='SphereGeometry') {
      ch.position.y = ch.userData.baseY + Math.sin(time*ch.userData.speed + ch.userData.phase)*0.12;
      ch.rotation.y += 0.02;
    }
  });

  // Glyphs float
  glyphGroup.children.forEach(sp=>{
    if (sp.userData) sp.position.y = sp.userData.baseY + Math.sin(time*0.7 + sp.userData.phase)*0.07;
    sp.material.opacity = 0.75 + Math.sin(time+sp.userData.phase)*0.18;
  });

  // PARTICLES DRIFT REMOVED — keeping StarsCanvas only
  /*
  const pos = pGeo.attributes.position;
  const scrollDrift = scrollOff * 0.6;
  for(let i=0;i<pCount;i++){
    const ix=i*3, iy=i*3+1, iz=i*3+2;
    pos.array[ix] += pVel[ix] + (Math.random()-0.5)*0.003 + scrollDrift*0.004;
    pos.array[iy] += pVel[iy] + (Math.random()-0.5)*0.003;
    pos.array[iz] += pVel[iz] + (Math.random()-0.5)*0.002;
    if(pos.array[ix] > 7) pos.array[ix]= -7; if(pos.array[ix] < -7) pos.array[ix]= 7;
    if(pos.array[iy] > 4.2) pos.array[iy]= -4.2; if(pos.array[iy] < -4.2) pos.array[iy]= 4.2;
    if(pos.array[iz] > 3.5) pos.array[iz]= -3.5; if(pos.array[iz] < -3.5) pos.array[iz]= 3.5;
    if(Math.random()<0.015){
      pVel[ix] += (Math.random()-0.5)*0.004;
      pVel[iy] += (Math.random()-0.5)*0.004;
      pVel[iz] += (Math.random()-0.5)*0.004;
      pVel[ix]= Math.max(-0.03, Math.min(0.03, pVel[ix]));
      pVel[iy]= Math.max(-0.03, Math.min(0.03, pVel[iy]));
    }
  }
  pos.needsUpdate=true;
  points.rotation.y = time*0.014 + mouseX*0.06 + scrollOff*0.35;
  points.rotation.x = mouseY*0.03 + scrollOff*0.12;
  points.position.y = -scrollOff*0.45;
  points.position.z = -scrollOff*0.6;
  */

  // Grid — scrolls like next page
  grid.position.z = Math.sin(time*0.18)*0.15 - scrollOff*1.2;
  grid.position.y = -2.2 + scrollOff*0.85;
  grid.rotation.y = scrollOff*0.18;

  // Camera — moves completely through page (not hero-capped)
  const camX = mouseX*0.55;
  const camY = mouseY*0.24 + scrollOff*0.95;
  const camZ = 6.2 - scrollOff*2.6 + Math.sin(time*0.11)*0.05;
  camera.position.x += (camX - camera.position.x)*0.065;
  camera.position.y += (camY - camera.position.y)*0.065;
  camera.position.z += (camZ - camera.position.z)*0.065;
  camera.lookAt(0, -scrollOff*0.9, -scrollOff*0.5);

  // Point lights pulse (Spline glow)
  point1.intensity = 16 + Math.sin(time*0.9)*3;
  point2.intensity = 11 + Math.cos(time*0.7)*2.5;
  point1.position.x = -2.5 + Math.sin(time*0.4)*0.5;
  point2.position.x = 2.2 + Math.cos(time*0.35)*0.4;

  // Hero group overall parallax + small→big
  heroGroup.position.x = mouseX*0.18;
  heroGroup.position.y = mouseY*0.12;
  heroGroup.rotation.y = mouseX*0.12;
  heroGroup.rotation.x = -mouseY*0.08;
  const groupSc = 0.82 + scrollOff*0.38;
  heroGroup.scale.set(groupSc,groupSc,groupSc);

  renderer.render(scene, camera);
}
loop();

// Attempt to load Spline viewer if present — progressive enhancement
const splineEl = document.getElementById('spline-hero');
if (splineEl) {
  // Show spline after 1.2s as layer behind Three.js? We keep Three.js as main, spline as optional
  // If spline loads we can blend opacity. For now keep hidden to avoid double load cost.
  // User can enable by removing display:none in console: splineEl.style.display='block'
  splineEl.addEventListener('load', ()=>{
    console.log('[hero-3d] Spline loaded');
    // Optionally fade Three.js slightly
    // canvas.style.opacity='0.85';
  });
}

// Expose for debugging
window.__hero3D = { scene, camera, renderer, pause: ()=>paused=true, resume: ()=>{paused=false; loop();} };

} // end webgl check
