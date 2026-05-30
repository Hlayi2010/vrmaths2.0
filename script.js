// ============================================================
//  COSMOS MATH — VR Space Academy  |  script.js
// ============================================================

let selectedGrade = null;
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let playerName = "Cadet";
let scoreboard = null;
let correctStreak = 0;
let questionActive = false;

// ——— Question bank ———
const questionsByGrade = {
  1: [
    { q: "2 + 2 = ?", options: [3, 4, 5], correctIndex: 1 },
    { q: "1 + 3 = ?", options: [4, 3, 2], correctIndex: 0 },
    { q: "2 + 1 = ?", options: [2, 3, 4], correctIndex: 1 },
    { q: "3 + 2 = ?", options: [5, 4, 6], correctIndex: 0 },
    { q: "4 + 1 = ?", options: [6, 4, 5], correctIndex: 2 },
    { q: "2 + 5 = ?", options: [6, 7, 8], correctIndex: 1 },
    { q: "3 + 3 = ?", options: [6, 5, 4], correctIndex: 0 },
    { q: "4 + 2 = ?", options: [6, 5, 7], correctIndex: 0 },
    { q: "1 + 1 = ?", options: [2, 3, 1], correctIndex: 0 },
    { q: "5 + 2 = ?", options: [7, 8, 6], correctIndex: 0 },
    { q: "5 - 2 = ?", options: [3, 2, 4], correctIndex: 0 },
    { q: "6 - 1 = ?", options: [5, 4, 6], correctIndex: 0 },
    { q: "7 - 3 = ?", options: [4, 3, 5], correctIndex: 0 },
    { q: "9 - 5 = ?", options: [4, 3, 5], correctIndex: 0 },
    { q: "10 - 7 = ?", options: [3, 2, 4], correctIndex: 0 },
    { q: "4 - 2 = ?", options: [2, 3, 1], correctIndex: 0 },
    { q: "3 - 1 = ?", options: [2, 1, 0], correctIndex: 0 },
    { q: "8 - 6 = ?", options: [2, 3, 1], correctIndex: 0 },
    { q: "6 - 3 = ?", options: [3, 2, 4], correctIndex: 0 },
    { q: "5 - 4 = ?", options: [1, 2, 0], correctIndex: 0 }
  ],
  2: [
    { q: "5 + 6 = ?", options: [11, 10, 12], correctIndex: 0 },
    { q: "4 + 5 = ?", options: [9, 10, 8], correctIndex: 0 },
    { q: "3 + 7 = ?", options: [10, 9, 8], correctIndex: 0 },
    { q: "6 + 6 = ?", options: [11, 12, 10], correctIndex: 1 },
    { q: "7 + 4 = ?", options: [11, 12, 10], correctIndex: 0 },
    { q: "8 + 3 = ?", options: [11, 10, 12], correctIndex: 0 },
    { q: "12 - 4 = ?", options: [8, 7, 9], correctIndex: 0 },
    { q: "10 - 3 = ?", options: [7, 8, 6], correctIndex: 0 },
    { q: "11 - 5 = ?", options: [6, 5, 7], correctIndex: 0 },
    { q: "15 - 6 = ?", options: [9, 8, 10], correctIndex: 0 },
    { q: "3 x 2 = ?", options: [6, 5, 4], correctIndex: 0 },
    { q: "2 x 4 = ?", options: [8, 6, 7], correctIndex: 0 },
    { q: "4 x 2 = ?", options: [8, 7, 6], correctIndex: 0 },
    { q: "3 x 3 = ?", options: [9, 8, 10], correctIndex: 0 },
    { q: "5 x 2 = ?", options: [10, 9, 11], correctIndex: 0 },
    { q: "2 x 3 = ?", options: [6, 5, 7], correctIndex: 0 },
    { q: "6 / 2 = ?", options: [3, 2, 4], correctIndex: 0 },
    { q: "9 / 3 = ?", options: [3, 2, 4], correctIndex: 0 },
    { q: "12 / 3 = ?", options: [4, 3, 5], correctIndex: 0 },
    { q: "16 / 4 = ?", options: [4, 3, 5], correctIndex: 0 }
  ]
};

