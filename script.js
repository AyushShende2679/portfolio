// === ENHANCED CAROUSEL — supports multiple phone-frames + 6 images (Splitmate) ===
(function(){
  const frames = document.querySelectorAll('.phone-frame');
  if(frames.length===0){
    // fallback for single old layout
    const images = document.querySelectorAll(".carousel-image");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const dots = document.querySelectorAll(".dot");
    let current = 0;
    function updateCarousel(){
      if (images.length===0) return;
      images.forEach(img => img.classList.add("hidden"));
      images[current].classList.remove("hidden");
      dots.forEach(dot => dot.classList.remove("active"));
      if(dots[current]) dots[current].classList.add("active");
    }
    if(prev) prev.onclick=()=>{ current=(current-1+images.length)%images.length; updateCarousel(); };
    if(next) next.onclick=()=>{ current=(current+1)%images.length; updateCarousel(); };
    dots.forEach((dot,index)=> dot.onclick=()=>{ current=index; updateCarousel(); });
    return;
  }
  frames.forEach(frame=>{
    const images = frame.querySelectorAll('.carousel-image');
    const prev = frame.querySelector('.prev');
    const next = frame.querySelector('.next');
    const dots = frame.querySelectorAll('.dot');
    let current = 0;
    function update(){
      images.forEach(img=>img.classList.add('hidden'));
      if(images[current]) images[current].classList.remove('hidden');
      dots.forEach(d=>d.classList.remove('active'));
      if(dots[current]) dots[current].classList.add('active');
    }
    if(prev) prev.addEventListener('click', ()=>{ current=(current-1+images.length)%images.length; update(); });
    if(next) next.addEventListener('click', ()=>{ current=(current+1)%images.length; update(); });
    dots.forEach((dot,i)=> dot.addEventListener('click', ()=>{ current=i; update(); }));
    // autoplay subtle
    let auto = setInterval(()=>{ current=(current+1)%images.length; update(); }, 4200);
    frame.addEventListener('mouseenter', ()=> clearInterval(auto));
    frame.addEventListener('mouseleave', ()=>{ auto=setInterval(()=>{ current=(current+1)%images.length; update(); }, 4200); });
    // swipe
    let sx=0;
    frame.addEventListener('touchstart', e=> sx=e.touches[0].clientX, {passive:true});
    frame.addEventListener('touchend', e=>{
      const dx=e.changedTouches[0].clientX - sx;
      if(Math.abs(dx)>40){ current = dx<0 ? (current+1)%images.length : (current-1+images.length)%images.length; update(); }
    });
  });
})();

// === HERO TYPING — developer vibe ===
(function(){
  const el=document.getElementById('hero-role');
  if(!el) return;
  const roles=[
    'Systems & Backend Engineer',
    'Java • Spring Boot • C++17',
    'Offline-First • Encryption • DPI',
    'Flutter • Firestore • Kafka'
  ];
  let ri=0, ci=0, del=false, txt='';
  function tick(){
    const full=roles[ri];
    if(!del){ txt=full.slice(0,ci+1); ci++; if(ci===full.length){ del=true; setTimeout(tick,1600); return; } }
    else { txt=full.slice(0,ci-1); ci--; if(ci===0){ del=false; ri=(ri+1)%roles.length; } }
    el.textContent=txt;
    setTimeout(tick, del? 32: 78);
  }
  // start after preloader
  setTimeout(tick, 2600);
})();

