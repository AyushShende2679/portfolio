// ai-widget.js — Predefined AI (No API) • Knows EVERYTHING about Ayush
// Rule-based intents + fuzzy scoring, runs 100% locally, offline

const AYUSH_KB = {
  bio: {
    name: "Ayush Shende",
    role: "Software Engineer — Systems / Backend / Mobile",
    location: "Nagpur, Maharashtra",
    college: "Jhulelal Institute of Technology — B.Tech CSE, 2024–2028",
    cgpa: "8.95/10",
    summary: "Computer Science undergrad (CGPA 8.95) building encryption-backed backends, high-performance C++ engines and offline-first mobile apps. Proficient in REST API design, relational DBs, Kafka, hybrid encryption. Seeking SDE internship.",
    available: "Open to Software Engineering Internship — Summer 2026 (Backend / Systems / Mobile)",
    email: "ayushshende2679@gmail.com",
    github: "https://github.com/AyushShende2679",
    linkedin: "https://www.linkedin.com/in/ayush-shende-874b70292",
    leetcode: "https://leetcode.com/u/uQUtgCde87",
    leetcodeSolved: "100+ problems — Arrays, Linked Lists, Binary Search, Sliding Window, Stacks, DP"
  },
  education: {
    institute: "Jhulelal Institute of Technology, Nagpur",
    degree: "Bachelor of Technology in Computer Science and Engineering",
    duration: "Aug 2024 – May 2028 (Expected)",
    cgpa: "8.95/10",
    relevant: "DSA, OOP, DBMS, Operating Systems, Computer Networks, System Design"
  },
  experience: {
    title: "JPMorgan Chase — Software Engineering Virtual Intern (Forage)",
    when: "Mar 2026 • Remote • Agile",
    points: [
      "Integrated Apache Kafka into Spring Boot microservice to consume & deserialize high-throughput financial transaction messages (configurable topic, embedded test broker).",
      "Transactional persistence with Spring Data JPA + H2 — entity models, relational schema, atomic balance updates.",
      "Exposed RESTful account-balance endpoint via Spring MVC, consumed external Incentive API (RestTemplate) to embed reward logic.",
      "Verified end-to-end with Maven unit test suites covering Kafka ingestion, JPA persistence, third-party API integration."
    ],
    stack: ["Spring Boot","Kafka","H2","JPA","RestTemplate","Maven","Agile"]
  },
  projects: {
    "upi-offline-mesh": {
      name: "UPI Offline Mesh",
      stack: ["Java 17","Spring Boot 3","RSA-OAEP","AES-256-GCM","JUnit 5","Docker","H2","JPA"],
      live: "https://upi-offline-mesh-ft9y.onrender.com/",
      github: "https://github.com/AyushShende2679/upi-offline-mesh",
      year: "2026",
      pitch: "Mesh-routed deferred UPI settlement — payments propagate through offline Bluetooth relay nodes and settle exactly once when any node regains connectivity.",
      details: [
        "Hybrid RSA-OAEP + AES-256-GCM: relays carry ciphertext they cannot decrypt/modify.",
        "Exactly-once via dual-layer: SHA-256 fingerprint + ConcurrentHashMap.putIfAbsent + DB unique-index guard; concurrent 3-thread duplicate test (1 SETTLED + 2 DUPLICATE_DROPPED).",
        "Tamper rejection via AES-GCM auth tag; freshness 24h check; @Transactional ledger.",
        "Dockerized, live on Render, 3 JUnit 5 tests (round-trip, tamper, concurrent)."
      ],
      limitations: "No offline double-spend protection across disconnected mesh pockets — first to settle wins (fundamental). Simulated BLE mesh, H2 mem DB (demo).",
      api: ["GET /api/server-key","GET /api/accounts","POST /api/bridge/ingest (production)"]
    },
    "dpi-engine": {
      name: "DPI Engine — Deep Packet Inspection System",
      stack: ["C++17","PCAP","TCP/IP","TLS SNI","Multithreading","Winsock2"],
      github: "https://github.com/AyushShende2679/DPI-System",
      year: "2026",
      pitch: "High-performance C++17 analyser that parses PCAP, decodes Ethernet/IPv4/TCP/UDP, extracts TLS SNI & HTTP Host for L7 app ID.",
      details: [
        "Stateful 5-tuple flow tracking + rule engine to block by app / domain pattern / IP → filtered output PCAP.",
        "Multi-threaded load-balancer + fast-path pipeline via thread-safe producer-consumer queue.",
        "Builds: dpi_simple.exe (single-thread) & dpi_engine.exe (multi: --lbs + --fps) via build.bat.",
        "Example: dpi_engine.exe test.pcap out.pcap --block-app YouTube --block-domain facebook --lbs 2 --fps 2 → 44 pkts, 36 forwarded, 8 dropped."
      ]
    },
    "splitmate": {
      name: "Splitmate — Expense Manager",
      stack: ["Flutter","Dart","Firebase Firestore","Firebase Auth","Hive","Riverpod"],
      github: "https://github.com/AyushShende2679/splitmate",
      year: "2025",
      pitch: "Cross-platform personal + group expense tracking — offline-first, SaaS-ready.",
      details: [
        "Real-time Firestore sync + group balance auto-calc & debt-splitting across multi-member groups.",
        "Monthly analytics, category breakdowns, on-demand PDF (NotoSans emoji-safe) via SharePlus; Firebase Auth + AppCheck (Play Integrity/DeviceCheck/ReCaptcha).",
        "Offline-first: Hive boxes (personal_expenses, group_expenses, budgets…), lastWriteWins via updatedAt, budgetsProvider live.",
        "Security: firestore.rules tenant isolation, composite indexes, budget validation 1-10M, 5/5 tests, analyze 11→2 issues, builds web+apk green."
      ]
    },
    "voiceflow": {
      name: "VoiceFlow — Multilingual Text-to-Speech, STT & Translator",
      stack: ["HTML","CSS","JavaScript","Node.js","Express","Google Translate API"],
      github: "https://github.com/AyushShende2679/VoiceFlow",
      live: "https://ayushshende2679.github.io/VoiceFlow/",
      backend: "https://voiceflow-30h7.onrender.com",
      year: "2025",
      pitch: "TTS that converts text to natural speech across languages, plus STT transcription and 10+ language translation + MP3 download.",
      details: [
        "Frontend GitHub Pages, backend Render (Node+Express, CORS).",
        "Pages: index.html (TTS), stt.html, translate.html; scripts: script_tts.js, script_stt.js, script_translate.js.",
        "Accessibility-focused: improves content consumption across languages."
      ]
    }
  },
  skills: {
    languages: ["C","C++17","Java","JavaScript","Dart","Python"],
    frameworks: ["Spring Boot","FastAPI","Flutter","Node.js","Express.js"],
    data: ["SQL","Firebase Firestore","SQLite","H2","Apache Kafka","REST APIs"],
    tools: ["Git","Docker","Maven","Agile","Unit Testing"],
    cs: ["OOP","DSA","DBMS","Operating Systems","Computer Networks"],
    concepts: ["Microservices","Scalable Systems","Hybrid Encryption","Idempotency","Network Protocols (TCP/IP, TLS, HTTP)","Multithreading"]
  },
  certs: [
    "Oracle AI Foundations Associate (2025)",
    "Google Gen AI Intensive — 5 Day (2025)",
    "NPTEL: Managerial Economics; CSR (2025)",
    "LeetCode 100+ — Arrays, Linked Lists, Binary Search, Sliding Window, Stacks, DP"
  ]
};

