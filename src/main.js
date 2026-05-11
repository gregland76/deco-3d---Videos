/**
 * Application entry point.
 * Import order matters: styles first, then logic.
 */
import "./styles.css";
import { warmupVideoHosts } from "./hydration.js";
import { initViewer } from "./components/viewer.js";
import { renderBoard, initControls } from "./components/board.js";
import { materials } from "./data.js";

// Seed the static "total" counter before first render so it is never 0.
document.getElementById("totalMaterialsCount").textContent = String(materials.length);

warmupVideoHosts();
initViewer();
initControls();
renderBoard();