// ——— Shuffle utility ———
function shuffle(array) {
  return array
    .map(v => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v);
}

// ——— Text-to-speech ———
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text);
  msg.pitch = 1.1;
  msg.rate = 0.95;
  window.speechSynthesis.speak(msg);
}

// ============================================================
//  STAR FIELD  (canvas-based, animated)
// ============================================================
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(count) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.2,
        speed: Math.random() * 0.15 + 0.02,
        alpha: Math.random(),
        flicker: Math.random() * 0.02,
        // some stars get a subtle color tint
        hue: [0, 200, 220, 270, 50][Math.floor(Math.random() * 5)]
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.alpha += s.flicker * (Math.random() > 0.5 ? 1 : -1);
      s.alpha = Math.max(0.1, Math.min(1, s.alpha));
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      if (s.hue === 0) {
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      } else {
        ctx.fillStyle = `hsla(${s.hue},80%,85%,${s.alpha})`;
      }
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  createStars(320);
  draw();
  window.addEventListener('resize', () => { resize(); createStars(320); });
})();

// ============================================================
//  CUSTOM CURSOR
// ============================================================
const cursorEl = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => {
  cursorEl.style.width = '30px';
  cursorEl.style.height = '30px';
  cursorEl.style.borderColor = '#bf5fff';
});
document.addEventListener('mouseup', () => {
  cursorEl.style.width = '20px';
  cursorEl.style.height = '20px';
  cursorEl.style.borderColor = '#00f5ff';
});

// ============================================================
//  LAUNCH SCREEN
// ============================================================
function startApp() {
  const input = document.getElementById('playerNameInput').value;
  if (input.trim() !== '') playerName = input.trim().toUpperCase();

  // Hide launch screen with fade
  const screen = document.getElementById('launchScreen');
  screen.style.transition = 'opacity 0.8s ease';
  screen.style.opacity = '0';
  setTimeout(() => { screen.style.display = 'none'; }, 800);

  document.getElementById('vrBtn').style.display = 'block';

  // Update in-scene welcome
  document.querySelector('#welcomeText').setAttribute('value', `WELCOME, CADET ${playerName}`);
  speak(`Welcome, Cadet ${playerName}. Press begin mission to start.`);
}

// Allow Enter key on name input
document.getElementById('playerNameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') startApp();
});

// ============================================================
//  GAME FLOW
// ============================================================
function startGame() {
  if (selectedGrade !== null) return;
  speak(`Cadet ${playerName}, select your mission level.`);
  document.querySelector('#startButton').setAttribute('visible', 'false');
  document.querySelector('#welcomePanel').setAttribute('visible', 'false');
  document.querySelector('#grade1Btn').setAttribute('visible', 'true');
  document.querySelector('#grade2Btn').setAttribute('visible', 'true');
}

function selectGrade(grade) {
  if (selectedGrade !== null) return;
  selectedGrade = grade;
  currentQuestionIndex = 0;
  score = 0;
  correctStreak = 0;

  questions = shuffle(questionsByGrade[grade]).slice(0, 10).map(q => {
    const correctAnswer = q.options[q.correctIndex];
    const shuffled = shuffle([...q.options]);
    return {
      q: q.q,
      options: shuffled,
      correctAnswer,
      correctIndex: shuffled.indexOf(correctAnswer)
    };
  });

  speak(`Mission Level ${grade} accepted. Prepare for launch, ${playerName}!`);
  document.querySelector('#grade1Btn').setAttribute('visible', 'false');
  document.querySelector('#grade2Btn').setAttribute('visible', 'false');

  initScoreboard();
  setTimeout(showQuestion, 1200);
}

