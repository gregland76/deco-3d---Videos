/**
 * Tile component.
 *
 * Renders an article card with:
 *  - A static thumbnail (visible by default)
 *  - A hidden .media-preload container (populated by hydration.js via IntersectionObserver)
 *  - A play-button indicator that fades on hover
 *  - CSS hover: thumbnail fades out, preloaded iframe fades in → instant video playback
 */
import { buildVideoUrl, buildThumbUrl, pickRandomVideoId } from "../data.js";
import { escapeHtml } from "../utils.js";
import { registerForPreload } from "../hydration.js";

/**
 * @param {{ id: string, name: string, category: string, subgroup?: string }} material
 * @param {{ onOpenViewer: (material: object, videoUrl: string) => void }} options
 * @returns {HTMLElement}
 */
export function createTile(material, { onOpenViewer }) {
  const videoId = pickRandomVideoId();
  const videoUrl = buildVideoUrl(videoId);
  const subgroup = material.subgroup ?? "Autres";

  const tile = document.createElement("article");
  tile.className = "tile";
  tile.innerHTML = `
    <div class="media">
      <img
        class="media-thumb"
        alt="Apercu ${escapeHtml(material.name)}"
        src="${buildThumbUrl(videoId)}"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
      <div class="media-preload" aria-hidden="true"></div>
      <div class="media-play" aria-hidden="true"></div>
      <footer class="tile-info">
        <p class="tile-name" tabindex="0" role="button">${escapeHtml(material.name)}</p>
        <p class="tile-meta">${escapeHtml(material.category)} · ${escapeHtml(subgroup)}</p>
      </footer>
    </div>
  `;

  const nameEl = tile.querySelector(".tile-name");

  function open() {
    onOpenViewer(material, videoUrl);
  }

  nameEl.addEventListener("click", open);
  nameEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });

  registerForPreload(tile, videoUrl, material.name);

  return tile;
}
