/* Scroll-linked garden choreography; native scrolling is the source of truth. */
(() => {
  'use strict';
  const root = document.documentElement;
  const home = document.querySelector('#screen-home');
  if (!home) return;
  const hero = home.querySelector('.kr-hero');
  const stage = home.querySelector('.kr-hero-stage');
  const photo = home.querySelector('.kr-garden-photo');
  const furniture = home.querySelector('.kr-furniture-layer');
  const copy = home.querySelector('.kr-hero-copy');
  const plants = [...home.querySelectorAll('.kr-botanical')];
  const curve = home.querySelector('.kr-curve');
  const programme = home.querySelector('.kr-programme');
  const programmeStage = home.querySelector('.kr-programme-stage');
  const rail = home.querySelector('.kr-collection-window');
  const track = home.querySelector('#home-collections');
  const progressBar = home.querySelector('.kr-collection-progress');
  const indexLabel = home.querySelector('.kr-collection-index');
  const stepButtons = [...home.querySelectorAll('[data-collection-step]')];
  const toggle = document.querySelector('.kr-motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const desktop = matchMedia('(min-width: 1000px) and (min-height: 760px)');
  const clamp = v => Math.max(0, Math.min(1, v));
  const ease = v => { v = clamp(v); return v * v * (3 - 2 * v); };
  let paused = false;
  try { paused = localStorage.getItem('kordia-motion') === 'paused'; } catch {}
  let active = !paused && !reduced.matches;
  let frame = 0, lastTime = 0, heroProgress = 0, pointerX = 0, pointerY = 0;
  let currentX = 0, currentY = 0, railTravel = 0, railDistance = 0;
  let headerHeight = 88, imageFrames = [], observer;
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function measure() {
    headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    programme.classList.remove('kr-horizontal');
    programme.style.removeProperty('--kr-travel-height');
    rail.scrollLeft = 0; railTravel = railDistance = 0;
    if (active && desktop.matches && !home.hidden) {
      programme.classList.add('kr-horizontal');
      // Zoom, tall text and translations must never be trapped in a clipped pin.
      if (programmeStage.offsetHeight > innerHeight - headerHeight - 8) {
        programme.classList.remove('kr-horizontal');
      } else {
        railTravel = Math.max(0, rail.scrollWidth - rail.clientWidth);
        railDistance = railTravel * 1.15;
        programme.style.setProperty('--kr-travel-height', `${programmeStage.offsetHeight + railDistance}px`);
      }
    }
    imageFrames = [...home.querySelectorAll('.kr-material-frame, .kr-pool-frame, .kr-catalog-frame')];
    schedule();
  }
  function paint(time) {
    frame = 0;
    if (document.hidden || home.hidden || !active) return;
    const dt = Math.min(64, time - (lastTime || time - 16)); lastTime = time;
    const blend = 1 - Math.exp(-dt / 105);
    const rect = hero.getBoundingClientRect();
    const onStage = rect.bottom > headerHeight && rect.top < innerHeight;
    root.classList.toggle('kr-scene-idle', !onStage);
    let unsettled = false;
    if (onStage) {
      const target = clamp((headerHeight - rect.top) / Math.max(1, rect.height - stage.offsetHeight));
      heroProgress += (target - heroProgress) * blend;
      currentX += (pointerX - currentX) * blend; currentY += (pointerY - currentY) * blend;
      const p = ease(heroProgress);
      const fade = 1 - ease((heroProgress - .12) / .48);
      photo.style.transform = `translate3d(${currentX * -5}px, ${p * -24 + currentY * -3}px, 0) scale(${1.025 + p * .075})`;
      furniture.style.transform = `translate3d(${currentX * -14}px, ${p * -42 + currentY * -6}px, 0) scale(${1.025 + p * .18})`;
      copy.style.transform = `translate3d(${currentX * 6}px, ${p * (innerWidth < 701 ? -100 : -190)}px, 0)`;
      copy.style.opacity = fade;
      copy.inert = fade < .05;
      plants.forEach((el, i) => { el.style.transform = `translate3d(${currentX * (i ? -23 : -30) + p * (i ? 34 : -34)}px, ${p * -60 + currentY * -9}px, 0) scale(${1 + p * .17})`; });
      unsettled = Math.abs(target - heroProgress) > .0003 || Math.abs(pointerX - currentX) + Math.abs(pointerY - currentY) > .002;
    }
    const pr = programme.getBoundingClientRect();
    const opening = ease((innerHeight - curve.parentElement.getBoundingClientRect().top) / (innerHeight * .8));
    curve.style.transform = `scaleY(${1 - opening * .96})`;
    if (railDistance) {
      const p = clamp((headerHeight - pr.top) / railDistance);
      rail.scrollLeft = p * railTravel;
      progressBar.style.setProperty('--kr-rail-progress', .12 + p * .88);
      indexLabel.textContent = `${String(Math.min(6, 1 + Math.round(p * 5))).padStart(2, '0')} / 06`;
      stepButtons[0].disabled = p < .002; stepButtons[1].disabled = p > .998;
    }
    imageFrames.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
      const img = el.querySelector('img'); if (!img) return;
      img.style.transform = el.classList.contains('kr-pool-frame') ? `translateY(${-p * r.height * .105}px)` : `scale(1.08) translateY(${(p - .5) * -5}%)`;
    });
    if (unsettled) schedule();
  }
  function splitHeading(el) {
    if (el.querySelector('.kr-word')) return;
    el.setAttribute('aria-label', el.textContent);
    const nodes = [], walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let index = 0;
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      const parts = root.lang.startsWith('zh') ? [...node.textContent] : node.textContent.split(/(\s+)/);
      parts.forEach(part => {
        if (!part.trim()) { fragment.append(document.createTextNode(part)); return; }
        const word = document.createElement('span');
        word.className = 'kr-word'; word.setAttribute('aria-hidden', 'true');
        const inner = document.createElement('span');
        inner.className = 'kr-word-inner'; inner.textContent = part;
        inner.style.setProperty('--kr-word-index', Math.min(index++, 12));
        word.append(inner); fragment.append(word);
      });
      node.replaceWith(fragment);
    });
  }
  function translate() {
    const zh = root.lang.startsWith('zh');
    document.querySelectorAll('[data-en][data-zh]').forEach(el => { el.textContent = zh ? el.dataset.zh : el.dataset.en; });
    toggle.setAttribute('aria-pressed', String(!active));
    toggle.querySelector('.kr-motion-label').textContent = zh ? (active ? '暂停动效' : '开启动效') : (active ? 'Pause motion' : 'Resume motion');
    toggle.firstElementChild.textContent = active ? 'Ⅱ' : '▷';
    home.querySelector('[data-scroll-programme]').setAttribute('aria-label', zh ? '探索六大系列' : 'Discover the six collections');
    stepButtons[0].setAttribute('aria-label', zh ? '上一系列' : 'Previous collections');
    stepButtons[1].setAttribute('aria-label', zh ? '下一系列' : 'Next collections');
  }
  function prepare() {
    observer?.disconnect();
    // Catalogue headings are rewritten by filters and product navigation; their
    // route entrance supplies motion without caching a stale accessible name.
    const headings = [...home.querySelectorAll('h1, h2')];
    headings.forEach(splitHeading);
    const groups = [
      ['.kr-section-heading>p, .kr-points>div, .kr-settings-copy>p, .kr-catalog-copy>p, .kr-inquiry p', 'up'],
      ['.kr-material-grid figure, .kr-project-grid article, .kr-facility-card', 'image'],
      ['.kr-settings-copy, .kr-catalog-copy', 'left'], ['.kr-pool-frame', 'right']
    ];
    groups.forEach(([selector, direction]) => home.querySelectorAll(selector).forEach(el => { el.dataset.krReveal = direction; }));
    [...track.children].forEach((el, i) => el.querySelector('h3')?.setAttribute('data-collection-number', String(i + 1).padStart(2, '0')));
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(entry.target.matches('h1,h2') ? 'kr-text-ready' : 'kr-revealed');
        observer.unobserve(entry.target);
      }), { threshold: .08, rootMargin: '0px 0px -4% 0px' });
      [...headings, ...home.querySelectorAll('[data-kr-reveal]')].forEach(el => observer.observe(el));
    } else {
      headings.forEach(el => el.classList.add('kr-text-ready'));
      home.querySelectorAll('[data-kr-reveal]').forEach(el => el.classList.add('kr-revealed'));
    }
    translate(); measure();
  }
  function applyMotion() {
    const programmeRect = programme.getBoundingClientRect();
    const readingProgramme = !home.hidden && programmeRect.top < headerHeight && programmeRect.bottom > headerHeight;
    const anchor = [...home.children].find(el => { const r = el.getBoundingClientRect(); return r.bottom > headerHeight + 80 && r.top < innerHeight; });
    const oldTop = anchor?.getBoundingClientRect().top;
    active = !paused && !reduced.matches;
    root.classList.toggle('kr-motion-on', active); toggle.hidden = reduced.matches;
    if (!active) {
      if (frame) cancelAnimationFrame(frame); frame = 0;
      [photo, furniture, copy, curve, ...plants, ...home.querySelectorAll('.kr-material-frame img,.kr-pool-frame img,.kr-catalog-frame img')].forEach(el => el.style.removeProperty('transform'));
      copy.style.removeProperty('opacity'); copy.inert = false;
    }
    translate(); measure();
    if (readingProgramme) window.scrollTo({ top: programme.getBoundingClientRect().top + scrollY - headerHeight, behavior: 'instant' });
    else if (anchor && !home.hidden && oldTop < headerHeight) window.scrollBy({ top: anchor.getBoundingClientRect().top - oldTop, behavior: 'instant' });
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem('kordia-motion', paused ? 'paused' : 'on'); } catch {}
    applyMotion();
  });
  home.querySelector('[data-scroll-programme]').addEventListener('click', () => window.scrollTo({ top: programme.getBoundingClientRect().top + scrollY - headerHeight, behavior: active ? 'smooth' : 'instant' }));
  stepButtons.forEach(button => button.addEventListener('click', () => {
    if (!railDistance) return;
    const target = clamp((rail.scrollLeft + Number(button.dataset.collectionStep) * (track.firstElementChild.offsetWidth + 32)) / railTravel);
    window.scrollTo({ top: programme.getBoundingClientRect().top + scrollY - headerHeight + target * railDistance, behavior: 'smooth' });
  }));
  track.addEventListener('focusin', event => {
    const card = event.target.closest('.coll-card'); if (!card || !railDistance || !card.matches(':focus-visible')) return;
    const x = Math.min(railTravel, Math.max(0, card.offsetLeft - track.firstElementChild.offsetLeft));
    window.scrollTo({ top: programme.getBoundingClientRect().top + scrollY - headerHeight + x / railTravel * railDistance, behavior: 'instant' });
  });
  stage.addEventListener('pointermove', event => {
    if (!active || !finePointer.matches) return;
    const r = stage.getBoundingClientRect();
    pointerX = (event.clientX - r.left) / r.width - .5; pointerY = (event.clientY - r.top) / r.height - .5; schedule();
  });
  stage.addEventListener('pointerleave', () => { pointerX = pointerY = 0; schedule(); });
  let hoveredCard;
  document.addEventListener('pointermove', event => {
    if (!active || !finePointer.matches) return;
    const card = event.target.closest('.p-card');
    if (hoveredCard && hoveredCard !== card) { hoveredCard.style.removeProperty('--kr-tilt-x'); hoveredCard.style.removeProperty('--kr-tilt-y'); }
    hoveredCard = card; if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--kr-tilt-x', `${((event.clientY - r.top) / r.height - .5) * -5}deg`);
    card.style.setProperty('--kr-tilt-y', `${((event.clientX - r.left) / r.width - .5) * 6}deg`);
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget && hoveredCard) { hoveredCard.style.removeProperty('--kr-tilt-x'); hoveredCard.style.removeProperty('--kr-tilt-y'); hoveredCard = null; }
  });
  addEventListener('scroll', schedule, { passive: true });
  let resizeTimer;
  addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(measure, 140); }, { passive: true });
  addEventListener('hashchange', () => { heroProgress = 0; copy.inert = false; prepare(); });
  document.addEventListener('visibilitychange', () => { root.classList.toggle('kr-scene-idle', document.hidden || home.hidden); lastTime = 0; schedule(); });
  reduced.addEventListener('change', applyMotion);
  new MutationObserver(() => { root.classList.toggle('kr-scene-idle', home.hidden); if (!home.hidden) { heroProgress = 0; measure(); } }).observe(home, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(prepare).observe(root, { attributes: true, attributeFilter: ['lang'] });
  document.fonts.ready.then(() => {
    home.dataset.fontStatus = JSON.stringify([...document.fonts].filter(f => ['Urbanist','Stardom'].includes(f.family)).map(f => ({ family: f.family, status: f.status })));
    measure();
  });
  const intro = document.querySelector('#intro');
  if (intro) {
    const introObserver = new MutationObserver(() => {
      if (intro.classList.contains('done')) { copy.querySelector('h1').classList.remove('kr-text-ready'); requestAnimationFrame(() => copy.querySelector('h1').classList.add('kr-text-ready')); introObserver.disconnect(); }
    });
    introObserver.observe(intro, { attributes: true, attributeFilter: ['class'] });
  }
  root.classList.toggle('kr-motion-on', active); toggle.hidden = reduced.matches; prepare();
})();