// ——— Scoreboard ———
function initScoreboard() {
  if (scoreboard) scoreboard.parentNode.removeChild(scoreboard);

  scoreboard = document.createElement('a-entity');
  scoreboard.setAttribute('id', 'scoreboard');
  scoreboard.setAttribute('position', '2.8 2.5 -3.5');

  // Panel
  const panel = document.createElement('a-plane');
  panel.setAttribute('width', '1.8');
  panel.setAttribute('height', '1');
  panel.setAttribute('material', 'color:#020817; emissive:#39ff14; emissiveIntensity:0.08; opacity:0.85; transparent:true');
  scoreboard.appendChild(panel);

  // Border
  const border = document.createElement('a-entity');
  border.setAttribute('geometry', 'primitive:box; height:1.01; width:1.81; depth:0.02');
  border.setAttribute('material', 'wireframe:true; color:#39ff14; opacity:0.4; transparent:true');
  scoreboard.appendChild(border);

  // Score text
  const scoreText = document.createElement('a-text');
  scoreText.setAttribute('id', 'scoreDisplay');
  scoreText.setAttribute('value', `CADET: ${playerName}\nSCORE: 0 / 0\n★ ★ ★ ★ ★`);
  scoreText.setAttribute('color', '#39ff14');
  scoreText.setAttribute('align', 'center');
  scoreText.setAttribute('width', '3');
  scoreText.setAttribute('position', '0 0 0.05');
  scoreText.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');
  scoreboard.appendChild(scoreText);

  document.querySelector('a-scene').appendChild(scoreboard);
}

function updateScoreboard() {
  if (!scoreboard) return;
  const filled = Math.min(5, Math.round((score / Math.max(1, currentQuestionIndex)) * 5));
  const stars = '★'.repeat(filled) + '☆'.repeat(5 - filled);
  const txt = scoreboard.querySelector('[id="scoreDisplay"]') ||
              scoreboard.querySelector('[text]');
  if (txt) {
    txt.setAttribute('value', `CADET: ${playerName}\nSCORE: ${score} / ${currentQuestionIndex}\n${stars}`);
  }
}

// ——— Show question ———
function showQuestion() {
  if (currentQuestionIndex >= questions.length) { showFinalScore(); return; }
  questionActive = true;
  const q = questions[currentQuestionIndex];

  document.querySelector('#questionPanel').setAttribute('visible', 'true');
  document.querySelector('#questionText').setAttribute('value', q.q);
  document.querySelector('#feedbackText').setAttribute('visible', 'false');

  // Show answer buttons with staggered appearance
  for (let i = 0; i < 3; i++) {
    const opt = document.querySelector(`#option${i + 1}`);
    const txt = document.querySelector(`#text${i + 1}`);
    opt.setAttribute('visible', 'true');
    txt.setAttribute('value', String(q.options[i]));
  }

  updateScoreboard();
}

// ——— Answer selection ———
function selectAnswer(selectedIndex) {
  if (!questionActive) return;
  questionActive = false;

  const q = questions[currentQuestionIndex];
  const isCorrect = selectedIndex === q.correctIndex;

  // Hide options
  for (let i = 1; i <= 3; i++) {
    document.querySelector(`#option${i}`).setAttribute('visible', 'false');
  }

  const feedback = document.querySelector('#feedbackText');
  feedback.setAttribute('visible', 'true');

  if (isCorrect) {
    score++;
    correctStreak++;
    feedback.setAttribute('color', '#39ff14');

    if (correctStreak >= 3) {
      feedback.setAttribute('value', `✦ STELLAR! ${correctStreak} IN A ROW! ✦`);
      speak(`Stellar work, ${playerName}! ${correctStreak} correct in a row!`);
    } else {
      const praise = ['CORRECT!', 'EXCELLENT!', 'ORBIT ACHIEVED!', 'LAUNCH SUCCESS!', 'PERFECT!'];
      const msg = praise[Math.floor(Math.random() * praise.length)];
      feedback.setAttribute('value', `✓ ${msg}`);
      speak(`Correct, ${playerName}!`);
    }

    // Particle burst effect (scale pulse on panel)
    const panel = document.querySelector('#questionPanel');
    panel.setAttribute('animation__correct', 'property:scale; from:1 1 1; to:1.05 1.05 1.05; dir:alternate; dur:300; repeat:1');

  } else {
    correctStreak = 0;
    const correct = q.options[q.correctIndex];
    feedback.setAttribute('color', '#ff4444');
    feedback.setAttribute('value', `✗ WRONG — ANSWER: ${correct}`);
    speak(`Incorrect, ${playerName}. The answer was ${correct}.`);
  }

  currentQuestionIndex++;
  updateScoreboard();

  if (currentQuestionIndex < questions.length) {
    setTimeout(showQuestion, 2200);
  } else {
    setTimeout(showFinalScore, 2200);
  }
}

