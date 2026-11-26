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
    const travelled = pinTop - revealRect.top;

    const sectionH = panel.offsetHeight;
    const holdBefore = 2 * sectionH;      // 2 sections delay before rising
    const riseDist = 1.25 * sectionH;     // smooth, slow rise distance
    const holdAfter = 2 * sectionH;       // 2 sections delay after complete appearance

    if (travelled <= holdBefore) {
      // Phase 1: Initial delay of 2 sections - mockup is hidden
      reveal.style.setProperty("--phone-offset", "100%");
    } else if (travelled >= holdBefore + riseDist) {
      // Phase 3 & 4: Final delay of 2 sections & exit - mockup completely in place
      reveal.style.setProperty("--phone-offset", "0%");
    } else {
      // Phase 2: Mockup rises slowly and smoothly
      const progress = (travelled - holdBefore) / riseDist;
      const eased = smoothstep(progress);
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
