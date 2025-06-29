// Get references to elements
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

// This function gives a random position only in the blue area
function getRandomPosition() {
  // Get the height of the HUD
  const hud = document.getElementById('hud');
  const hudHeight = hud.offsetHeight;

  // Get the width and height of the window for responsiveness
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Set the bottom limit so icons don't go into the HUD
  const maxY = screenHeight - hudHeight - 50; // 50 is icon size
  const x = Math.random() * (screenWidth - 50);
  const y = Math.random() * (maxY - 70) + 70; // 70 is header space
  return { x, y };
}

function showFeedback(text, color, x, y) {
  const fb = document.createElement('div');
  fb.className = 'feedback';
  fb.textContent = text;
  fb.style.color = color;
  fb.style.left = `${x}px`;
  fb.style.top = `${y}px`;
  gameArea.appendChild(fb);
  setTimeout(() => fb.remove(), 500);
}

function showMessage(text, showButton = false) {
  messageOverlay.innerHTML = `<h2>${text}</h2>`;
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
  // Create a div for the icon
  const item = document.createElement('div');
  item.classList.add('item');

  // If this is a jug, use the jerrycan.png image
  if (isJug) {
    const img = document.createElement('img');
    img.src = 'img/jerrycan.png';
    img.alt = 'Jerrycan';
    img.style.width = '40px';
    img.style.height = '40px';
    item.appendChild(img);
  } else {
    item.textContent = emoji;
  }

  // Set random position
  const pos = getRandomPosition();
  item.style.position = 'absolute';
  item.style.left = `${pos.x}px`;
  item.style.top = `${pos.y}px`;

  // Listen for clicks on the item
  item.addEventListener('click', function() {
    if (isPaused) return;

    const rect = item.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top;

    if (isJug) {
      score += 100;
      jugsRemaining--;
      scoreBoard.textContent = `SCORE: ${score}`;
      showFeedback('+100 ✅', 'lime', clickX, clickY);
      item.remove();
      if (jugsRemaining === 0) {
        showMessage(`CONGRATS ON BEATING LEVEL ${level}`);
        setTimeout(function() {
          hideMessage();
          level++;
          levelDisplay.textContent = `Level ${level}`;
          lives = 3;
          updateLives();
          initGame();
        }, 1000);
      }
    } else {
      score -= 50;
      lives--;
      scoreBoard.textContent = `SCORE: ${score}`;
      updateLives();
      showFeedback('-50 ❌', 'red', clickX, clickY);
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

    // Left and right boundaries
    if (x < 0 || x > screenWidth - 50) dx *= -1;

    // Top boundary (header)
    if (y < 70) dy *= -1; // 70px for header

    // Bottom boundary (above HUD)
    if (y > screenHeight - hudHeight - 50) dy *= -1;

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
  // Remove all old icons
  const oldItems = document.querySelectorAll('.item');
  for (let i = 0; i < oldItems.length; i++) {
    oldItems[i].remove();
  }

  jugsRemaining = 3 + level;
  const trashCount = 10 + level * 5;
  const trashEmojis = ['🚽️', '🍟', '🥤', '🪣', '🥃', '🍌'];

  for (let i = 0; i < trashCount; i++) {
    const randomIndex = Math.floor(Math.random() * trashEmojis.length);
    const trash = trashEmojis[randomIndex];
    createItem(trash, false);
  }

  for (let i = 0; i < jugsRemaining; i++) {
    createItem('', true);
  }

  scoreBoard.textContent = `SCORE: ${score}`;
  updateLives();
}

function resetGame() {
  score = 0;
  level = 1;
  lives = 3;
  levelDisplay.textContent = `Level ${level}`;
  updateLives();
  initGame();
}

// Pause and resume logic
pauseBtn.addEventListener('click', function() {
  isPaused = true;
  pauseMenu.style.display = 'block';
});

resumeBtn.addEventListener('click', function() {
  isPaused = false;
  pauseMenu.style.display = 'none';
});

restartBtn.addEventListener('click', function() {
  isPaused = false;
  pauseMenu.style.display = 'none';
  resetGame();
});

// Start the game
resetGame();
  }
}

// When the mouse button is pressed down on the image
jerryCan.addEventListener('mousedown', function(event) {
  // Prevent the image from being dragged
  event.preventDefault();

  // Reset the clicked flag
  jerryCanClicked = false;

  // Start a timer for 0.1 second (100 ms)
  holdTimer = setTimeout(function() {
    handleJerryCanClick();
  }, 10);
});

// When the mouse button is released
jerryCan.addEventListener('mouseup', function(event) {
  // Prevent the image from being dragged
  event.preventDefault();

  // If the timer is still running, clear it and count as a click
  if (holdTimer) {
    clearTimeout(holdTimer);
    handleJerryCanClick();
  }
});

// Prevent dragging the image (for extra safety)
jerryCan.addEventListener('dragstart', function(event) {
  event.preventDefault();
});

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
