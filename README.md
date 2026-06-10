```text
 =========================================================
  ██████╗ ███╗   ██╗ █████╗ ██╗  ██╗███████╗
 ██╔════╝ ████╗  ██║██╔══██╗██║ ██╔╝██╔════╝
 ╚█████╗  ██╔██╗ ██║███████║█████═╝ █████╗  
  ╚═══██╗ ██║╚██╗██║██╔══██║██╔═██╗ ██╔══╝  
 ██████╔╝ ██║ ╚████║██║  ██║██║  ██╗███████╗
 ╚═════╝  ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
  ██████╗ ███████╗████████╗██████╗  ██████╗ 
  ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗
  ██████╔╝█████╗     ██║   ██████╔╝██║   ██║
  ██╔══██╗██╔══╝     ██║   ██╔══██╗██║   ██║
  ██║  ██║███████╗   ██║   ██║  ██║╚██████╔╝
  ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ 
 =========================================================
```

# Retro Snake Game

A classic retro-styled snake game built with modern web technologies. This project was developed with an emphasis on recreating an authentic "CRT" arcade experience while ensuring smooth performance across both desktop and mobile devices.

## Features

* **Multiple Themes & Maps:** Choose between Neon Grid, Volcanic Lava, and Mountain Greenery map styles, each with their own unique obstacle layouts and retro color palettes.
* **Customization:** Pick from 6 different retro-inspired skins for your snake.
* **Difficulty Scaling:** 3 difficulty levels (Easy, Normal, Hard) that adjust the base moving speed. The snake also speeds up progressively as your score increases!
* **Mobile Ready:** Integrated touch controls with swipe detection for seamless gameplay on smartphones and tablets.
* **Audio Engine:** Custom-built 8-bit sound effects (eating, game over, background sequence) using the Web Audio API, with a global mute toggle.
* **Authentic CRT Filter:** A CSS-driven scanline and flicker effect overlay simulating vintage arcade monitors.

## Controls

* **Desktop:** Use `W`, `A`, `S`, `D` or the `Arrow Keys` to change directions.
* **Mobile:** Swipe Up, Down, Left, or Right anywhere on the screen.
* **Sound:** Toggle sound using the *AUDIO: ON/OFF* button in the bottom right corner.

## Getting Started

To run this project locally:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production (e.g., Netlify Deployment):**
   ```bash
   npm run build
   ```

## Tech Stack

* **Frontend:** React 19, TypeScript
* **Styling:** Tailwind CSS (v4)
* **Rendering:** HTML5 `<canvas>` API
* **Audio:** Native Web Audio API
* **Build Tool:** Vite

## Assignment Report Guidelines

This project was generated iteratively via an AI coding platform as part of an assignment. If you are preparing your report, make sure to document:
1.  **Prompt iterations:** How the requirements evolved (adding maps, audio, difficulty, mobile touch swipe support).
2.  **What worked well:** Modular structure (separating config, canvas logic, and UI).
3.  **Challenges faced:** Tuning map obstacle placements and implementing mobile swipe handlers that don't interfere with page scrolling (fixed by setting `overscroll-behavior: none;` and `touch-action: none` / `e.preventDefault()`).