// ——— Final Score ———
function showFinalScore() {
  document.querySelector('#questionPanel').setAttribute('visible', 'false');
  document.querySelector('#feedbackText').setAttribute('visible', 'false');
  for (let i = 1; i <= 3; i++) {
    document.querySelector(`#option${i}`).setAttribute('visible', 'false');
  }
  if (scoreboard) { scoreboard.parentNode.removeChild(scoreboard); scoreboard = null; }

  const total = questions.length;
  const pct = Math.round((score / total) * 100);

  let rank, stars, color;
  if (pct >= 90) {
    rank = 'SPACE COMMANDER'; stars = '★★★★★'; color = '#ffd700';
  } else if (pct >= 70) {
    rank = 'STELLAR PILOT'; stars = '★★★★☆'; color = '#00f5ff';
  } else if (pct >= 50) {
    rank = 'ORBIT CADET'; stars = '★★★☆☆'; color = '#bf5fff';
  } else {
    rank = 'LAUNCH TRAINEE'; stars = '★★☆☆☆'; color = '#ff6b35';
  }

  // Final panel
  const finalEntity = document.createElement('a-entity');
  finalEntity.setAttribute('id', 'finalPanel');
  finalEntity.setAttribute('position', '0 1.8 -3');
  finalEntity.setAttribute('animation', 'property:position; from:0 3 -3; to:0 1.8 -3; dur:800; easing:easeOutBack');

  const bg = document.createElement('a-plane');
  bg.setAttribute('width', '3.5');
  bg.setAttribute('height', '2');
  bg.setAttribute('material', `color:#020817; emissive:${color}; emissiveIntensity:0.06; opacity:0.92; transparent:true`);
  finalEntity.appendChild(bg);

  const border = document.createElement('a-entity');
  border.setAttribute('geometry', 'primitive:box; height:2.01; width:3.51; depth:0.02');
  border.setAttribute('material', `wireframe:true; color:${color}; opacity:0.5; transparent:true`);
  finalEntity.appendChild(border);

  const txt = document.createElement('a-text');
  txt.setAttribute('value',
    `MISSION COMPLETE\n\n${playerName}\n${score} / ${total} — ${pct}%\n\n${stars}\n\n${rank}`
  );
  txt.setAttribute('color', color);
  txt.setAttribute('align', 'center');
  txt.setAttribute('width', '5');
  txt.setAttribute('position', '0 0 0.06');
  txt.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');
  finalEntity.appendChild(txt);

  // Replay button
  const replayBtn = document.createElement('a-entity');
  replayBtn.setAttribute('class', 'clickable');
  replayBtn.setAttribute('geometry', 'primitive:box; height:0.45; width:2.2; depth:0.05');
  replayBtn.setAttribute('position', '0 -1.3 0.1');
  replayBtn.setAttribute('material', `color:${color}; emissive:${color}; emissiveIntensity:0.2; opacity:0.15; transparent:true`);
  replayBtn.setAttribute('onclick', 'replayGame()');

  const replayTxt = document.createElement('a-text');
  replayTxt.setAttribute('value', '↺  PLAY AGAIN');
  replayTxt.setAttribute('color', color);
  replayTxt.setAttribute('align', 'center');
  replayTxt.setAttribute('width', '5');
  replayTxt.setAttribute('position', '0 0 0.06');
  replayTxt.setAttribute('font', 'https://cdn.aframe.io/fonts/Exo2Bold.fnt');
  replayBtn.appendChild(replayTxt);
  finalEntity.appendChild(replayBtn);

  document.querySelector('a-scene').appendChild(finalEntity);

  speak(`Mission complete, ${playerName}! You scored ${score} out of ${total}. Rank: ${rank}!`);
}

