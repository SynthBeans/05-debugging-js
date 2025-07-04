const gameArea = document.getElementById('gameArea');
const scoreBoard = document.getElementById('scoreBoard');
const levelDisplay = document.getElementById('level');
const livesDisplay = document.getElementById('lives');
const pauseBtn = document.getElementById('pauseBtn');
const pauseMenu = document.getElementById('pauseMenu');
const resumeBtn = document.getElementById('resumeBtn');
const restartBtn = document.getElementById('restartBtn');
const messageOverlay = document.getElementById('messageOverlay');

let score = 0;
let level = 1;
let lives = 3;
let jugsRemaining = 0;
let isPaused = false;

function getRandomPosition() {
  const hud = document.getElementById('hud');
  const hudHeight = hud.offsetHeight;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const maxY = screenHeight - hudHeight - 50;
  const x = Math.random() * (screenWidth - 50);
  const y = Math.random() * (maxY - 70) + 70;
  return { x, y };
}

function showFeedback(text, color, x, y) {
  const fb = document.createElement('div');
  fb.className = 'feedback';
  fb.textContent = text;
  fb.style.color = color;
  // Set the feedback position using template literals
  fb.style.left = `${x}px`;
  fb.style.top = `${y}px`;
  gameArea.appendChild(fb);
  setTimeout(() => fb.remove(), 500);
}

function showMessage(text, showButton = false) {
  messageOverlay.innerHTML = `<h2>${text}</h2>`; // ← Use backticks here!
  if (showButton) {
    const btn = document.createElement('button');
    btn.textContent = 'Restart';
    btn.onclick = () => {
      messageOverlay.style.display = 'none';
      resetGame();
    };
    messageOverlay.appendChild(btn);
  }
  messageOverlay.style.display = 'block';
}


function hideMessage() {
  messageOverlay.style.display = 'none';
}

function createItem(emoji, isJug = false) {
  const item = document.createElement('div');
  item.classList.add('item');

  if (isJug) {
    const img = document.createElement('img');
    img.src = 'img/jerrycan.png';
    img.alt = 'Jerrycan';
    img.style.width = '40px';
    img.style.height = '40px';
    img.draggable = false; // ✅ prevent dragging
    img.addEventListener('dragstart', e => e.preventDefault());
    item.appendChild(img);
  } else {
    item.textContent = emoji;
  }

  const pos = getRandomPosition();
  // Set the item's position using template literals
  item.style.left = `${pos.x}px`;
  item.style.top = `${pos.y}px`;

  item.addEventListener('click', () => {
    if (isPaused) return;

    const rect = item.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top;

    if (isJug) {
      score += 100;
      jugsRemaining--;
      // Update the scoreboard with the current score using a template literal
      scoreBoard.textContent = `SCORE: ${score}`;
      showFeedback('+100 ✅', 'lime', clickX, clickY);
      item.remove();
      if (jugsRemaining === 0) {
        // Show a message when the level is beaten, using a template literal
        showMessage(`CONGRATS ON BEATING LEVEL ${level}`);
        setTimeout(() => {
          hideMessage();
          level++;
          // Update the level display using a template literal
          levelDisplay.textContent = `Level ${level}`;
          lives = 3;
          updateLives();
          initGame();
        }, 1000);
      }
    } else {
      score -= 50;
      lives--;
      // Update the scoreboard with the current score using a template literal
      scoreBoard.textContent = `SCORE: ${score}`;
      updateLives();
      showFeedback('-50 ❌', 'red', clickX, clickY);
      item.remove();
      if (lives <= 0) {
        showMessage('YOU LOST', true);
      }
    }
  });

  gameArea.appendChild(item);
  floatAround(item);
}

function floatAround(item) {
  let dx = (Math.random() - 0.5) * (level + 1);
  let dy = (Math.random() - 0.5) * (level + 1);

  function move() {
    if (isPaused) {
      requestAnimationFrame(move);
      return;
    }

    let rect = item.getBoundingClientRect();
    let hud = document.getElementById('hud');
    let hudHeight = hud.offsetHeight;
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
    let x = rect.left + dx;
    let y = rect.top + dy;

    if (x < 0 || x > screenWidth - 50) dx *= -1;
    if (y < 70) dy *= -1;
    if (y > screenHeight - hudHeight - 50) dy *= -1;

    // Set the new position using template literals
    item.style.left = `${rect.left + dx}px`;
    item.style.top = `${rect.top + dy}px`;

    requestAnimationFrame(move);
  }

  move();
}

function updateLives() {
  livesDisplay.innerHTML = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
}

function initGame() {
  document.querySelectorAll('.item').forEach(el => el.remove());
  jugsRemaining = 3 + level;
  const trashCount = 10 + level * 5;
  const trashEmojis = ['💩', '🪰', '🧻', '🦠', '🧫', '🪨']; // Water-related "trash"

  for (let i = 0; i < trashCount; i++) {
    const trash = trashEmojis[Math.floor(Math.random() * trashEmojis.length)];
    createItem(trash);
  }

  for (let i = 0; i < jugsRemaining; i++) {
    createItem('', true); // Add water jugs
  }

  // Update the scoreboard with the current score using a template literal
  scoreBoard.textContent = `SCORE: ${score}`;
  updateLives();
}

function resetGame() {
  score = 0;
  level = 1;
  lives = 3;
  // Update the level display using a template literal
  levelDisplay.textContent = `Level ${level}`;
  updateLives();
  initGame();
}

// Pause/Resume/Restart
pauseBtn.addEventListener('click', () => {
  isPaused = true;
  pauseMenu.style.display = 'block';
});

resumeBtn.addEventListener('click', () => {
  isPaused = false;
  pauseMenu.style.display = 'none';
});

restartBtn.addEventListener('click', () => {
  isPaused = false;
  pauseMenu.style.display = 'none';
  resetGame();
});

resetGame();