// Intents database
const INTENTS = [
  { id: 'greeting', kw: ['hi','hello','hey','hii','yo','sup','namaste','greetings'], ans: () => `Hey! I'm Ayush's AI — I know everything about him from his resume & projects. 😊<br><br>Ask me like:<br>• "Tell me about UPI Offline Mesh"<br>• "What are his skills?"<br>• "CGPA?"<br>• "Contact?"` },
  { id: 'who', kw: ['who is ayush','about ayush','about you','who are you','introduce','tell me about yourself'], ans: () => `<strong>${AYUSH_KB.bio.name}</strong> — ${AYUSH_KB.bio.role}<br>${AYUSH_KB.bio.college} • <strong>CGPA ${AYUSH_KB.bio.cgpa}</strong><br><br>${AYUSH_KB.bio.summary}<br><br><span class="ai-pill">${AYUSH_KB.bio.available}</span>` },
  { id: 'cgpa', kw: ['cgpa','gpa','percentage','grade','jit','college','education','university','nagpur','jhulelal','btech','semester'], ans: () => `<strong>Education</strong><br>${AYUSH_KB.education.institute}<br>${AYUSH_KB.education.degree}<br>${AYUSH_KB.education.duration} • <strong>CGPA: ${AYUSH_KB.education.cgpa}</strong><br><br><span class="mono">Relevant: ${AYUSH_KB.education.relevant}</span>` },
  { id: 'experience', kw: ['experience','jpmorgan','jpm','forage','intern','internship','kafka','incentive api'], ans: () => `<strong>${AYUSH_KB.experience.title}</strong><br><span class="mono">${AYUSH_KB.experience.when}</span><br><ul>${AYUSH_KB.experience.points.map(p=>`<li>${p}</li>`).join('')}</ul><br><div class="ai-tags">${AYUSH_KB.experience.stack.map(s=>`<span>${s}</span>`).join('')}</div>` },
  { id: 'skills', kw: ['skill','tech stack','stack','technology','technologies','language','framework','tool'], ans: () => `<strong>Tech Stack</strong><br><b>Languages:</b> ${AYUSH_KB.skills.languages.join(' • ')}<br><b>Frameworks:</b> ${AYUSH_KB.skills.frameworks.join(' • ')}<br><b>Data:</b> ${AYUSH_KB.skills.data.join(' • ')}<br><b>Tools:</b> ${AYUSH_KB.skills.tools.join(' • ')}<br><b>CS:</b> ${AYUSH_KB.skills.cs.join(' • ')}<br><b>Concepts:</b> ${AYUSH_KB.skills.concepts.join(' • ')}` },
  { id: 'upi', kw: ['upi','offline mesh','upi offline','mesh','hybrid encryption','rsa','aes','exactly once','idempotency','render'], ans: () => projectAnswer('upi-offline-mesh') },
  { id: 'dpi', kw: ['dpi','deep packet','pcap','sni','tls','packet inspection','c++','load balancer','fast path','winsock'], ans: () => projectAnswer('dpi-engine') },
  { id: 'splitmate', kw: ['splitmate','expense','flutter','split','group expense','hive','riverpod','pdf'], ans: () => projectAnswer('splitmate') },
  { id: 'voiceflow', kw: ['voiceflow','tts','stt','text to speech','speech to text','translator','translate'], ans: () => projectAnswer('voiceflow') },
  { id: 'projects', kw: ['project','projects','work','portfolio','built','github repos'], ans: () => `<strong>4 Featured Projects</strong><br>1. <b>UPI Offline Mesh</b> (2026) — Live: <a href="${AYUSH_KB.projects['upi-offline-mesh'].live}" target="_blank">Render</a> • <a href="${AYUSH_KB.projects['upi-offline-mesh'].github}" target="_blank">GitHub</a><br>2. <b>DPI Engine</b> (C++17, PCAP, TLS SNI)<br>3. <b>Splitmate</b> (Flutter, offline-first)<br>4. <b>VoiceFlow</b> (TTS/STT/Translator) — Live: <a href="${AYUSH_KB.projects['voiceflow'].live}" target="_blank">GitHub Pages</a><br><br>Ask "<em>Tell me about UPI Offline Mesh</em>" for details.` },
  { id: 'contact', kw: ['contact','email','mail','hire','reach','linkedin','github','leetcode','phone'], ans: () => `<strong>Let's Connect</strong><br>📧 <a href="mailto:${AYUSH_KB.bio.email}">${AYUSH_KB.bio.email}</a><br>🔗 <a href="${AYUSH_KB.bio.linkedin}" target="_blank">LinkedIn</a><br>💻 <a href="${AYUSH_KB.bio.github}" target="_blank">GitHub — AyushShende2679</a><br>🧩 <a href="${AYUSH_KB.bio.leetcode}" target="_blank">LeetCode — ${AYUSH_KB.bio.leetcodeSolved}</a><br><br><span class="mono">${AYUSH_KB.bio.available}</span>` },
  { id: 'certs', kw: ['cert','certificate','certification','oracle','google gen ai','nptel','leetcode','award'], ans: () => `<strong>Certifications & Profiles</strong><ul>${AYUSH_KB.certs.map(c=>`<li>${c}</li>`).join('')}</ul>` },
  { id: 'help', kw: ['help','what can you do','capabilities','options','suggest'], ans: () => `I can answer <strong>only about Ayush</strong> (no general chat). Try:<br>• "What is DPI Engine?"<br>• "Skills?"<br>• "CGPA & college?"<br>• "Experience at JPMorgan?"<br>• "How to contact?"<br>• "Tell me about Splitmate"` },
  { id: 'availability', kw: ['available','internship','hiring','job','opportunity','open to work','hire'], ans: () => `✅ <strong>${AYUSH_KB.bio.available}</strong><br>Prefers Backend / Systems / Mobile. Stack: Java • Spring Boot • C++17 • Flutter • Kafka • Docker.<br>Reach: <a href="mailto:${AYUSH_KB.bio.email}">${AYUSH_KB.bio.email}</a> • <a href="${AYUSH_KB.bio.linkedin}" target="_blank">LinkedIn</a>` },
  { id: 'resume', kw: ['resume','cv','download resume','pdf'], ans: () => `📄 Grab Ayush's resume: <a href="Ayush_Shende_Resume.pdf" target="_blank">Ayush_Shende_Resume.pdf</a> (also <span class="mono">Ayush_Shende_Resume(public).pdf</span>).<br>Summary: ${AYUSH_KB.bio.summary}` },
];