// === FLOAT CARDS — dynamic interactivity (4 cards) ===
(function(){
  const wrap = document.getElementById('hero-3d-wrap');
  const cards = document.querySelectorAll('.float-card');
  if(!wrap || cards.length===0) return;

  // tilt + magnetic hover + click scroll
  cards.forEach(card=>{
    // pause float animation on hover for precise tilt
    card.addEventListener('mouseenter', ()=> card.style.animationPlayState='paused');
    card.addEventListener('mouseleave', ()=> {
      card.style.animationPlayState='running';
      card.style.transform='';
    });
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width/2, cy = r.height/2;
      const rx = ((y - cy)/cy) * -7;
      const ry = ((x - cx)/cx) * 7;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px) scale(1.03)`;
      card.style.setProperty('--mouse-x', x+'px');
      card.style.setProperty('--mouse-y', y+'px');
    });
    card.addEventListener('click', ()=>{
      const target = card.getAttribute('data-link');
      if(target){
        const el = document.querySelector(target);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        // pulse
        card.style.boxShadow = '0 0 28px rgba(124,124,255,0.45)';
        setTimeout(()=> card.style.boxShadow='', 420);
      }
    });
  });

  // magnetic pull within wrap — subtle parallax for cards based on wrap mouse
  wrap.addEventListener('mousemove', (e)=>{
    const r = wrap.getBoundingClientRect();
    const nx = (e.clientX - r.left)/r.width - 0.5;
    const ny = (e.clientY - r.top)/r.height - 0.5;
    cards.forEach((card,i)=>{
      if(card.matches(':hover')) return; // tilt handles hover
      card.style.animationPlayState='paused';
      const depth = (i+1)*0.55;
      card.style.transform = `translate3d(${nx*depth*7}px, ${ny*depth*7}px, 0)`;
    });
  });
  wrap.addEventListener('mouseleave', ()=>{
    cards.forEach(c=> {
      if(!c.matches(':hover')) {
        c.style.transform='';
        c.style.animationPlayState='running';
      }
    });
  });

  // live DPI counter — dynamic
  const dpiEl = document.getElementById('dpi-counter');
  if(dpiEl){
    let n = 44;
    setInterval(()=>{
      n += Math.floor(Math.random()*3);
      if(n>92) n=44;
      dpiEl.textContent = n;
      dpiEl.style.color = 'var(--success)';
      setTimeout(()=> dpiEl.style.color='', 220);
    }, 1800);
  }

  // sequential highlight pulse — makes cards feel alive even without hover
  let hi = 0;
  setInterval(()=>{
    const c = cards[hi % cards.length];
    c.style.borderColor = 'rgba(124,124,255,0.42)';
    c.style.boxShadow = '0 12px 36px rgba(124,124,255,0.20)';
    setTimeout(()=>{
      c.style.borderColor='';
      c.style.boxShadow='';
    }, 700);
    hi++;
  }, 2200);

  // RANDOM FLOAT inside box — cards drift to random positions (desktop only)
  const isMobileRand = window.innerWidth < 769;
  if(!isMobileRand){
    function boundsFor(card){
      const wr = wrap.getBoundingClientRect();
      const cr = card.getBoundingClientRect();
      const pad = 12;
      const hintH = 34; // keep clear of hint
      const maxX = Math.max(0, wr.width - cr.width - pad*2);
      const maxY = Math.max(0, wr.height - cr.height - pad*2 - hintH);
      return { maxX, maxY, pad };
    }
    function moveToRandom(card){
      const b = boundsFor(card);
      let x, y, tries=0;
      // try to avoid overlap with other cards
      do{
        x = b.pad + Math.random()*b.maxX;
        y = b.pad + Math.random()*b.maxY;
        tries++;
        let overlap=false;
        for(const other of cards){
          if(other===card) continue;
          const ox = parseFloat(other.style.left) || 0;
          const oy = parseFloat(other.style.top) || 0;
          // if other not yet placed, skip
          if(!other.style.left) continue;
          const dx = x - ox, dy = y - oy;
          if(Math.hypot(dx,dy) < 145) { overlap=true; break; }
        }
        if(!overlap) break;
      } while(tries<12);
      card.style.right='auto';
      card.style.bottom='auto';
      card.style.left = x.toFixed(1)+'px';
      card.style.top = y.toFixed(1)+'px';
    }
    // initial spread + interval
    setTimeout(()=>{
      cards.forEach((c,i)=>{
        setTimeout(()=> moveToRandom(c), i*280);
        const interval = 3600 + Math.random()*2600; // 3.6-6.2s per card, desynced
        setInterval(()=>{
          if(c.matches(':hover')) return;
          if(document.hidden) return;
          // pause float briefly for smooth left/top glide
          moveToRandom(c);
        }, interval);
      });
    }, 700);
    window.addEventListener('resize', ()=>{
      // re-randomize on resize
      cards.forEach(c=> moveToRandom(c));
    });
  }

  // touch: tap cycles highlight
  wrap.addEventListener('touchstart', ()=>{}, {passive:true});
})();


const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navbar = document.getElementById("navbar");

if(hamburger && navLinks){
  const toggleMenu=()=>{
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("no-scroll", navLinks.classList.contains("active"));
  };
  hamburger.addEventListener("click", toggleMenu);
  hamburger.addEventListener("keydown", (e)=>{ if(e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleMenu(); } });
}


document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    if(hamburger) hamburger.classList.remove("active");
    if(navLinks) navLinks.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
  const aiW = document.getElementById('ai-widget');
  if (aiW) aiW.classList.toggle('scrolled', window.scrollY > 90);
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach(card => {
  observer.observe(card);
});

const sections = document.querySelectorAll("section");
const body = document.body;

const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        body.setAttribute("data-section", entry.target.id);
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => {
  scrollObserver.observe(section);
});


const tiltCards = document.querySelectorAll('.skill-card, .contact-card, .project-info');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  });
});

const canvas = document.getElementById('liquid-canvas');
let gl = null;
try {
  // Perf guard: disable heavy fluid on mobile / low-memory / prefers-reduced-motion
  const isMobileFluid = /iPhone|iPad|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobileFluid || prefersReduced) {
    if (canvas) { canvas.style.display='none'; canvas.style.opacity='0'; }
    console.log('[liquid] disabled for perf (mobile/reduced-motion)');
  } else {
    gl = canvas.getContext('webgl');
    if(!gl) throw new Error('no gl');
  }
} catch(e){
  console.warn('[liquid] init failed', e);
  if(canvas) canvas.style.display='none';
}
if(!gl){
// graceful no-op: create stubs so rest of script doesn't crash
// skip fluid simulation entirely
} else {

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const config = {
    TEXTURE_DOWNSAMPLE: 1,
    DENSITY_DISSIPATION: 0.98, 
    VELOCITY_DISSIPATION: 0.99,
    PRESSURE_DISSIPATION: 0.8,
    PRESSURE_ITERATIONS: 25,
    CURL: 30, 
    SPLAT_RADIUS: 0.005
};

let pointers = [];
let splatStack = [];

const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;


const baseVertexShader = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;


const clearShader = `
    precision mediump float;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main() {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`;


const splatShader = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    void main() {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
`;


const advectionShader = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform float dt;
    uniform float dissipation;
    void main() {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
    }
`;

const divergenceShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main() {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
`;

const curlShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main() {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
`;


const vorticityShader = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main() {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
    }
`;


const pressureShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
`;

const gradientSubtractShader = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main() {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
`;


function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
}

function createProgram(vsSource, fsSource) {
    const program = gl.createProgram();
    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }
    return program;
}

let texelSize = { x: 1 / width, y: 1 / height };

const clearProgram = createProgram(baseVertexShader, clearShader);
const splatProgram = createProgram(baseVertexShader, splatShader);
const advectionProgram = createProgram(baseVertexShader, advectionShader);
const divergenceProgram = createProgram(baseVertexShader, divergenceShader);
const curlProgram = createProgram(baseVertexShader, curlShader);
const vorticityProgram = createProgram(baseVertexShader, vorticityShader);
const pressureProgram = createProgram(baseVertexShader, pressureShader);
const gradSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader);

function createFBO(w, h) {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.HALF_FLOAT_OES, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    
    return { texture, fbo, width: w, height: h, attach(id) { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; } };
}


let density = createFBO(width, height);
let velocity = createFBO(width, height);
let divergence = createFBO(width, height);
let curl = createFBO(width, height);
let pressure = createFBO(width, height);


const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    return (dest) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, dest ? dest.fbo : null);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }
})();


