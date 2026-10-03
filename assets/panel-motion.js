/* Cursor depth for the home panels. The garden hero has its own choreography. */
(() => {
  'use strict';
  const home = document.querySelector('#screen-home');
  if (!home) return;
  const root = document.documentElement;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const panels = new WeakMap();
  const moving = new Set();
  const groups = [
    ['.kr-collections .coll-card, .kr-material-grid>figure, .kr-project-grid>article, #home-settings .set-card', 'image'],
    ['.kr-pool-frame, .kr-catalog-frame, .kr-facility-frame', 'scene'],
    ['.kr-points>div, .kr-catalog-copy', 'text']
  ];
  const strength = {
    image: { tilt: 8, lift: 7, depth: 7 },
    scene: { tilt: 5, lift: 4, depth: 6 },
    text: { tilt: 3, lift: 3, depth: 2.5 }
  };
  const properties = ['rx', 'ry', 'lift', 'image-x', 'image-y', 'content-x', 'content-y', 'light-x', 'light-y', 'light-opacity', 'shadow-x', 'shadow-y', 'shadow-opacity'];
  let hovered = null, frame = 0, lastTime = 0;
  const enabled = () => root.classList.contains('kr-motion-on') && fine.matches && !reduced.matches && !home.hidden && !document.hidden;
  let wasEnabled = enabled();
  const clamp = v => Math.max(-1, Math.min(1, v));

  function register() {
    // Only these home grids are dynamic; never wrap or replace a click target.
    groups.forEach(([selector, type]) => home.querySelectorAll(selector).forEach(el => {
      if (el.closest('.kr-hero') || panels.has(el)) return;
      el.dataset.krPanel = type;
      panels.set(el, { el, type, x: 0, y: 0, a: 0, vx: 0, vy: 0, va: 0, tx: 0, ty: 0, ta: 0, bounds: null });
    }));
    for (const panel of moving) if (!panel.el.isConnected) clear(panel);
    if (hovered && !hovered.el.isConnected) hovered = null;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function clear(panel) {
    panel.el.classList.remove('kr-panel-engaged');
    properties.forEach(name => panel.el.style.removeProperty(`--kr-panel-${name}`));
    ['x', 'y', 'a', 'vx', 'vy', 'va', 'tx', 'ty', 'ta'].forEach(key => { panel[key] = 0; });
    moving.delete(panel);
  }
  function release() {
    if (!hovered) return;
    hovered.tx = hovered.ty = hovered.ta = 0;
    moving.add(hovered);
    hovered = null;
    schedule();
  }
  function reset() {
    if (hovered) clear(hovered);
    hovered = null;
    if (frame) cancelAnimationFrame(frame);
    frame = lastTime = 0;
    for (const panel of moving) clear(panel);
  }
  function sync() {
    const next = enabled();
    if (next !== wasEnabled || !next) reset();
    wasEnabled = next;
  }
  function spring(panel, key, target, dt) {
    const velocity = `v${key}`;
    panel[velocity] += ((target - panel[key]) * 180 - panel[velocity] * 23) * dt;
    panel[key] += panel[velocity] * dt;
  }
  function paint(time) {
    frame = 0;
    if (!enabled()) { reset(); return; }
    const dt = Math.min(.032, (time - (lastTime || time - 16)) / 1000);
    lastTime = time;
    for (const panel of moving) {
      if (!panel.el.isConnected) { clear(panel); continue; }
      spring(panel, 'x', panel.tx, dt);
      spring(panel, 'y', panel.ty, dt);
      spring(panel, 'a', panel.ta, dt);
      const s = strength[panel.type], a = Math.max(0, Math.min(1, panel.a));
      const values = {
        rx: `${(-panel.y * s.tilt).toFixed(3)}deg`, ry: `${(panel.x * s.tilt).toFixed(3)}deg`,
        lift: `${(-a * s.lift).toFixed(3)}px`,
        'image-x': `${(-panel.x * s.depth).toFixed(3)}px`, 'image-y': `${(-panel.y * s.depth).toFixed(3)}px`,
        'content-x': `${(panel.x * s.depth * .6).toFixed(3)}px`, 'content-y': `${(panel.y * s.depth * .6).toFixed(3)}px`,
        'light-x': `${(50 + panel.x * 38).toFixed(2)}%`, 'light-y': `${(50 + panel.y * 38).toFixed(2)}%`,
        'light-opacity': (a * (panel.type === 'text' ? .10 : .22)).toFixed(3),
        'shadow-x': `${(-panel.x * 12).toFixed(2)}px`, 'shadow-y': `${(a * 20 - panel.y * 6).toFixed(2)}px`,
        'shadow-opacity': (a * .15).toFixed(3)
      };
      Object.entries(values).forEach(([name, value]) => panel.el.style.setProperty(`--kr-panel-${name}`, value));
      const settled = Math.abs(panel.tx - panel.x) + Math.abs(panel.ty - panel.y) + Math.abs(panel.ta - panel.a) + Math.abs(panel.vx) + Math.abs(panel.vy) + Math.abs(panel.va) < .002;
      if (settled) {
        moving.delete(panel);
        if (!panel.ta) clear(panel);
      }
    }
    if (moving.size) schedule();
    else lastTime = 0;
  }
  home.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType === 'touch' || event.buttons) return;
    const el = event.target.closest('[data-kr-panel]');
    if (!el || !home.contains(el) || el.closest('[data-kr-reveal]:not(.kr-revealed)')) { release(); return; }
    const panel = panels.get(el);
    if (!panel) return;
    if (hovered !== panel) {
      release();
      // Measure the neutral box once, avoiding feedback from a tilted face.
      el.classList.remove('kr-panel-engaged');
      panel.bounds = el.getBoundingClientRect();
      hovered = panel;
      el.classList.add('kr-panel-engaged');
    }
    panel.tx = clamp((event.clientX - panel.bounds.left) / panel.bounds.width * 2 - 1);
    panel.ty = clamp((event.clientY - panel.bounds.top) / panel.bounds.height * 2 - 1);
    panel.ta = 1;
    moving.add(panel); schedule();
  }, { passive: true });
  home.addEventListener('pointerleave', release);
  home.addEventListener('pointercancel', release);
  home.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') reset(); });
  // Scrolling changes a card's position under the cursor. Let it settle before
  // measuring again; never intercept wheel, touch, clicks or keyboard focus.
  addEventListener('scroll', release, { passive: true });
  addEventListener('resize', reset, { passive: true });
  addEventListener('blur', reset);
  addEventListener('hashchange', reset);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('keydown', event => { if (event.key === 'Tab') reset(); });
  fine.addEventListener('change', sync);
  reduced.addEventListener('change', sync);
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(sync).observe(home, { attributes: true, attributeFilter: ['hidden'] });
  const contentObserver = new MutationObserver(register);
  ['#home-collections', '#home-settings', '#home-projects-grid'].forEach(selector => {
    const grid = home.querySelector(selector);
    if (grid) contentObserver.observe(grid, { childList: true });
  });
  register();
})();
