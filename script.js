/* ===================== Milky Way starfield ===================== */
const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let w, h, stars = [], nebulaDots = [];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function makeStars(){
  stars = [];
  const count = Math.min(420, Math.floor((w * h) / 2600));
  for(let i = 0; i < count; i++){
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.2,
      baseAlpha: Math.random() * 0.6 + 0.25,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.5,
      driftY: (Math.random() - 0.5) * 0.5,
      hue: Math.random() > 0.82 ? '#7ad3ff' : '#ffffff'
    });
  }
  // soft nebula band particles (milky way swath)
  nebulaDots = [];
  const bandCount = 140;
  for(let i = 0; i < bandCount; i++){
    const t = Math.random();
    const bandY = h * 0.35 + Math.sin(t * 10) * h * 0.12;
    nebulaDots.push({
      x: Math.random() * w,
      y: bandY + (Math.random() - 0.5) * h * 0.5,
      r: Math.random() * 60 + 30,
      alpha: Math.random() * 0.025 + 0.008
    });
  }
}
makeStars();
window.addEventListener('resize', makeStars);

let t = 0;
function draw(){
  ctx.clearRect(0, 0, w, h);

  // base navy gradient
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#050714');
  grad.addColorStop(0.5, '#0a0e27');
  grad.addColorStop(1, '#050714');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // nebula band glow
  nebulaDots.forEach(d => {
    const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
    g.addColorStop(0, `rgba(94,150,255,${d.alpha})`);
    g.addColorStop(1, 'rgba(94,150,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // stars
  stars.forEach(s => {
    const tw = reduceMotion ? s.baseAlpha : s.baseAlpha + Math.sin(t * s.twinkleSpeed * 10 + s.twinklePhase) * 0.25;
    ctx.beginPath();
    ctx.fillStyle = s.hue === '#7ad3ff'
      ? `rgba(122,211,255,${Math.max(0, tw)})`
      : `rgba(255,255,255,${Math.max(0, tw)})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    if(!reduceMotion){
      s.x += s.driftX;
      s.y += s.driftY;
      if(s.x < 0) s.x = w;
      if(s.x > w) s.x = 0;
      if(s.y < 0) s.y = h;
      if(s.y > h) s.y = 0;
    }
  });

  t += 1;
  requestAnimationFrame(draw);
}
draw();

/* ===================== Welcome typewriter ===================== */
const typewriterEl = document.getElementById('typewriter');
const typewriterText = 'Welcome to my space on the web';

// Typing speed in ms between characters (higher = slower)
const TYPE_SPEED = 110;
// Guard against overlapping runs: each call to runTypewriter gets its own
// session id, and any pending timeouts from a previous session become no-ops.
let typewriterSession = 0;

function runTypewriter(){
  if(!typewriterEl) return;

  // Invalidate any in-flight typing loop from a previous call
  typewriterSession++;
  const session = typewriterSession;

  typewriterEl.textContent = '';

  if(reduceMotion){
    typewriterEl.textContent = typewriterText;
    return;
  }

  let i = 0;
  function typeNext(){
    // If a newer session has started, stop this one immediately
    if(session !== typewriterSession) return;

    if(i < typewriterText.length){
      typewriterEl.textContent = typewriterText.slice(0, i + 1);
      i++;
      setTimeout(typeNext, TYPE_SPEED);
    }
  }
  // start after the name has floated in
  setTimeout(() => {
    if(session === typewriterSession) typeNext();
  }, 900);
}
runTypewriter();

/* ===================== Step navigation ===================== */
const screens = Array.from(document.querySelectorAll('.screen'));
const totalSteps = screens.length - 1; // excluding welcome
const rail = document.getElementById('rail');
const railFill = document.getElementById('railFill');
const railSteps = document.getElementById('railSteps');

const stepLabels = ['Greetings','Experience','Education','Skills','Certs','Projects','Contact'];
stepLabels.forEach((label, i) => {
  const li = document.createElement('li');
  li.textContent = `${String(i+1).padStart(2,'0')} ${label}`;
  li.dataset.step = i + 1;
  railSteps.appendChild(li);
});

let current = 0;

function goTo(stepIndex){
  screens.forEach(s => s.classList.toggle('active', Number(s.dataset.step) === stepIndex));
  current = stepIndex;

  if(stepIndex === 0){
    rail.classList.remove('show');
    runTypewriter(); // replay the intro animation each time welcome is revisited
  } else {
    rail.classList.add('show');
    const pct = (stepIndex / totalSteps) * 100;
    railFill.style.width = pct + '%';
    Array.from(railSteps.children).forEach(li => {
      const n = Number(li.dataset.step);
      li.classList.toggle('active', n === stepIndex);
      li.classList.toggle('done', n < stepIndex);
    });
  }

  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

document.getElementById('enterBtn').addEventListener('click', () => goTo(1));

document.querySelectorAll('.btn-next').forEach(btn => {
  btn.addEventListener('click', () => {
    const next = current + 1;
    if(next <= totalSteps) goTo(next);
  });
});

document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => {
    const prev = current - 1;
    if(prev >= 0) goTo(prev);
  });
});

const exitBtn = document.getElementById('exitBtn');
if(exitBtn){
  exitBtn.addEventListener('click', () => goTo(0));
}

railSteps.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if(!li) return;
  const n = Number(li.dataset.step);
  if(n <= current) goTo(n);
});
railSteps.style.cursor = 'pointer';

/* keyboard: allow Enter/Space on welcome */
document.addEventListener('keydown', (e) => {
  if(current === 0 && (e.key === 'Enter' || e.key === ' ')){
    e.preventDefault();
    goTo(1);
  }
});

/* ===================== Footer year ===================== */
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

/* ===================== Contact form ===================== */
const formToggle = document.getElementById('formToggle');
const contactFormWrap = document.getElementById('contact-form-wrap');

if(formToggle && contactFormWrap){
  formToggle.addEventListener('click', () => {
    const isOpen = contactFormWrap.classList.toggle('open');
    formToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    formToggle.querySelector('span').textContent = isOpen ? 'Hide the form' : 'Send me a message';
  });
}

const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if(form){
  form.addEventListener('submit', function(event){
    event.preventDefault();
    const submitBtn = document.getElementById('sendBtn');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending…</span>';
    submitBtn.disabled = true;

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(response => {
      if(response.ok){
        formStatus.textContent = 'Message sent — thank you, I will get back to you soon.';
        formStatus.classList.remove('error');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(() => {
      formStatus.textContent = 'Something went wrong. Please try again or email me directly.';
      formStatus.classList.add('error');
    })
    .finally(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
      setTimeout(() => { formStatus.textContent = ''; formStatus.classList.remove('error'); }, 6000);
    });
  });
}

/* init */
goTo(0);