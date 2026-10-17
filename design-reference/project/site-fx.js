// Shared page effects — scroll entrances + reading progress (long-form pages).
export function armAnim(host) {
  if (!host._io) {
    host._io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) reveal(host, e.target);
    }), { threshold: 0.12 });
  }
  document.querySelectorAll('[data-anim]').forEach(el => {
    if (el.dataset.animArmed) return;
    el.dataset.animArmed = '1';
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.95) {
      el.style.opacity = '0'; el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 450ms cubic-bezier(.16,1,.3,1),transform 450ms cubic-bezier(.16,1,.3,1)';
      host._io.observe(el);
      setTimeout(() => reveal(host, el), 4000); // safety: never leave content hidden
    }
  });
}
function reveal(host, el) {
  el.style.opacity = '1'; el.style.transform = 'none';
  if (host._io) host._io.unobserve(el);
}
export function disarmAnim(host) { if (host._io) host._io.disconnect(); }
export function readingProgress() {
  if (document.getElementById('om-progress')) return;
  const bar = document.createElement('div');
  bar.id = 'om-progress';
  Object.assign(bar.style, { position: 'fixed', left: '0', top: '0', width: '4px', height: '0%', background: 'var(--accent-primary)', zIndex: '99', pointerEvents: 'none' });
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const d = document.documentElement;
    bar.style.height = (d.scrollTop / ((d.scrollHeight - d.clientHeight) || 1) * 100) + '%';
  }, { passive: true });
}
