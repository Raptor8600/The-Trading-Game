// ==== Constants & Initial Setup ====
const DECK = [-10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20];
const DECK_AVG = 7.65;
const BASE_EXPECTED_TOTAL = 61.2;
const AI_NAMES = ["Jeffrey", "Riya", "Marcus", "Samira", "Leo", "Sam", "Avery", "Jimmy", "Todd", "Ella", "Nicole", "Zeke"];

let yourCard = null;
let aiPlayers = [];
let currentRound = 1;
const totalRounds = 5;
let difficulty = "";
let yourScore = 0;
let playerName = "You";

// ==== Audio ====
const clickSound = new Audio("click.mp3");
const successSound = new Audio("success.mp3");
let soundMuted = false;

function playClick() {
    if (!soundMuted) clickSound.play();
}

function playSuccess() {
    if (!soundMuted) successSound.play();
}

// ==== AI Player Logic ====

function createAI(name, card, difficulty = "medium") {
    const isBluffing = Math.random() < (difficulty === "hard" ? 0.7 : difficulty === "easy" ? 0.2 : 0.4);
    const base = BASE_EXPECTED_TOTAL - DECK_AVG + card;
    let adjusted = base;

    if (isBluffing) {
        // Bluffing logic: high cards quote low, low cards quote high
        adjusted = base + (card > 10 ? -6 : card < 5 ? 6 : (Math.random() - 0.5) * 4);
    }

    const bid = Math.floor(adjusted - 2);
    const ask = Math.floor(adjusted + 2);

    const narrationTemplates = isBluffing ? [
        `${name} quickly says ${bid}–${ask}. You think: “Too smooth. They might be bluffing.”`,
        `${name} posts ${bid}–${ask}. Their voice is steady, but something feels off.`,
        `${name} says ${bid}–${ask}. You wonder: "Too clean to be real?"`
    ] : [
        `${name} says ${bid}–${ask}. Sounds like they're just doing math.`,
        `${name} shrugs and offers ${bid}–${ask}. Honest?`,
        `${name} mumbles ${bid}–${ask}. Not sure they’re hiding anything.`
    ];

    return {
        name,
        bid,
        ask,
        card,
        bluffing: isBluffing,
        strategy: isBluffing ? "bluffing" : "straight",
        narration: () => narrationTemplates[Math.floor(Math.random() * narrationTemplates.length)],
        memory: []
    };
}

// ==== Game Logic ====

function shuffle(deck) {
    return [...deck].sort(() => Math.random() - 0.5);
}

function startGame() {
    const inputName = document.getElementById("playerName").value.trim();
    if (inputName) playerName = inputName;

    document.getElementById("setup").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    yourScore = 0;
    currentRound = 1;

    runRound();
    playClick();
}

function selectDifficulty(level) {
    difficulty = level;
    document.querySelectorAll(".difficulty-button").forEach(btn => btn.classList.remove("selected"));
    document.getElementById(`${level}Btn`).classList.add("selected");
    document.getElementById("startBtn").disabled = false;
}

function runRound() {
    const deck = shuffle(DECK);
    yourCard = deck.pop();
    aiPlayers = [];

    for (let i = 0; i < 3; i++) {
        const name = AI_NAMES[i + Math.floor(Math.random() * (AI_NAMES.length - 3))];
        const card = deck.pop();
        aiPlayers.push(createAI(name, card, difficulty));
    }

    document.getElementById("yourCard").innerText = yourCard;
    document.getElementById("bid").value = "";
    document.getElementById("ask").value = "";
    document.getElementById("result").innerHTML = `Round ${currentRound} of ${totalRounds}. Place your quote.`;

    renderAIQuotes();
    updateScoreDisplay();
}

function renderAIQuotes() {
    const list = document.getElementById("aiQuotes");
    list.innerHTML = "";
    aiPlayers.forEach(ai => {
        const li = document.createElement("li");
        li.innerHTML = ai.narration();
        list.appendChild(li);
    });
}

function updateScoreDisplay() {
    document.getElementById("scoreDisplay").innerText = `Score: ${yourScore} | Round ${currentRound}/${totalRounds}`;
}

function submitQuote() {
    const bidInput = document.getElementById("bid").value.trim();
    const askInput = document.getElementById("ask").value.trim();
    const result = document.getElementById("result");

    // ==== Prevent empty or invalid entries ====
    if (bidInput === "" || askInput === "") {
        alert("Please enter both a bid and an ask value.");
        return;
    }

    const bid = Number(bidInput);
    const ask = Number(askInput);

    if (isNaN(bid) || isNaN(ask) || bid >= ask) {
        alert("Please enter valid numbers. Bid must be less than Ask.");
        return;
    }

    playClick();

    // ==== Arbitrage Engine ====
    let roundProfit = 0;
    let arbitrageFound = false;

    // Only count arbitrage if YOUR quote enables it
    aiPlayers.forEach(seller => {
        aiPlayers.forEach(buyer => {
            if (seller.ask < buyer.bid) {
                if (bid <= seller.ask && ask >= buyer.bid) {
                    const profit = buyer.bid - seller.ask;
                    if (profit > roundProfit) {
                        roundProfit = profit;
                        arbitrageFound = true;
                    }
                }
            }
        });
    });

    let output = "";

    if (arbitrageFound) {
        output += `<strong>💰 Arbitrage Opportunity:</strong><br>`;
        output += `Your quote enabled a profitable buy-sell spread.<br>`;
        output += `<strong>Profit:</strong> ${roundProfit}<br><br>`;
        playSuccess();
    } else {
        output += `No arbitrage this round.<br><em>Everyone's playing tight or bluffing well.</em>`;
    }

    // ==== Bluff Feedback ====
    const expected = BASE_EXPECTED_TOTAL - DECK_AVG + yourCard;
    const honestQuote = Math.floor(expected);
    const tooHonest = (bid <= honestQuote - 1 && ask >= honestQuote + 1);

    if (tooHonest) {
        output += `<br><br><strong>⚠️ Feedback:</strong> Your quote closely matches your card. Be careful not to give away your hand.`;
    }

    yourScore += roundProfit;
    result.innerHTML = output;
    updateScoreDisplay();

    if (currentRound < totalRounds) {
        currentRound++;
        setTimeout(runRound, 3000);
    } else {
        setTimeout(showFinalResult, 3500);
    }
}

function showFinalResult() {
    document.getElementById("result").innerHTML = `
    <h3>🏁 Game Over</h3>
    <p>Total Profit: <strong>${yourScore}</strong></p>
    <button onclick="resetGame()">🔁 Play Again</button>
  `;
}

function resetGame() {
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("setup").style.display = "block";
    document.getElementById("playerName").value = "";
    document.querySelectorAll(".difficulty-button").forEach(btn => btn.classList.remove("selected"));
    document.getElementById("startBtn").disabled = true;
    yourScore = 0;
    playClick();
}

function showHint() {
    const expected = BASE_EXPECTED_TOTAL - DECK_AVG + yourCard;
    const bid = Math.floor(expected - 1);
    const ask = Math.floor(expected + 1);

    alert(
        `💡 Hint Based on Your Card (${yourCard})\n\n` +
        `Expected total ≈ ${expected.toFixed(1)}\n` +
        `Neutral quote would be: ${bid}–${ask}\n\n` +
        `You can quote tighter, bluff, or overprice depending on strategy.\nTry to mask your card!`
    );
}

function toggleSound() {
    soundMuted = !soundMuted;
    document.getElementById("muteBtn").innerText = soundMuted ? "🔇 Sound Off" : "🔊 Sound On";
}
