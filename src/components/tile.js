/**
 * Tile component.
 *
 * Renders an article card with:
 *  - A static thumbnail (visible by default)
 *  - A hidden .media-preload container (populated by hydration.js via IntersectionObserver)
 *  - A play-button indicator that fades on hover
 *  - CSS hover: thumbnail fades out, preloaded iframe fades in → instant video playback
 */
import { buildVideoUrl, pickRandomVideo } from "../data.js";
import { escapeHtml } from "../utils.js";
import { registerForPreload } from "../hydration.js";

const VIDEO_FILTERS = [
  "hue-rotate(0deg)   saturate(3)   brightness(0.9)",   // rouge vif
  "hue-rotate(200deg) saturate(3)   brightness(0.85)",  // bleu profond
  "hue-rotate(150deg) saturate(3)   brightness(0.85)",  // teal intense
  "hue-rotate(270deg) saturate(3)   brightness(0.85)",  // violet fort
  "hue-rotate(30deg)  saturate(3)   brightness(0.9)",   // orange brûlé
  "hue-rotate(100deg) saturate(3)   brightness(0.85)",  // vert vif
  "hue-rotate(180deg) saturate(3)   brightness(0.85)",  // cyan fort
  "hue-rotate(300deg) saturate(3)   brightness(0.85)",  // rose fuchsia
];

/**
 * @param {{ id: string, name: string, category: string, subgroup?: string }} material
 * @param {{ onOpenViewer: (material: object, videoUrl: string) => void }} options
 * @returns {HTMLElement}
 */
export function createTile(material, { onOpenViewer }) {
  const videoUrl = buildVideoUrl(pickRandomVideo());
  const filter = VIDEO_FILTERS[Math.floor(Math.random() * VIDEO_FILTERS.length)];
  const subgroup = material.subgroup ?? "Autres";

  const tile = document.createElement("article");
  tile.className = "tile";
  tile.innerHTML = `
    <div class="media">
      <video
        class="media-thumb"
        style="filter:${filter}"
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
      ></video>
      <div class="media-play" aria-hidden="true"></div>
      <footer class="tile-info">
        <p class="tile-name" tabindex="0" role="button">${escapeHtml(material.name)}</p>
        <p class="tile-meta">${escapeHtml(material.category)} · ${escapeHtml(subgroup)}</p>
      </footer>
    </div>
  `;

  tile.dataset.videoFilter = filter;

  registerForPreload(tile, videoUrl, material.name);

  const nameEl = tile.querySelector(".tile-name");

  function open() {
    onOpenViewer(material, videoUrl, filter);
  }

  nameEl.addEventListener("click", open);
  nameEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  return tile;
}
