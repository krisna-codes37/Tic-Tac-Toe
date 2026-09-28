# Tic-Tac-Toe

A polished, responsive **Tic-Tac-Toe game** built with vanilla HTML, CSS, and JavaScript. The project combines classic gameplay with a neon, developer-tool-inspired interface, AI opponents, tournament scoring, local persistence, sound effects, and animated particles.

## Live Project

**Repository:** https://github.com/krisna-codes37/Tic-Tac-Toe

You can also run the project locally by opening `index.html` in a modern browser.

## Features

- **Human vs Human** gameplay
- **Human vs AI** gameplay
- Three AI difficulty levels:
  - **Easy** — chooses a random available move
  - **Hard** — prioritizes winning and blocking moves, then selects randomly
  - **Impossible** — uses **Minimax** to choose optimal moves
- **Best-of-3, Best-of-5, and Best-of-7** tournament modes
- Automatic **round and tournament scoring**
- Alternates the starting player between rounds
- **Winner highlighting** on the board
- **Champion popup** when a tournament is won
- **Last 5 winners** history
- Game and tournament state persisted with **localStorage**
- Responsive layout for desktop, tablet, and mobile screens
- Animated **tsParticles** background
- Interactive mouse-based background lighting
- Click, win, and draw sound effects
- Fallback Web Audio tones when external sound playback is unavailable
- No backend or database required

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and game UI |
| CSS3 | Responsive layout, animations, gradients, glassmorphism-style cards, and visual effects |
| JavaScript (ES6+) | Game logic, state management, AI, tournament flow, persistence, and UI interactions |
| localStorage | Persistent scores, round state, starting player, and winner history |
| tsParticles | Animated particle background |
| Google Fonts | Orbitron and Press Start 2P typography |

## How the Game Works

### 1. Match Setup

Enter player names, choose the game mode, select an AI difficulty when applicable, and choose the tournament length.

Click **Start Match** to begin a new tournament.

### 2. Playing a Round

Players take turns placing **X** and **O** on the 3×3 board.

The game checks for the standard eight winning combinations:

- Three rows
- Three columns
- Two diagonals

A completed line wins the round. If every cell is filled without a winner, the round ends in a draw.

### 3. Tournament System

The target score depends on the selected format:

- Best of 3 → first player to **2 wins**
- Best of 5 → first player to **3 wins**
- Best of 7 → first player to **4 wins**

The first player to reach the required number of round wins becomes the tournament champion.

## AI Implementation

The AI is implemented entirely in `script.js`.

### Easy

The AI selects a random empty cell. This mode is intended for casual play and testing.

### Hard

The AI follows a lightweight tactical strategy:

1. Take a winning move when available.
2. Block the human player's winning move when necessary.
3. Otherwise choose a random available cell.

### Impossible

The AI uses the **Minimax algorithm** to evaluate possible future game states and select an optimal move. Random selection is used only when multiple moves have the same optimal score, so games can still feel less repetitive.

## State Persistence

The game uses the browser's `localStorage` API to preserve:

- Player X score
- Player O score
- Current round number
- Starting player
- Last five tournament winners

This allows the relevant tournament information to survive a page refresh.

## Project Structure

```text
Tic-Tac-Toe/
├── index.html
├── style.css
├── script.js
└── README.md
```

### File Responsibilities

**`index.html`**
- Defines the application structure
- Contains player setup controls
- Contains the 3×3 board
- Contains score and round panels
- Contains winner/history modals
- Loads fonts, tsParticles, styles, and the game script

**`style.css`**
- Defines the visual theme
- Handles responsive layouts
- Styles the board, controls, scoreboard, and modals
- Provides hover effects, winner animations, and background effects

**`script.js`**
- Manages game state
- Handles player turns and board updates
- Detects winners and draws
- Runs tournament logic
- Implements Easy, Hard, and Minimax AI
- Stores and restores persistent state
- Manages sound effects, popups, and winner history

## Getting Started

### Prerequisites

No package manager, build tool, server, or database is required.

A modern web browser such as Chrome, Edge, Firefox, or Safari is enough.

### Run Locally

Clone the repository:

```bash
git clone https://github.com/krisna-codes37/Tic-Tac-Toe.git
cd Tic-Tac-Toe
```

Then open `index.html` in your browser.

For a smoother development workflow, you can also serve the directory with any simple local HTTP server.

For example, with VS Code, install **Live Server**, open the project folder, and launch `index.html` with Live Server.

## Deployment

Because this project is a static frontend application, it can be deployed easily on services such as:

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

No server-side configuration is needed.

## External Resources

The project references a few browser-loaded external assets:

- **Google Fonts** for typography
- **jsDelivr** for the tsParticles library
- **Google-hosted sound files** for game feedback audio

An internet connection may therefore be required for the full visual/audio experience. Core Tic-Tac-Toe gameplay itself runs in the browser.

## Design Highlights

The interface uses a dark, neon-inspired visual system with:

- Glass-like panels
- Purple and cyan accent gradients
- Developer-console-inspired typography
- Animated background particles
- Hover and winner animations
- Responsive single-column layouts on smaller screens

The UI is designed to keep the gameplay central while making the project visually distinctive enough for a portfolio or GitHub showcase.

## Learning Outcomes

This project demonstrates practical frontend fundamentals including:

- DOM manipulation
- Event listeners
- JavaScript state management
- Conditional game logic
- Array-based board representation
- Algorithmic game solving with Minimax
- Local storage persistence
- Responsive CSS
- Browser audio APIs
- Integration of a third-party frontend library

## Possible Future Improvements

Some natural next steps for the project could include:

- Online multiplayer using WebSockets
- Persistent user profiles and cloud-based match history
- Leaderboards and statistics
- Custom board themes
- Accessibility improvements such as keyboard-first gameplay and stronger screen-reader semantics
- More advanced AI difficulty tuning
- Match replay and move history
- Progressive Web App support

## Screenshots

Add project screenshots here to make the GitHub page more visual:

```md
![Game UI](./screenshots/game-ui.png)
```

Recommended screenshots:
- Main game screen
- Human vs AI setup
- Impossible AI gameplay
- Tournament champion popup
- Last 5 winners history

## Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test the game in a modern browser.
5. Open a pull request with a clear description of the changes.

## License

No license file is currently included in the repository. Add a license if you plan to define explicit reuse and distribution terms.

---

Built with HTML, CSS, and JavaScript by **Krishna Mandal**.
