(function () {
  "use strict";
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  function update() {
    frame = 0;
    const scroll = Math.max(0, window.scrollY || 0);
    const length = root.scrollHeight - window.innerHeight;
    root.style.setProperty("--reading-progress", length > 0 ? String(Math.min(1, scroll / length)) : "0");
    root.style.setProperty("--hero-shift", (reduced.matches ? 0 : Math.min(55, scroll * 0.13)) + "px");
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("pageshow", schedule);
  window.addEventListener("pagehide", () => { if (frame) cancelAnimationFrame(frame); frame = 0; });
  reduced.addEventListener?.("change", schedule);
  schedule();
  if (!reduced.matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    document.querySelectorAll(".section-pad, .closing-section").forEach(section => {
      Array.from(section.children).forEach((node, index) => {
        node.classList.add("reveal");
        node.style.setProperty("--reveal-delay", Math.min(index, 3) * 45 + "ms");
        observer.observe(node);
      });
    });
    root.classList.add("motion-ready");
    document.addEventListener("focusin", event => { event.target.closest?.(".reveal")?.classList.add("is-visible"); });
  }
})();