let lastTime = Date.now();
function update() {
    const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
    lastTime = Date.now();
    
    
    gl.useProgram(advectionProgram);
    gl.uniform1f(gl.getUniformLocation(advectionProgram, 'dt'), dt);
    gl.uniform1f(gl.getUniformLocation(advectionProgram, 'dissipation'), config.VELOCITY_DISSIPATION);
    velocity.attach(0);
    gl.uniform1i(gl.getUniformLocation(advectionProgram, 'uVelocity'), 0);
    gl.uniform1i(gl.getUniformLocation(advectionProgram, 'uSource'), 0);
    blit(velocity); 

    gl.useProgram(advectionProgram);
    gl.uniform1f(gl.getUniformLocation(advectionProgram, 'dissipation'), config.DENSITY_DISSIPATION);
    velocity.attach(0);
    density.attach(1);
    gl.uniform1i(gl.getUniformLocation(advectionProgram, 'uVelocity'), 0);
    gl.uniform1i(gl.getUniformLocation(advectionProgram, 'uSource'), 1);
    blit(density);

   
    if (pointers.length > 0) {
        gl.useProgram(splatProgram);
        gl.uniform1i(gl.getUniformLocation(splatProgram, 'uTarget'), 0);
        gl.uniform1f(gl.getUniformLocation(splatProgram, 'aspectRatio'), canvas.width / canvas.height);
        
        for (let i = 0; i < pointers.length; i++) {
            const p = pointers[i];
            velocity.attach(0);
            gl.uniform2f(gl.getUniformLocation(splatProgram, 'point'), p.x, p.y);
            gl.uniform3f(gl.getUniformLocation(splatProgram, 'color'), p.dx * 10, p.dy * 10, 1.0); 
            gl.uniform1f(gl.getUniformLocation(splatProgram, 'radius'), config.SPLAT_RADIUS);
            blit(velocity);
            
            density.attach(0);
           
            gl.uniform3f(gl.getUniformLocation(splatProgram, 'color'), 0.2, 0.2, 1.0); 
            blit(density);
        }
        pointers = []; 
    }

   
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    density.attach(0);
    gl.useProgram(clearProgram); 
    gl.uniform1i(gl.getUniformLocation(clearProgram, 'uTexture'), 0);
    gl.uniform1f(gl.getUniformLocation(clearProgram, 'value'), 1.0);
    blit(null);

    requestAnimationFrame(update);
}

