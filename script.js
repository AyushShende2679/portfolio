const images = document.querySelectorAll(".carousel-image");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const dots = document.querySelectorAll(".dot");

let current = 0;

function updateCarousel() {

  if (images.length === 0) return;

  images.forEach(img => img.classList.add("hidden"));
  images[current].classList.remove("hidden");
  
  dots.forEach(dot => dot.classList.remove("active"));
 
  if(dots[current]) {
    dots[current].classList.add("active");
  }
}


if (prev) {
  prev.onclick = () => {
    if (images.length > 0) {
      current = (current - 1 + images.length) % images.length;
      updateCarousel();
    }
  };
}

if (next) {
  next.onclick = () => {
    if (images.length > 0) {
      current = (current + 1) % images.length;
      updateCarousel();
    }
  };
}

dots.forEach((dot, index) => {
  dot.onclick = () => {
    current = index;
    updateCarousel();
  };
});


const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navbar = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});


document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
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
const gl = canvas.getContext('webgl');

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

canvas.addEventListener('mousemove', e => {
    pointers.push({
        x: e.clientX / canvas.width,
        y: 1.0 - e.clientY / canvas.height, 
        dx: e.movementX,
        dy: -e.movementY
    });
});

update();


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
    }, { duration: 500, fill: "forwards" }); 
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