function projectAnswer(key){
  const p = AYUSH_KB.projects[key];
  if(!p) return 'Project not found. Try: UPI Offline Mesh, DPI Engine, Splitmate, VoiceFlow.';
  let html = `<strong>${p.name}</strong> <span class="mono">• ${p.year}</span><br><em>${p.pitch}</em><br><ul>${p.details.map(d=>`<li>${d}</li>`).join('')}</ul><br><div class="ai-tags">${p.stack.map(s=>`<span>${s}</span>`).join('')}</div><br>`;
  html += `🔗 <a href="${p.github}" target="_blank">GitHub</a>`;
  if(p.live) html+=` • <a href="${p.live}" target="_blank">Live Demo</a>`;
  if(p.backend) html+=` • <a href="${p.backend}" target="_blank">Backend</a>`;
  if(p.limitations) html+=`<br><br><span class="mono" style="opacity:.7">Note: ${p.limitations}</span>`;
  return html;
}

function scoreIntent(query, intent){
  const q = query.toLowerCase();
  let score = 0;
  for(const k of intent.kw){
    if(q.includes(k.toLowerCase())){
      // longer keyword = more specific = higher score
      score += k.length * 2;
      // exact word bonus
      if(q === k.toLowerCase()) score += 20;
    }
    // fuzzy: if any word in query matches keyword word
    const qWords = q.split(/\W+/);
    const kWords = k.toLowerCase().split(/\W+/);
    for(const qw of qWords) for(const kw of kWords){
      if(qw.length>2 && kw.length>2 && (qw.includes(kw) || kw.includes(qw))){
        const common = qw===kw? 8 : 2;
        score += common;
      }
    }
  }
  return score;
}