// ——— Replay ———
function replayGame() {
  selectedGrade = null;
  currentQuestionIndex = 0;
  score = 0;
  correctStreak = 0;
  questionActive = false;
  questions = [];

  const fp = document.querySelector('#finalPanel');
  if (fp) fp.parentNode.removeChild(fp);

  document.querySelector('#welcomePanel').setAttribute('visible', 'true');
  document.querySelector('#welcomeText').setAttribute('value', `WELCOME BACK, ${playerName}`);
  document.querySelector('#startButton').setAttribute('visible', 'true');

  speak(`Welcome back, ${playerName}. Select begin mission to play again.`);
}

// ============================================================
//  VR MODE
// ============================================================
function enterVR() {
  const scene = document.querySelector('a-scene');
  if (scene.hasLoaded) {
    scene.enterVR().catch(() =>
      alert('VR not available on this device.')
    );
  } else {
    scene.addEventListener('loaded', () => scene.enterVR().catch(() =>
      alert('VR not available on this device.')
    ));
  }
}

// ============================================================
//  A-FRAME STAR DOME (procedural, inside the scene)
// ============================================================
document.querySelector('a-scene').addEventListener('loaded', () => {
  const starsEl = document.getElementById('stars');

  // Procedural star particles as tiny spheres scattered on a large dome
  for (let i = 0; i < 300; i++) {
    const star = document.createElement('a-sphere');
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 40 + Math.random() * 20;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);

    const size = Math.random() * 0.08 + 0.01;
    const brightness = Math.random();
    let color;
    if (brightness > 0.9) color = '#aaccff';
    else if (brightness > 0.7) color = '#ffffff';
    else if (brightness > 0.5) color = '#ffeecc';
    else color = '#ccddff';

    star.setAttribute('radius', size);
    star.setAttribute('position', `${x} ${y} ${z}`);
    star.setAttribute('material', `color:${color}; emissive:${color}; emissiveIntensity:1; shader:flat`);
    star.setAttribute('segments-height', '4');
    star.setAttribute('segments-width', '4');
    starsEl.appendChild(star);
  }

  // Shooting star (slow glowing streaks)
  for (let i = 0; i < 5; i++) {
    const streak = document.createElement('a-cylinder');
    streak.setAttribute('radius', '0.02');
    streak.setAttribute('height', '2');
    streak.setAttribute('position', `${(Math.random()-0.5)*30} ${Math.random()*15+5} ${-20 - Math.random()*20}`);
    streak.setAttribute('rotation', `${Math.random()*30 - 15} 0 ${Math.random()*60 - 30}`);
    streak.setAttribute('material', 'color:#00f5ff; emissive:#00f5ff; emissiveIntensity:1; opacity:0.6; transparent:true; shader:flat');
    streak.setAttribute('animation', `property:position; to:${(Math.random()-0.5)*30} ${Math.random()*-5} ${-20 - Math.random()*20}; dur:${6000+Math.random()*4000}; loop:true; easing:linear`);
    streak.setAttribute('animation__fade', 'property:material.opacity; from:0; to:0.6; dir:alternate; dur:3000; loop:true');
    starsEl.appendChild(streak);
  }
});
