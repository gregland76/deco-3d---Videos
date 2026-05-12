/**
 * Video preloading strategy.
 *
 * Each tile holds a hidden `.media-preload` container. When the tile enters
 * the viewport (with a generous rootMargin), an autoplay iframe is injected
 * into that container. CSS then reveals it on hover so the video starts
 * playing instantly — no wait, no click needed.
 */

// ─── Host warm-up ─────────────────────────────────────────────────────────────

/** No-op : les vidéos sont locales, aucun préconnect réseau nécessaire. */
export function warmupVideoHosts() {}

// ─── Preload queue + observer ─────────────────────────────────────────────────

/** @type {{ tile: HTMLElement, videoUrl: string, title: string }[]} */
const preloadQueue = [];
let preloadObserver = null;

/**
 * Register a tile so it is preloaded when it nears the viewport.
 * @param {HTMLElement} tile
 * @param {string} videoUrl
 * @param {string} title
 */
export function registerForPreload(tile, videoUrl, title) {
  preloadQueue.push({ tile, videoUrl, title });
}

/** Clear the queue and disconnect any active observer (call before re-rendering). */
export function resetPreloadQueue() {
  preloadQueue.length = 0;
  if (preloadObserver) {
    preloadObserver.disconnect();
    preloadObserver = null;
  }
}

/**
 * Inject the autoplay iframe into a tile's hidden preload container.
 * @param {HTMLElement} tile
 * @param {string} videoUrl
 * @param {string} title
 */
function doPreload(tile, videoUrl, title) {
  if (tile.dataset.preloaded === "1") return;
  const video = tile.querySelector(".media-thumb");
  if (!video) return;

  video.src = videoUrl;
  video.play().catch(() => {});
  tile.dataset.preloaded = "1";
}

/**
 * Start watching registered tiles with IntersectionObserver.
 * Tiles within 500px of the viewport get their iframe preloaded.
 * Call this after all tiles for the current render have been registered.
 */
export function startPreloadObserver() {
  if (preloadObserver) preloadObserver.disconnect();

  preloadObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const tile = entry.target;
        const payload = preloadQueue.find((item) => item.tile === tile);
        if (!payload) continue;
        doPreload(payload.tile, payload.videoUrl, payload.title);
        preloadObserver.unobserve(tile);
      }
    },
    { root: null, rootMargin: "500px 0px", threshold: 0 },
  );

  for (const item of preloadQueue) {
    preloadObserver.observe(item.tile);
  }
}
