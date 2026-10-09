// --- 1. CONFIGURATION & LETTER DATA ---
const SITE_PASSCODE = "1402"; // Change to your preferred key

const lettersData = [
    {
        id: "miss-me",
        title: "you miss me",
        text: "Hey love,\n\nIf you're reading this, close your eyes for a second. Distance is just a small detail when two people mean this much to each other. I'm right here with you.",
        photo: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
        caption: "Always in my thoughts"
    },
    {
        id: "you-are-sad",
        title: "you're sad",
        text: "Whatever happened today doesn't define you. Breathe deeply, take it gentle, and remember you don't have to carry the whole world all at once. I'm always on your team.",
        photo: null,
        caption: ""
    },
    {
        id: "you-are-happy",
        title: "you're happy",
        text: "Hold onto this exact feeling! Seeing you genuinely smile is my favorite thing. Go celebrate this moment—you deserve every bit of sunshine today brings.",
        photo: null,
        caption: ""
    },
    {
        id: "need-a-hug",
        title: "you need a hug",
        text: "Consider this an official, unbreakable, warm virtual hug. Wrap up in your softest blanket and imagine me squeezing you tight until you smile.",
        photo: null,
        caption: ""
    },
    {
        id: "we-fight",
        title: "we just argued",
        text: "Take a breath. It is always us versus the problem—never me versus you. I love you far more than any temporary disagreement. Let's talk whenever you're ready.",
        photo: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80",
        caption: "Us against the world"
    }
];

// --- 2. INTRO DIALOGUE FLOW ---
const introSteps = [
    {
        text: "I made something for you...",
        sticker: "🌸",
        actions: [{ label: "What is it?", next: 1 }]
    },
    {
        text: "Will you see it?",
        sticker: "💌",
        actions: [
            { label: "Yes!", next: 3 },
            { label: "No", next: 2 }
        ]
    },
    {
        text: "Please say yes? 🥺",
        sticker: "🥺",
        actions: [{ label: "Fine... yes!", next: 3 }]
    },
    {
        text: "Are you ready for the surprise?",
        sticker: "✨",
        actions: [{ label: "Open it!", next: "HUB" }]
    }
];

// --- 3. STATE & STORAGE ---
let openedLetters = JSON.parse(localStorage.getItem("opened_letters") || "[]");
const bgMusic = document.getElementById("bg-music");
let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        bgMusic.play().then(() => {
            musicStarted = true;
        }).catch(() => { });
    }
}

document.getElementById("music-toggle").addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play();
    } else {
        bgMusic.pause();
    }
});

// --- 4. PASSCODE LOGIC ---
const lockScreen = document.getElementById("lock-screen");
const introScreen = document.getElementById("intro-screen");
const passcodeField = document.getElementById("passcode-input");
const unlockBtn = document.getElementById("unlock-btn");
const lockError = document.getElementById("lock-error");

unlockBtn.addEventListener("click", () => {
    if (passcodeField.value.trim() === SITE_PASSCODE) {
        lockScreen.classList.add("hidden");
        introScreen.classList.remove("hidden");
        renderIntroStep(0);
        startMusic();
    } else {
        lockError.textContent = "Incorrect code. Try again!";
        passcodeField.value = "";
    }
});

// --- 5. INTRO RENDERING ---
const introText = document.getElementById("intro-text");
const introSticker = document.getElementById("intro-sticker");
const introActions = document.getElementById("intro-actions");
const hubScreen = document.getElementById("hub-screen");

function renderIntroStep(index) {
    const step = introSteps[index];
    introText.textContent = step.text;
    introSticker.textContent = step.sticker;
    introActions.innerHTML = "";

    step.actions.forEach(action => {
        const btn = document.createElement("button");
        btn.className = "btn";
        btn.textContent = action.label;
        btn.style.margin = "4px 8px";
        btn.addEventListener("click", () => {
            if (action.next === "HUB") {
                introScreen.classList.add("hidden");
                hubScreen.classList.remove("hidden");
                renderHub();
            } else {
                renderIntroStep(action.next);
            }
        });
        introActions.appendChild(btn);
    });
}

// --- 6. HUB & ENVELOPES RENDERING ---
const envelopesGrid = document.getElementById("envelopes-grid");

function renderHub() {
    envelopesGrid.innerHTML = "";
    lettersData.forEach(letter => {
        const isOpened = openedLetters.includes(letter.id);
        const card = document.createElement("div");
        card.className = `envelope-card paper-shadow ${isOpened ? "opened" : ""}`;
        card.innerHTML = `
      <span class="badge">Open When</span>
      <h3 class="title">${letter.title}</h3>
      <span class="status">${isOpened ? "✓ Opened" : "Unopened"}</span>
    `;
        card.addEventListener("click", () => openLetter(letter));
        envelopesGrid.appendChild(card);
    });
}

// --- 7. MODAL LETTER VIEWER ---
const letterModal = document.getElementById("letter-modal");
const letterText = document.getElementById("letter-text");
const polaroid = document.getElementById("letter-polaroid");
const polaroidImg = document.getElementById("polaroid-img");
const polaroidCaption = document.getElementById("polaroid-caption");
const backBtn = document.getElementById("back-btn");

function openLetter(letter) {
    if (!openedLetters.includes(letter.id)) {
        openedLetters.push(letter.id);
        localStorage.setItem("opened_letters", JSON.stringify(openedLetters));
        renderHub();
    }

    letterText.textContent = letter.text;

    if (letter.photo) {
        polaroidImg.src = letter.photo;
        polaroidCaption.textContent = letter.caption || "";
        polaroid.classList.remove("hidden");
    } else {
        polaroid.classList.add("hidden");
    }

    letterModal.classList.remove("hidden");
}

backBtn.addEventListener("click", () => {
    letterModal.classList.add("hidden");
});