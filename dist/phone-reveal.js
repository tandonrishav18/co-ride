const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function createScrollReveal(containerSelector, offsetProp, travelConfig = {}) {
  const container = document.querySelector(containerSelector);
  if (!container) return null;
  const panel = container.querySelector("section");
  if (!panel) return null;

  return function update() {
    if (reducedMotion.matches) {
      container.style.setProperty(offsetProp, "0");
      return;
    }

    const pinTop = Math.min(0, window.innerHeight - panel.offsetHeight);
    const rect = container.getBoundingClientRect();
    const travelled = pinTop - rect.top;

    const sectionH = panel.offsetHeight;
    const holdBefore = (travelConfig.holdBefore ?? 2) * sectionH;
    const riseDist = (travelConfig.riseDist ?? 2.25) * sectionH;
    const holdAfter = (travelConfig.holdAfter ?? 2) * sectionH;

    if (travelled <= holdBefore) {
      container.style.setProperty(offsetProp, "1");
    } else if (travelled >= holdBefore + riseDist) {
      container.style.setProperty(offsetProp, "0");
    } else {
      const progress = (travelled - holdBefore) / riseDist;
      // Pure harmonic sine easing: silky smooth, perfectly balanced velocity
      const eased = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      const offset = 1 - eased;
      container.style.setProperty(offsetProp, offset.toFixed(4));
    }
  };
}

const updatePhoneReveal = createScrollReveal(".phone-reveal", "--phone-offset");
const updateCommutersReveal = createScrollReveal(".commuters-reveal", "--commuters-offset");

let ticking = false;

function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      if (updatePhoneReveal) updatePhoneReveal();
      if (updateCommutersReveal) updateCommutersReveal();
    });
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });
reducedMotion.addEventListener("change", () => {
  if (updatePhoneReveal) updatePhoneReveal();
  if (updateCommutersReveal) updateCommutersReveal();
});

// Initial calculation on load
if (updatePhoneReveal) updatePhoneReveal();
if (updateCommutersReveal) updateCommutersReveal();
