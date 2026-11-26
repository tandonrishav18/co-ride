const reveal = document.querySelector(".phone-reveal");
const panel = reveal ? reveal.querySelector("section") : null;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

if (reveal && panel) {
  let ticking = false;

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function update() {
    ticking = false;
    if (reducedMotion.matches) {
      reveal.style.setProperty("--phone-offset", "0%");
      return;
    }

    const pinTop = Math.min(0, window.innerHeight - panel.offsetHeight);
    const revealRect = reveal.getBoundingClientRect();
    const distance = reveal.offsetHeight - panel.offsetHeight;

    if (distance <= 0) {
      reveal.style.setProperty("--phone-offset", "0%");
      return;
    }

    const travelled = pinTop - revealRect.top;

    if (travelled <= 0) {
      reveal.style.setProperty("--phone-offset", "100%");
    } else if (travelled >= distance) {
      reveal.style.setProperty("--phone-offset", "0%");
    } else {
      const progress = travelled / distance;
      // Reveal smoothly across the first 75% of pinned scroll; hold fully revealed for remaining 25%
      const revealProgress = Math.min(1, progress / 0.75);
      const eased = smoothstep(revealProgress);
      const offset = (1 - eased) * 100;
      reveal.style.setProperty("--phone-offset", offset.toFixed(2) + "%");
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  reducedMotion.addEventListener("change", update);

  update();
}
