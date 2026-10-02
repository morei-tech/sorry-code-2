// ===============================
// SORRY CARD - EDIT THIS SECTION
// ===============================
//
// Put your MP3 files inside /songs/
// and change the names below.
//
// Example:
// { title: "Our Song", file: "songs/our-song.mp3" }
//
// Browser autoplay rules mean music starts after the visitor
// taps the first "Listen to my heart" button.

const SONGS = [
  {
    title: "Bin Tere",
    file: "song1.mp3"
  }
];

// ===============================

const screens = [...document.querySelectorAll(".screen")];
const audio = document.getElementById("audio");
const musicToggle = document.getElementById("musicToggle");
const nextSong = document.getElementById("nextSong");
const trackName = document.getElementById("trackName");
const trackState = document.getElementById("trackState");
const musicStatus = document.getElementById("musicStatus");

let current = 0;
let musicStarted = false;

function showScreen(index, direction = "next") {
  index = Math.max(0, Math.min(index, screens.length - 1));

  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === index);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
  spawnHearts(6);
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const next = currentScreen() + 1;

    // Move to the next page FIRST
    showScreen(next);

    // Try to start music, but NEVER let music stop navigation
    if (!musicStarted) {
      try {
        await startMusic();
      } catch (err) {
        console.log("Music could not start:", err);
      }
    }
  });
});
    if (!musicStarted) await startMusic();
    showScreen(next);
  });
});

document.querySelectorAll("[data-prev]").forEach(btn => {
  btn.addEventListener("click", () => {
    showScreen(currentScreen() - 1, "prev");
  });
});

// Forgiveness meter
const forgiveBtn = document.getElementById("forgiveBtn");
const progressFill = document.getElementById("progressFill");
const percent = document.getElementById("percent");
const meterBear = document.getElementById("meterBear");

let forgiveness = 11;

if (forgiveBtn) {
  forgiveBtn.addEventListener("click", () => {
  forgiveness = Math.min(100, forgiveness + Math.floor(Math.random() * 9) + 5);
  progressFill.style.width = forgiveness + "%";
  percent.textContent = `${forgiveness}% FORGIVEN`;

  if (forgiveness >= 100) {
    meterBear.textContent = "🥰";
    percent.textContent = "100% FORGIVEN ❤️";
    document.querySelector(".tap-hint").textContent = "YAY! I KNEW YOU HAD A BIG HEART 🥹";
  } else if (forgiveness >= 55) {
    meterBear.textContent = "😊";
  } else if (forgiveness >= 30) {
    meterBear.textContent = "🙂";
  } else {
    meterBear.textContent = "🥺";
  }

  spawnHearts(12);
});

// Music
function loadSong(index) {
  if (!SONGS.length) return;
  current = (index + SONGS.length) % SONGS.length;

  audio.src = SONGS[current].file;
  trackName.textContent = SONGS[current].title;
  trackState.textContent = "Ready to play";
}

async function startMusic() {
  if (!SONGS.length) return;

  if (!audio.src) loadSong(0);

  try {
    await audio.play();
    musicStarted = true;
    musicToggle.textContent = "Ⅱ";
    trackState.textContent = "Playing";
    if (musicStatus) musicStatus.textContent = `♫ ${SONGS[current].title}`;
  } catch (err) {
    // User can tap the music button manually.
    trackState.textContent = "Tap ▶ to play";
  }
}

musicToggle.addEventListener("click", async () => {
  if (audio.paused) {
    await startMusic();
  } else {
    audio.pause();
    musicToggle.textContent = "▶";
    trackState.textContent = "Paused";
  }
});

nextSong.addEventListener("click", async () => {
  loadSong(current + 1);
  await startMusic();
});

audio.addEventListener("ended", async () => {
  loadSong(current + 1);
  await startMusic();
});

// Start with first song loaded, but don't force autoplay.
loadSong(0);

// Restart
document.getElementById("restart").addEventListener("click", () => {
  showScreen(0, "prev");
  window.scrollTo({ top: 0 });
});

// Floating hearts
function spawnHeart() {
  const holder = document.getElementById("hearts");
  const el = document.createElement("span");
  el.className = "floating-heart";
  el.textContent = Math.random() > .3 ? "♥" : "♡";
  el.style.left = Math.random() * 100 + "%";
  el.style.fontSize = (12 + Math.random() * 15) + "px";
  el.style.animationDuration = (4 + Math.random() * 4) + "s";
  holder.appendChild(el);

  setTimeout(() => el.remove(), 9000);
}

function spawnHearts(amount = 4) {
  for (let i = 0; i < amount; i++) {
    setTimeout(spawnHeart, i * 90);
  }
}

setInterval(() => spawnHeart(), 1300);
spawnHearts(10);
