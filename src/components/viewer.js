/**
 * Viewer overlay — full-screen video modal.
 *
 * Wires up its own DOM elements (present in index.html).
 * The viewer creates its own iframe so tile iframes are never
 * stolen/moved out of their tile context.
 */

const overlay = /** @type {HTMLElement} */ (document.getElementById("viewerOverlay"));
const mediaEl = /** @type {HTMLElement} */ (document.getElementById("viewerMedia"));
const loadingEl = /** @type {HTMLElement} */ (document.getElementById("viewerLoading"));
const titleEl = /** @type {HTMLElement} */ (document.getElementById("viewerTitle"));
const closeBtn = /** @type {HTMLButtonElement} */ (document.getElementById("viewerClose"));

function showLoader() {
  loadingEl.hidden = false;
  loadingEl.removeAttribute("aria-hidden");
}

function hideLoader() {
  loadingEl.hidden = true;
  loadingEl.setAttribute("aria-hidden", "true");
}

function clearViewerMedia() {
  for (const child of Array.from(mediaEl.children)) {
    if (child !== loadingEl) child.remove();
  }
}

/**
 * @param {{ name: string, category: string }} material
 * @param {string} videoUrl
 * @param {string} [videoFilter]
 */
export function openViewer(material, videoUrl, videoFilter) {
  titleEl.textContent = `${material.category} — ${material.name}`;
  clearViewerMedia();
  showLoader();

  const video = document.createElement("video");
  video.src = videoUrl;
  video.controls = true;
  video.autoplay = true;
  video.loop = true;
  video.playsInline = true;
  video.style.width = "100%";
  video.style.height = "100%";
  if (videoFilter) video.style.filter = videoFilter;
  video.addEventListener("canplay", () => hideLoader(), { once: true });
  mediaEl.insertBefore(video, loadingEl);

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

export function closeViewer() {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  clearViewerMedia();
  hideLoader();
  document.body.style.overflow = "";
}

export function isViewerOpen() {
  return overlay.classList.contains("is-open");
}

export function initViewer() {
  closeBtn.addEventListener("click", closeViewer);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeViewer();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isViewerOpen()) closeViewer();
  });
}
