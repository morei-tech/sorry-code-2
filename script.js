// ===============================
// SORRY CARD - EDIT THIS SECTION
// ===============================
//
// Put your MP3 files in the same folder as index.html
// OR change the file path below.
//
// Example:
// { title: "Our Song", file: "songs/our-song.mp3" }
//
// Browser autoplay rules mean music starts after the
// visitor taps the first "Listen to my heart" button.
//

const SONGS = [
  {
    title: "Bin Tere",
    file: "song1.mp3"
  }
];

// ===============================
// SCREEN NAVIGATION
// ===============================

const screens = [...document.querySelectorAll(".screen")];

let screenIndex = 0;
let songIndex = 0;

function currentScreen() {
  return screenIndex;
}

function showScreen(index, direction = "next") {
  if (!screens.length) return;

  index = Math.max(0, Math.min(index, screens.length - 1));
  screenIndex = index;

  screens.forEach((screen, i) => {
    screen.classList.toggle("active", i === screenIndex);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (typeof spawnHearts === "function") {
    spawnHearts(6);
  }
}

// ===============================
// NEXT BUTTONS
// ===============================

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const next = currentScreen() + 1;

    // Move to the next screen first
    showScreen(next);

    // Start music when possible
    if (!musicStarted) {
      await startMusic();
    }
  });
});

// ===============================
// BACK BUTTONS
// ===============================

document.querySelectorAll("[data-prev]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const previous = currentScreen() - 1;
    showScreen(previous, "prev");
  });
});

// ===============================
// FORGIVENESS METER
// ===============================

const forgiveBtn = document.getElementById("forgiveBtn");
const progressFill = document.getElementById("progressFill");
const percent = document.getElementById("percent");
const meterBear = document.getElementById("meterBear");
const tapHint = document.querySelector(".tap-hint");

let forgiveness = 11;

if (forgiveBtn) {
  forgiveBtn.addEventListener("click", () => {
    forgiveness = Math.min(
      100,
      forgiveness + Math.floor(Math.random() * 9) + 5
    );

    if (progressFill) {
      progressFill.style.width = forgiveness + "%";
    }

    if (percent) {
      percent.textContent = `${forgiveness}% FORGIVEN`;
    }

    if (forgiveness >= 100) {
      if (meterBear) {
        meterBear.textContent = "🥰";
      }

      if (percent) {
        percent.textContent = "100% FORGIVEN ❤️";
      }

      if (tapHint) {
        tapHint.textContent =
          "YAY! I KNEW YOU HAD A BIG HEART 🥹";
      }
    } else if (forgiveness >= 55) {
      if (meterBear) {
        meterBear.textContent = "😊";
      }
    } else if (forgiveness >= 30) {
      if (meterBear) {
        meterBear.textContent = "🙂";
      }
    } else {
      if (meterBear) {
        meterBear.textContent = "🥺";
      }
    }

    if (typeof spawnHearts === "function") {
      spawnHearts(12);
    }
  });
}

// ===============================
// MUSIC PLAYER
// ===============================

const audio = document.getElementById("audio");
const musicToggle = document.getElementById("musicToggle");
const nextSong = document.getElementById("nextSong");
const trackName = document.getElementById("trackName");
const trackState = document.getElementById("trackState");
const musicStatus = document.getElementById("musicStatus");

let musicStarted = false;

function loadSong(index) {
  if (!audio || !SONGS.length) return;

  songIndex = (index + SONGS.length) % SONGS.length;

  audio.src = SONGS[songIndex].file;
  audio.load();

  if (trackName) {
    trackName.textContent = SONGS[songIndex].title;
  }

  if (trackState) {
    trackState.textContent = "Ready to play";
  }

  if (musicStatus) {
    musicStatus.textContent = `♫ ${SONGS[songIndex].title}`;
  }
}

async function startMusic() {
  if (!audio || !SONGS.length) return;

  if (!audio.src) {
    loadSong(songIndex);
  }

  try {
    await audio.play();

    musicStarted = true;

    if (musicToggle) {
      musicToggle.textContent = "Ⅱ";
    }

    if (trackState) {
      trackState.textContent = "Playing";
    }

    if (musicStatus) {
      musicStatus.textContent = `♫ ${SONGS[songIndex].title}`;
    }
  } catch (err) {
    console.log("Music could not start:", err);

    if (trackState) {
      trackState.textContent = "Tap ▶ to play";
    }
  }
}

// Play / pause
if (musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (!audio) return;

    if (audio.paused) {
      await startMusic();
    } else {
      audio.pause();

      musicToggle.textContent = "▶";

      if (trackState) {
        trackState.textContent = "Paused";
      }
    }
  });
}

// Next song
if (nextSong) {
  nextSong.addEventListener("click", async () => {
    loadSong(songIndex + 1);
    await startMusic();
  });
}

// Automatically play next song
if (audio) {
  audio.addEventListener("ended", async () => {
    loadSong(songIndex + 1);
    await startMusic();
  });
}

// ===============================
// INITIAL MUSIC LOAD
// ===============================

loadSong(0);

// ===============================
// RESTART BUTTON
// ===============================

const restart = document.getElementById("restart");

if (restart) {
  restart.addEventListener("click", () => {
    showScreen(0, "prev");

    if (audio) {
      audio.pause();
      audio.currentTime = 0;

      musicStarted = false;

      if (musicToggle) {
        musicToggle.textContent = "▶";
      }

      if (trackState) {
        trackState.textContent = "Ready to play";
      }
    }
  });
}

// ===============================
// FLOATING HEARTS
// ===============================

function spawnHeart() {
  const holder = document.getElementById("hearts");

  if (!holder) return;

  const el = document.createElement("span");

  el.className = "floating-heart";
  el.textContent = Math.random() > 0.3 ? "♥" : "♡";

  el.style.left = Math.random() * 100 + "%";
  el.style.fontSize = 12 + Math.random() * 15 + "px";
  el.style.animationDuration = 4 + Math.random() * 4 + "s";

  holder.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 9000);
}

function spawnHearts(amount = 4) {
  for (let i = 0; i < amount; i++) {
    setTimeout(spawnHeart, i * 90);
  }
}

// Background hearts
setInterval(() => {
  spawnHeart();
}, 1300);

spawnHearts(10);

// ===============================
// START ON FIRST SCREEN
// ===============================

showScreen(0);