function findAnswer(query){
  if(!query || !query.trim()) return "Ask me something about Ayush — e.g., 'What is UPI Offline Mesh?'";
  // Direct project name exact
  const lower = query.toLowerCase().trim();
  if(lower.includes('upi') && lower.includes('mesh')) return projectAnswer('upi-offline-mesh');
  if(lower === 'dpi' || lower.includes('dpi engine')) return projectAnswer('dpi-engine');
  if(lower.includes('splitmate')) return projectAnswer('splitmate');
  if(lower.includes('voiceflow')|| lower.includes('voice flow')) return projectAnswer('voiceflow');

  let best=null, bestScore=-1;
  for(const intent of INTENTS){
    const s = scoreIntent(query, intent);
    if(s > bestScore){ bestScore=s; best=intent; }
  }
  // threshold — if score too low, fallback to general + who
  if(bestScore < 6){
    return `I only know about <strong>Ayush Shende</strong>. I didn't catch that, but I can tell you about:<br>• Projects (UPI Mesh, DPI, Splitmate, VoiceFlow)<br>• Skills & Tech Stack<br>• Education (CGPA 8.95)<br>• Experience (JPMorgan)<br>• Contact<br><br>Try: "<em>Tell me about DPI Engine</em>"`;
  }
  try { return best.ans(); } catch(e){ return best.ans; }
}

