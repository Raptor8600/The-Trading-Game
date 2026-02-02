// ============ CONFIG ============ //
const DECK = [-10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20];
const DECK_AVG = 7.65;
const BASE_EXPECTED_TOTAL = 61.2;
const AI_NAMES = ["Jeffrey", "Riya", "Marcus", "Samira", "Leo", "Sam", "Avery", "Jimmy", "Todd", "Ella", "Nicole", "Zeke"];

let yourCard = null;
let aiPlayers = [];
let currentRound = 1;
const totalRounds = 5;
let difficulty = "medium";
let yourScore = 0;
let clickSound, successSound;
let soundEnabled = true;

// ============ UTILITIES ============ //
function shuffle(deck) {
    return [...deck].sort(() => Math.random() - 0.5);
}

function playSound(sound) {
    if (soundEnabled && sound) sound.play();
}

// ============ AI GENERATOR ============ //
function createAI(name, card, difficulty) {
    const expected = BASE_EXPECTED_TOTAL - DECK_AVG + card;
    let bluffing = false;
    let bid, ask;

    if (difficulty === "easy") {
        bid = Math.floor(expected - 1);
        ask = Math.floor(expected + 1);
        bluffing = false;
    } else if (difficulty === "hard") {
        bluffing = Math.random() < 0.6; // 60% chance to bluff
        let adjusted = expected;

        if (card <= 5) adjusted += 5;
        if (card >= 13) adjusted -= 5;
        adjusted += (Math.random() - 0.5) * 4;

        if (bluffing) {
            adjusted += (Math.random() < 0.5 ? -6 : 6);
        }

        bid = Math.floor(adjusted - 2);
        ask = Math.floor(adjusted + 2);
    } else {
        // Medium (mix of easy + hard)
        return Math.random() < 0.5
            ? createAI(name, card, "easy")
            : createAI(name, card, "hard");
    }

    return {
        name,
        card,
        bid,
        ask,
        strategy: difficulty,
        bluffing,
        narration() {
            const thoughts = [
                `${name} blurts out ${bid}–${ask}.<br><em>You think: “That was too fast. Are they just playing math?”</em>`,
                `${name} calmly offers ${bid}–${ask}.<br><em>You think: “That tone was suspiciously neutral.”</em>`,
                `${name} smiles and says ${bid}–${ask}.<br><em>Your gut says: “They're trying to bait me.”</em>`,
                `${name} mutters ${bid}–${ask}.<br><em>You wonder: “Did they even look at their card?”</em>`,
                `${name} confidently posts ${bid}–${ask}.<br><em>You note: “Feels a little too confident. Could be a bluff.”</em>`,
                `${name} hesitates, then says ${bid}–${ask}.<br><em>Your instinct: “That hesitation gave them away.”</em>`,
                `${name} shrugs and says ${bid}–${ask}.<br><em>You think: “Nonchalance? Or just randomness?”</em>`,
                `${name} declares ${bid}–${ask}.<br><em>You analyze: “The range is wide. Defensive move?”</em>`,
                `${name} quietly says ${bid}–${ask}.<br><em>You observe: “Feels honest. But maybe that’s the trick.”</em>`
            ];
            return thoughts[Math.floor(Math.random() * thoughts.length)];
        }
    };
}

// ============ GAME FLOW ============ //
function startGame() {
    clickSound = document.getElementById("clickSound");
    successSound = document.getElementById("successSound");

    soundEnabled = true;

    yourScore = 0;
    currentRound = 1;
    document.getElementById("scoreDisplay").innerText = "";
    document.getElementById("difficultySection").style.display = "none";
    document.getElementById("gameArea").style.display = "block";
    runRound();
}

function runRound() {
    const deck = shuffle(DECK);
    yourCard = deck.pop();
    document.getElementById("yourCard").innerText = yourCard;

    aiPlayers = [];
    for (let i = 0; i < 3; i++) {
        const name = AI_NAMES[i % AI_NAMES.length];
        const card = deck.pop();
        aiPlayers.push(createAI(name, card, difficulty));
    }

    renderAIQuotes();
    updateScoreDisplay();
    document.getElementById("result").innerHTML = `Round ${currentRound} of ${totalRounds}. Place your quote.`;
    document.getElementById("bid").value = "";
    document.getElementById("ask").value = "";
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
    playSound(clickSound);
    const bid = Number(document.getElementById("bid").value);
    const ask = Number(document.getElementById("ask").value);
    const result = document.getElementById("result");

    if (isNaN(bid) || isNaN(ask) || bid >= ask) {
        alert("Please enter valid bid and ask values (bid must be less than ask).");
        return;
    }

    const allBids = aiPlayers.map(p => p.bid).concat(bid);
    const allAsks = aiPlayers.map(p => p.ask).concat(ask);
    const highestBid = Math.max(...allBids);
    const lowestAsk = Math.min(...allAsks);

    let output = "";
    let roundProfit = 0;

    if (highestBid > lowestAsk) {
        roundProfit = highestBid - lowestAsk;
        playSound(successSound);
        output += `
      <strong>Arbitrage Found!</strong><br>
      Buy @ ${lowestAsk}, Sell @ ${highestBid}<br>
      <strong>Profit:</strong> ${roundProfit}<br><br>
      <em>You exploited the spread successfully!</em>
    `;
    } else {
        output += `
      No arbitrage this round.<br><br>
      <em>Quotes overlapped. Either no mistake, or bluff too subtle.</em>
    `;
    }

    const expected = BASE_EXPECTED_TOTAL - DECK_AVG + yourCard;
    const honestQuote = Math.floor(expected);
    const tooHonest = (bid <= honestQuote - 1 && ask >= honestQuote + 1);

    if (tooHonest) {
        output += `<br><strong>⚠️ Feedback:</strong> Your quote closely matches your card. Be careful not to give away your value.`;
    }

    // Show bluffing info
    const bluffingAIs = aiPlayers.filter(p => p.bluffing);
    if (bluffingAIs.length > 0) {
        output += `<br><br><strong>🕵️ Bluff Report:</strong><ul>`;
        bluffingAIs.forEach(p => {
            output += `<li>${p.name} was bluffing.</li>`;
        });
        output += `</ul>`;
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
    const result = document.getElementById("result");
    result.innerHTML = `
    <h3>🏁 Game Over</h3>
    <p>Total Profit: <strong>${yourScore}</strong></p>
    <button onclick="startGame()">🔁 Play Again</button>
  `;
}

function showHint() {
    const expected = BASE_EXPECTED_TOTAL - DECK_AVG + yourCard;
    const bid = Math.floor(expected - 1);
    const ask = Math.floor(expected + 1);

    alert(
        `📘 HINT\n\n` +
        `Your card: ${yourCard}\n` +
        `Expected total ≈ ${expected.toFixed(1)}\n` +
        `Neutral quote would be: ${bid}–${ask}\n\n` +
        `You can quote tighter, bluff, or overprice depending on strategy.\nHide your intent!`
    );
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById("soundToggle");
    btn.innerText = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
}

function setDifficulty(level) {
    difficulty = level;
    const buttons = document.querySelectorAll(".diff-btn");
    buttons.forEach(btn => btn.classList.remove("selected"));
    document.getElementById(`${level}Btn`).classList.add("selected");
}