if(canvas) canvas.addEventListener('mousemove', e => {
    pointers.push({
        x: e.clientX / canvas.width,
        y: 1.0 - e.clientY / canvas.height, 
        dx: e.movementX,
        dy: -e.movementY
    });
});

update();
} // end fluid guard — hero-3d handles its own canvas


const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

if (window.matchMedia("(pointer: fine)").matches) {

  window.addEventListener("mousemove", function (e) {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 180, fill: "forwards" }); 
  }); 

  const interactiveElements = document.querySelectorAll("a, button, .nav, .project-card, input, textarea");

  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("hovering");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const navbar = document.getElementById("navbar");
  const particleContainer = document.getElementById("loader-particles");
  

  document.body.classList.add("no-scroll");

  const particleCount = 30; 

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    
    const size = Math.random() * 5 + 2 + "px"; 
    const left = Math.random() * 100 + "%";
    const duration = Math.random() * 2 + 2 + "s"; 
    const delay = Math.random() * 2 + "s";
    
    particle.style.width = size;
    particle.style.height = size;
    particle.style.left = left;
    particle.style.animationDuration = duration;
    particle.style.animationDelay = delay;
    
    particleContainer.appendChild(particle);
  }


  setTimeout(() => {
  
    preloader.classList.add("fade-out");
    
   
    document.body.classList.remove("no-scroll");
    
    navbar.classList.remove("nav-hidden");

  
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 800);

  }, 2300);
});