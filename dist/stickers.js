const stickerSection = document.querySelector(".sticker-section");

if (stickerSection) {
  const stickers = Array.from(stickerSection.children).filter(layer => layer.querySelector("img"));
  stickers.forEach(layer => layer.classList.add("sticker"));
  stickerSection.classList.add("stickers-ready");

  function assignPopupTimes() {
    const order = [...stickers];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    let delay = 0;
    for (const sticker of order) {
      sticker.style.setProperty("--popup-delay", delay + "ms");
      delay += 60 + Math.round(Math.random() * 35);
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      stickerSection.classList.remove("stickers-playing");
    } else if (!stickerSection.classList.contains("stickers-playing")) {
      assignPopupTimes();
      stickerSection.classList.add("stickers-playing");
    }
  }, { threshold: 0 });

  observer.observe(stickerSection);
}
