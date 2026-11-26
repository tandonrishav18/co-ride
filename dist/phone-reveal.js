const reveal = document.querySelector(".phone-reveal");
const panel = reveal.querySelector("section");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let frame = 0;
const revealDelay = 2000;
const riseDuration = 600;
const holdDuration = 1000;
let startedAt = null;
let lastTravel = 0;
let lastDownAt = null;
let heldScrollTime = 0;
let extension = 0;

function positionPhone(now = performance.now()) {
  frame = 0;
  if (reducedMotion.matches) return;
  const distance = reveal.clientWidth * (0.96 - 832 / 1440);
  const pinTop = Math.min(0, document.documentElement.clientHeight - panel.offsetHeight);
  const travelled = Math.max(0, pinTop - reveal.getBoundingClientRect().top);
  if (travelled === 0) startedAt = null;
  else if (startedAt === null) startedAt = now;

  const elapsed = startedAt === null ? 0 : now - startedAt;
  const rise = Math.min(1, Math.max(0, (elapsed - revealDelay) / riseDuration));
  const progress = Math.min(travelled / distance, rise);
  if (progress < 1) {
    lastDownAt = null;
    heldScrollTime = 0;
  } else if (travelled < lastTravel) {
    lastDownAt = null;
  } else if (travelled > lastTravel && heldScrollTime < holdDuration) {
    // Count consecutive downward scroll samples, excluding pauses between gestures.
    const interval = lastDownAt === null ? 0 : now - lastDownAt;
    heldScrollTime += interval <= 160 ? interval : 16;
    lastDownAt = now;
  }
  // Retain the consumed distance on release so the next scroll moves the panel smoothly.
  if (heldScrollTime < holdDuration) extension = Math.max(0, travelled - distance);
  lastTravel = travelled;
  reveal.style.setProperty("--pin-extension", extension + "px");
  reveal.style.setProperty("--phone-offset", (1 - progress) * 100 + "%");
  if (startedAt !== null && rise < 1) scheduleUpdate();
}

function scheduleUpdate() {
  if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(positionPhone);
}

function configureReveal() {
  startedAt = null;
  lastTravel = 0;
  lastDownAt = null;
  heldScrollTime = 0;
  extension = 0;
  reveal.classList.toggle("is-active", !reducedMotion.matches);
  positionPhone();
}

configureReveal();
reducedMotion.addEventListener("change", configureReveal);
addEventListener("scroll", scheduleUpdate, { passive: true });
addEventListener("resize", scheduleUpdate);
addEventListener("pageshow", scheduleUpdate);