// DOM wiring
(function(){
  const widget = document.getElementById('ai-widget');
  const toggle = document.getElementById('ai-toggle');
  const panel = document.getElementById('ai-panel');
  const closeBtn = document.getElementById('ai-close');
  const input = document.getElementById('ai-input');
  const send = document.getElementById('ai-send');
  const messages = document.getElementById('ai-messages');
  const navTrigger = document.getElementById('nav-ai-trigger');
  const heroBtn = document.getElementById('hero-ai-btn');
  const suggestions = document.querySelectorAll('.ai-suggestions button');

  if(!widget || !toggle || !panel) return;

  function openPanel(){
    panel.hidden=false;
    widget.classList.add('open');
    setTimeout(()=> input && input.focus(), 180);
    // track
    panel.scrollTop = panel.scrollHeight;
  }
  function closePanel(){
    panel.hidden=true;
    widget.classList.remove('open');
  }
  function isOpen(){ return !panel.hidden; }

  toggle.addEventListener('click', ()=> isOpen()? closePanel(): openPanel());
  if(closeBtn) closeBtn.addEventListener('click', closePanel);
  if(navTrigger) navTrigger.addEventListener('click', (e)=>{ e.preventDefault(); openPanel(); });
  if(heroBtn) heroBtn.addEventListener('click', openPanel);

  // suggestions
  suggestions.forEach(b=>{
    b.addEventListener('click', ()=>{
      const q=b.getAttribute('data-q')|| b.textContent;
      input.value=q;
      doSend();
    });
  });

  function addMsg(text, who='bot'){
    const div=document.createElement('div');
    div.className = 'ai-msg ' + (who==='user'? 'ai-msg-user' : 'ai-msg-bot');
    if(who==='user'){
      div.innerHTML = `<div class="ai-msg-bubble user">${escapeHtml(text)}</div><span class="ai-msg-avatar user">You</span>`;
    } else {
      div.innerHTML = `<span class="ai-msg-avatar">AI</span><div class="ai-msg-bubble">${text}</div>`;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function escapeHtml(s){
    const d=document.createElement('div'); d.textContent=s; return d.innerHTML;
  }

  function showTyping(){
    const el=document.createElement('div');
    el.className='ai-msg ai-msg-bot typing';
    el.id='ai-typing';
    el.innerHTML=`<span class="ai-msg-avatar">AI</span><div class="ai-msg-bubble"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>`;
    messages.appendChild(el);
    messages.scrollTop=messages.scrollHeight;
  }
  function hideTyping(){
    const t=document.getElementById('ai-typing');
    if(t) t.remove();
  }

  function doSend(){
    const q=(input.value||'').trim();
    if(!q) return;
    addMsg(q,'user');
    input.value='';
    showTyping();
    // slight delay for realism
    setTimeout(()=>{
      hideTyping();
      const ans = findAnswer(q);
      addMsg(ans,'bot');
    }, 420 + Math.min(500, q.length*10));
  }

  if(send) send.addEventListener('click', doSend);
  if(input) input.addEventListener('keydown', (e)=>{
    if(e.key==='Enter') doSend();
    if(e.key==='Escape') closePanel();
  });

  // close on outside click (mobile)
  document.addEventListener('click', (e)=>{
    if(!widget.contains(e.target) && isOpen() && !e.target.closest('#nav-ai-trigger') && !e.target.closest('#hero-ai-btn')){
      // don't close if clicking toggle
      if(e.target.closest('#ai-toggle')) return;
    }
  });

  // keyboard shortcut: / to open
  document.addEventListener('keydown', (e)=>{
    if(e.key==='/' && !isOpen() && document.activeElement.tagName!=='INPUT' && document.activeElement.tagName!=='TEXTAREA'){
      e.preventDefault();
      openPanel();
    }
  });

  // expose for console
  window.AyushAI = { ask: findAnswer, kb: AYUSH_KB, open: openPanel };

  console.log('%cAyush AI ready (local, no API)','color:#7c7cff; font-weight:700');
  console.log('Try: AyushAI.ask("tell me about upi offline mesh")');
})();
