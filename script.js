let confettiInterval = null;

function startGame(n) {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "";

  // zatrzymanie konfetti jeśli działa
  if (confettiInterval) {
    clearInterval(confettiInterval);
    confettiInterval = null;
  }

  if (n === 1) { startPuzzle(); }
  if (n === 2) { startHearts(); }
  if (n === 3) { startQuiz(); }
  if (n === 4) { startWishes(); }
  if (n === 5) { startReaction(); }
  if (n === 6) { startLabirynt(); }
  if (n === 7) { startBalloons(); }
}

/* --- Gra 1: Puzzle --- */
function startPuzzle() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>🧩 Puzzle</h2><p>Ułóż obrazek!</p>";
  const puzzle = document.createElement("div");
  puzzle.className = "puzzle";

  const positions = ["0px 0px", "-150px 0px", "0px -150px", "-150px -150px"];
  const pieces = [];
  positions.forEach((pos, i) => {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.style.backgroundImage = "url('Nowy projekt.jpg')";
    piece.style.backgroundPosition = pos;
    piece.draggable = true;
    piece.dataset.correct = i;
    pieces.push(piece);
  });

  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  pieces.forEach(p => puzzle.appendChild(p));
  gameArea.appendChild(puzzle);

  initPuzzle();
}
function initPuzzle() {
  const pieces = document.querySelectorAll(".piece");
  let dragged;
  pieces.forEach(piece => {
    piece.addEventListener("dragstart", () => { dragged = piece; });
    piece.addEventListener("dragover", e => e.preventDefault());
    piece.addEventListener("drop", e => {
      e.preventDefault();
      const tempBg = dragged.style.backgroundPosition;
      const tempCorrect = dragged.dataset.correct;
      dragged.style.backgroundPosition = piece.style.backgroundPosition;
      dragged.dataset.correct = piece.dataset.correct;
      piece.style.backgroundPosition = tempBg;
      piece.dataset.correct = tempCorrect;
      checkWin();
    });
  });
}
function checkWin() {
  const pieces = document.querySelectorAll(".piece");
  let ok = true;
  pieces.forEach((p, i) => { if (parseInt(p.dataset.correct) !== i) ok = false; });
  if (ok) {
    setTimeout(() => {
      alert("🎉 Brawo Kochanie! Ułożyłaś obrazek 💖");
      unlockNext(2);
    }, 200);
  }
}

/* --- Gra 2: Serduszka --- */
function startHearts() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>💖 Złap serduszka!</h2><p>Klikaj na serduszka zanim znikną!</p>";
  let count = 0;
  const interval = setInterval(() => {
    const heart = document.createElement("div");
    heart.textContent = "💖";
    heart.className = "heart";
    heart.style.left = Math.random() * 80 + "%";
    heart.style.top = "300px";
    heart.onclick = () => { heart.remove(); count++; if(count>=5){clearInterval(interval); alert('Świetnie!'); unlockNext(3);} };
    gameArea.appendChild(heart);
    setTimeout(() => heart.remove(), 4000);
  }, 1000);
}

/* --- Gra 3: Quiz --- */
function startQuiz() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>❓ Mini Quiz</h2>";
  const quiz = document.createElement("div");
  quiz.className = "quiz";
  quiz.innerHTML = `
    <div class="quiz-question">💘 Jak bardzo mnie kochasz? 😍</div>
    <button onclick="alert('Prawidłowa odpowiedź! Kochasz NAJBARDZIEJ ❤️'); unlockNext(4);">Bardzo!</button>
    <button onclick="alert('Spróbuj jeszcze raz 😘')">Średnio</button>
    <button onclick="alert('Na pewno więcej niż myślisz! 💕')">Malutko</button>
  `;
  gameArea.appendChild(quiz);
}

/* --- Gra 4: Życzenia + konfetti --- */
function startWishes() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2 class='wishes'>🎂 Wszystkiego najlepszego Kochanie! 💖</h2>";
  startConfetti();
  setTimeout(()=>{ unlockNext(5); }, 4000);
}
function startConfetti() {
  const gameArea = document.getElementById("game-area");
  confettiInterval = setInterval(() => {
    const symbols = ["🎊", "🎉", "💖", "✨"];
    const conf = document.createElement("div");
    conf.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    conf.style.position = "absolute";
    conf.style.left = Math.random() * window.innerWidth + "px";
    conf.style.top = "-20px";
    conf.style.fontSize = "24px";
    conf.style.animation = `fall ${3 + Math.random() * 2}s linear forwards`;
    gameArea.appendChild(conf);
    setTimeout(() => conf.remove(), 5000);
  }, 300);
}

/* --- Gra 5: Reakcja --- */
function startReaction() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>⚡ Test reakcji</h2><p>Kliknij przycisk gdy się pojawi!</p>";
  const btn = document.createElement("button");
  btn.textContent = "Czekaj...";
  btn.disabled = true;
  gameArea.appendChild(btn);

  const time = 2000 + Math.random()*3000;
  setTimeout(() => {
    btn.textContent = "Kliknij!";
    btn.disabled = false;
    const start = Date.now();
    btn.onclick = () => {
      const ms = Date.now()-start;
      alert("Twój czas reakcji: " + ms + " ms ⏱️");
      unlockNext(6);
    };
  }, time);
}

/* --- Gra 6: Labirynt (rysowanie linii) --- */
function startLabirynt() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>🔑 Labirynt</h2><p>Przeciągnij linię od klucza do serca!</p>";

  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  gameArea.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  ctx.font = "40px Arial";
  ctx.fillText("🔑", 30, 60);
  ctx.fillText("❤️", 330, 360);

  let drawing = false;

  canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = "#ff3399";
    ctx.lineWidth = 3;
    ctx.stroke();
  });

  canvas.addEventListener("mouseup", (e) => {
    drawing = false;
    if (e.offsetX > 300 && e.offsetY > 300) {
      alert("🎉 Udało się! Dotarłaś do serca 💖");
      unlockNext(7);
    }
  });
}

/* --- Gra 7: Balony --- */
function startBalloons() {
  const gameArea = document.getElementById("game-area");
  gameArea.innerHTML = "<h2>🎈 Baloniki z życzeniami</h2><p>Kocham Cię! 💕</p>";
  setInterval(() => {
    const bal = document.createElement("div");
    bal.textContent = "🎈";
    bal.className = "balloon";
    bal.style.left = Math.random() * 300 + "px";
    gameArea.appendChild(bal);
    setTimeout(()=>bal.remove(),6000);
  },800);
}

/* --- Odblokowywanie kolejnych gier --- */
function unlockNext(n) {
  const btn = document.getElementById("btn" + n);
  if (btn) btn.disabled = false;
}
