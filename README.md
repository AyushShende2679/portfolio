# 🚀 Ayush Shende — Software Engineer Portfolio

![Portfolio Preview](images/ayush-photo.jpg) <!-- Optionally replace with a full screenshot of the hero section -->

A highly interactive, spatial, and weightless personal portfolio built using **HTML, CSS, JavaScript**, and **Three.js**. Designed with an "Antigravity" aesthetic, this portfolio features a custom WebGL 3D particle wave background, glassmorphism UI components, and a local offline AI assistant.

**🌐 Live Demo:** [https://ayushshende2679.github.io/portfolio/](https://ayushshende2679.github.io/portfolio/)

---

## ⚡ Key Features

- **Antigravity UI Design:** Immersive, spatial UI with floating isometric cards, deep shadows, and subtle glassmorphism that reacts to cursor movement.
- **WebGL 3D Hero Background:** A dynamic, scroll-reactive 3D particle wave and geometric meshes rendered via `Three.js`. Features magnetic parallax that tracks mouse movement.
- **Local AI Assistant:** An entirely client-side, offline "Ayush AI" chatbot that knows all about the projects, skills, and experience listed in the portfolio without needing any API calls.
- **Hardware-Accelerated Animations:** Buttery-smooth 60fps animations utilizing `requestAnimationFrame`, CSS 3D transforms, and passive event listeners.
- **Responsive Layout:** Perfectly scales from 4K desktop displays down to mobile devices, automatically adjusting 3D rendering parameters (DPR, particle count) for mobile performance.
- **Dynamic Preloader:** A lightweight, pure CSS glowing ring loader that guarantees a fast First Contentful Paint.

---

## 🛠️ Tech Stack

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **3D Graphics:** [Three.js](https://threejs.org/) (via CDN)
- **Icons:** [FontAwesome 6](https://fontawesome.com/)
- **Typography:** Inter, JetBrains Mono, Space Grotesk (Google Fonts)

---

## 📂 Project Structure

```text
📁 portfolio
├── 📄 index.html             # Main entry point and semantic structure
├── 📄 style.css              # Antigravity design system, animations, and responsive queries
├── 📄 script.js              # Core UI logic (IntersectionObservers, AI bot, typewriter, etc.)
├── 📁 js/
│   ├── 📄 hero-3d.js         # Three.js logic for the 3D particle wave and floating accents
│   └── 📄 ai-widget.js       # Logic for the local offline chatbot
├── 📁 images/                # Project thumbnails, avatars, and assets
└── 📄 Ayush_Shende_Resume.pdf # Downloadable resume
```

---

## 🚀 Running Locally

Because this project uses vanilla frontend technologies, there is no build step or node package installation required. 

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AyushShende2679/portfolio.git
   cd portfolio
   ```

2. **Serve the files:**
   You can open `index.html` directly in your browser, or use a local development server for the best experience (especially for CORS policies regarding local fonts/images):
   - Using VS Code: Install the **Live Server** extension and click "Go Live".
   - Using Python: 
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`

---

## 👨‍💻 About Me

I am a **Systems & Backend Engineer** specializing in Java, Spring Boot, C++17, and Flutter. I care deeply about idempotency, correctness, and measurable performance. 

- **LinkedIn:** [Ayush Shende](https://www.linkedin.com/in/ayush-shende-874b70292)
- **LeetCode:** [@uQUtgCde87](https://leetcode.com/u/uQUtgCde87)
- **Email:** ayushshende2679@gmail.com

---

> Crafted with ♥ • Systems thinking • Ship fast, verify with tests.
