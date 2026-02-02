==============================
📘 TRADING GAME SIMULATOR
==============================

A browser-based simulation of the real-world Citibank Trading Game — a fast-paced
psychological and mathematical trading challenge based on quoting markets,
bluffing, and exploiting inefficiencies.

Inspired by a true story from a financial autobiography, this game recreates
the moment where mathematical intelligence lost to market intelligence.

────────────────────────────────
🧠 WHAT THIS GAME IS
────────────────────────────────
This is not a traditional “math game”.

It is a simulation of how real traders think:
- Pricing without revealing intent
- Reading other players instead of calculators
- Spotting risk-free opportunities (arbitrage)
- Bluffing when the math alone isn’t enough

In the real event, the winner didn’t know finance —
but he understood games, psychology, and people.

That is the skill this game teaches.

────────────────────────────────
🎴 THE SETUP
────────────────────────────────
• There is a special deck of 17 cards:
  -10, 1 through 15, and 20

• Each round:
  - You receive ONE private card (only you can see it)
  - Three cards are placed face-down in the center
  - Five players total (you + four AI)

• The true market value is the SUM of all 8 cards.

────────────────────────────────
📐 THE MATH (SIMPLE BUT IMPORTANT)
────────────────────────────────
• Average card value ≈ 7.65
• Expected total of 8 cards ≈ 61.2

Your private card shifts that expectation:
- High card → total likely higher
- Low card → total likely lower
- Middle card → uncertainty (perfect for bluffing)

Everyone knows this math.
Winning comes from knowing how others use it.

────────────────────────────────
💬 QUOTING PRICES
────────────────────────────────
You don’t say “I want to buy” or “I want to sell”.

Instead, you quote a TWO-WAY PRICE:
  bid–ask

Example:
  58–60 means:
  - You will BUY at 58
  - You will SELL at 60

Other players choose how to trade against you.

This hides your intent — just like real markets.

────────────────────────────────
💰 HOW YOU MAKE MONEY
────────────────────────────────
You profit when prices don’t line up:

• Buy low from one player
• Sell high to another player

This is called ARBITRAGE.
It is risk-free profit.

Example:
  Player A sells at 52
  Player B buys at 67

You:
  Buy at 52
  Sell at 67
  Profit = 15 (no risk)

This is how the real competition was won.

────────────────────────────────
🧠 BLUFFING & PSYCHOLOGY
────────────────────────────────
Some players quote honestly.
Some hide their card.
Some bluff loudly and confidently.

Pay attention to:
- Tight spreads
- Overconfidence
- Hesitation
- Repeated prices
- Quotes that feel “too clean”

The narration hints at behavior — not certainty.
Just like real trading, nothing is guaranteed.

────────────────────────────────
🎯 GAME FLOW
────────────────────────────────
• The game runs for 5 rounds
• Each round:
  - New cards
  - New quotes
  - New opportunities

• Difficulty modes:
  Easy   → Mostly honest players
  Medium → Mixed styles
  Hard   → Strategic bluffers

• Your score is cumulative profit across rounds.

────────────────────────────────
🔊 FEATURES
────────────────────────────────
• Named AI players with personality
• Narrated market commentary
• Bluff logic (not just flavor text)
• Optional player name
• Difficulty selection
• Sound effects (click / success)
• Mute and volume controls
• Hint system with math explanation
• Tutorial section based on the real story

────────────────────────────────
📂 FILE STRUCTURE
────────────────────────────────
index.html   → Game UI
style.css    → Styling and layout
game.js      → Game logic and AI behavior
click.mp3    → Button click sound
success.mp3  → Profit / success sound

────────────────────────────────
🚀 HOW TO RUN
────────────────────────────────
1. Put all files in the same folder
2. Open index.html in a browser
3. Enable audio if prompted
4. Select difficulty
5. Play

No server required.

OR

Use this URL: https://raptor8600.github.io/The-Trading-Game/

────────────────────────────────
🧭 HOW TO PLAY (REAL EXAMPLE)
────────────────────────────────
Let’s say your card is **15** (very high). You expect the total market value to be high.

You look at the other players’ quotes:

• Todd: 59–63 → Seems steady, might be bluffing
• Marcus: 41–45 → Honest or weak card
• Sam: 64–68 → Strong quote, maybe not bluffing

🎯 What’s the move?

You can:
- **Buy from Marcus at 45** (his ask)
- **Sell to Sam at 64** (his bid)

That’s an **arbitrage** profit of 19 points.

✅ Your quote should be:
  • Bid: 45 (so Marcus will sell to you)
  • Ask: 64 (so Sam will buy from you)

Put in:
  45–64

Then click **Submit Quote**.

If the game is working, you’ll win this round and see your profit.

💡 Remember:
  • Bluffing works both ways — some AI will fake confidence.
  • Use the Hint button to explain the math.
  • Watch the quotes and match them to the narration.

Practice makes perfect.


────────────────────────────────
📖 FINAL NOTE
────────────────────────────────
This game is not about being right.
It’s about being right when others are wrong —
and knowing when others *think* they’re right.

That’s trading.
