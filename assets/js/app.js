// Constants
const IMG_W = 1120, IMG_H = 1149;
const MARGIN = 44;
const STORAGE_KEY = 'portfolio-regions-v2';

// State
let regions    = loadRegions();
let editMode   = false;
let drawing    = false;
let drawPts    = [];
let pendingReg = null;

// ─── Init ────────────────────────────────────────────

function boot() {
  sizeSVG();
  renderRegions();
  applyMonitorImage();
  buildProjectCards();
  wireEvents();
  window.addEventListener('resize', sizeSVG);
}

// ─── Layout ──────────────────────────────────────────

function sizeSVG() {
  const scale = Math.min(
    (window.innerWidth  - MARGIN * 2) / IMG_W,
    (window.innerHeight - MARGIN * 2) / IMG_H
  );
  const w = IMG_W * scale, h = IMG_H * scale;

  const scene = document.getElementById('scene');
  scene.style.width  = w + 'px';
  scene.style.height = h + 'px';

  const svg = document.getElementById('main-svg');
  svg.setAttribute('viewBox', `0 0 ${IMG_W} ${IMG_H}`);
  svg.setAttribute('width',  w);
  svg.setAttribute('height', h);

  document.getElementById('svg-room').setAttribute('width',  IMG_W);
  document.getElementById('svg-room').setAttribute('height', IMG_H);
}

// ─── Region persistence ──────────────────────────────

function loadRegions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return JSON.parse(JSON.stringify(DEFAULT_REGIONS));
}

function saveRegions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(regions));
}

// ─── Render regions ──────────────────────────────────

function renderRegions() {
  const layer = document.getElementById('regions-layer');
  layer.innerHTML = '';

  regions.forEach(r => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    el.setAttribute('points', r.points.map(p => p.join(',')).join(' '));
    el.setAttribute('class', 'region');
    el.dataset.id   = r.id;
    el.dataset.type = r.type;

    el.addEventListener('mouseenter', e => hoverOn(e, r));
    el.addEventListener('mousemove',  moveTip);
    el.addEventListener('mouseleave', e => hoverOff(e, r));
    el.addEventListener('click',      e => regionClick(e, r));

    layer.appendChild(el);
  });
}

// ─── Hover / tooltip ─────────────────────────────────

function hoverOn(e, r) {
  if (editMode) return;
  const el = e.currentTarget;
  el.style.fill        = r.fillHover   || 'rgba(255,255,255,0.12)';
  el.style.stroke      = r.strokeHover || 'rgba(255,255,255,0.5)';
  el.style.strokeWidth = '2';
  if (r.filter) el.style.filter = `url(#${r.filter})`;

  const tip = document.getElementById('tooltip');
  tip.textContent   = r.tooltip || r.name;
  tip.style.opacity = '1';
}

function moveTip(e) {
  const tip = document.getElementById('tooltip');
  tip.style.left = e.clientX + 'px';
  tip.style.top  = e.clientY + 'px';
}

function hoverOff(e, r) {
  if (editMode) return;
  const el = e.currentTarget;
  el.style.fill        = 'transparent';
  el.style.stroke      = 'transparent';
  el.style.strokeWidth = '0';
  el.style.filter      = '';
  document.getElementById('tooltip').style.opacity = '0';
}

// ─── Region click ─────────────────────────────────────

function regionClick(e, r) {
  if (editMode) return;
  if (r.type === 'monitor') {
    pulseMonitor(r.points);
    setTimeout(openProjects, 480);
  } else if (r.type === 'link' && r.url) {
    window.open(r.url, '_blank');
  }
}

function pulseMonitor(points) {
  const flash = document.getElementById('monitor-flash');
  flash.setAttribute('points', points.map(p => p.join(',')).join(' '));
  flash.classList.remove('pulse');
  void flash.offsetWidth; // force reflow
  flash.classList.add('pulse');
}

// ─── Monitor image overlay ───────────────────────────

function applyMonitorImage() {
  const img = document.getElementById('monitor-img');
  if (!CONFIG.monitorImage) { img.setAttribute('opacity', '0'); return; }

  const monR = regions.find(r => r.type === 'monitor') || regions[0];
  const xs = monR.points.map(p => p[0]);
  const ys = monR.points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  const w = Math.max(...xs) - x, h = Math.max(...ys) - y;

  document.getElementById('monitor-clip-poly')
    .setAttribute('points', monR.points.map(p => p.join(',')).join(' '));

  img.setAttribute('href',    CONFIG.monitorImage);
  img.setAttribute('x',       x);
  img.setAttribute('y',       y);
  img.setAttribute('width',   w);
  img.setAttribute('height',  h);
  img.setAttribute('opacity', '0.9');
}

// ─── Projects panel ──────────────────────────────────

function buildProjectCards() {
  document.getElementById('panel-title').textContent = CONFIG.name + "'s Projects";
  document.getElementById('panel-sub').textContent   = CONFIG.subtitle;

  const grid = document.getElementById('projects-grid');
  grid.innerHTML = '';

  CONFIG.projects.forEach(p => {
    const a = document.createElement('a');
    a.className = 'project-card';
    a.href = p.url || '#';
    if (p.url && p.url !== '#') a.target = '_blank';
    a.innerHTML = `
      <div class="card-tag">
        <span>${p.tag}</span>
        <span class="card-arrow">↗</span>
      </div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      <div class="tech-stack">
        ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>`;
    grid.appendChild(a);
  });
}

function openProjects()  { document.getElementById('projects-overlay').classList.add('open'); }
function closeProjects() { document.getElementById('projects-overlay').classList.remove('open'); }

// ─── Edit mode ───────────────────────────────────────

function toggleEdit() {
  editMode = !editMode;
  document.getElementById('edit-panel').classList.toggle('open', editMode);
  document.getElementById('edit-toggle').classList.toggle('active', editMode);
  document.getElementById('edit-toggle').textContent = editMode ? '✕ exit editor' : '⚙ edit regions';
  document.body.classList.toggle('editing', editMode);

  if (editMode) refreshRegionList();
  else if (drawing) cancelDraw();
}

function startDraw() {
  const name = document.getElementById('inp-name').value.trim();
  if (!name) { setStatus('⚠ Enter a name first.'); return; }

  drawing = true;
  drawPts = [];
  clearDrawPreview();

  pendingReg = {
    id:          name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    name,
    type:        document.getElementById('inp-type').value,
    tooltip:     document.getElementById('inp-tooltip').value || name,
    url:         document.getElementById('inp-url').value,
    points:      [],
    fillHover:   'rgba(255,255,255,0.12)',
    strokeHover: 'rgba(255,255,255,0.5)',
    filter:      'glow-white',
  };

  document.getElementById('btn-draw-start').disabled  = true;
  document.getElementById('btn-draw-finish').disabled = false;
  setStatus('Click image to place points.\nDouble-click to finish polygon.');
}

function finishDraw() {
  if (drawPts.length < 3) { setStatus('⚠ Need at least 3 points.'); return; }
  pendingReg.points = [...drawPts];
  regions.push(pendingReg);
  saveRegions();
  renderRegions();
  refreshRegionList();

  drawing = false; drawPts = []; pendingReg = null;
  clearDrawPreview();
  document.getElementById('btn-draw-start').disabled  = false;
  document.getElementById('btn-draw-finish').disabled = true;
  document.getElementById('inp-name').value    = '';
  document.getElementById('inp-tooltip').value = '';
  setStatus('✓ Region saved!');
}

function cancelDraw() {
  drawing = false; drawPts = []; pendingReg = null;
  clearDrawPreview();
  document.getElementById('btn-draw-start').disabled  = false;
  document.getElementById('btn-draw-finish').disabled = true;
  setStatus('Drawing cancelled.');
}

// ─── SVG drawing helpers ─────────────────────────────

function svgPoint(e) {
  const svg  = document.getElementById('main-svg');
  const rect = svg.getBoundingClientRect();
  return [
    Math.round((e.clientX - rect.left) * (IMG_W / rect.width)),
    Math.round((e.clientY - rect.top)  * (IMG_H / rect.height)),
  ];
}

function onSVGClick(e) {
  if (!editMode || !drawing) return;
  if (e.detail === 2) return; // ignore the click that fires before dblclick
  e.stopPropagation();
  drawPts.push(svgPoint(e));
  updateDrawPreview();
}

function onSVGDblClick(e) {
  if (!editMode || !drawing) return;
  e.stopPropagation();
  if (drawPts.length) drawPts.pop(); // remove phantom point from preceding click
  if (drawPts.length >= 3) finishDraw();
}

function onSVGMouseMove(e) {
  if (!editMode || !drawing || !drawPts.length) return;
  const pt   = svgPoint(e);
  const last = drawPts[drawPts.length - 1];
  const line = document.getElementById('draw-snap-line');
  line.setAttribute('x1', last[0]); line.setAttribute('y1', last[1]);
  line.setAttribute('x2', pt[0]);   line.setAttribute('y2', pt[1]);
  line.setAttribute('opacity', '1');
}

function updateDrawPreview() {
  const poly = document.getElementById('draw-fill-preview');
  if (drawPts.length < 2) { poly.setAttribute('points', ''); return; }

  const closed = [...drawPts, drawPts[0]];
  poly.setAttribute('points', closed.map(p => p.join(',')).join(' '));

  const preview = document.getElementById('draw-preview');
  preview.querySelectorAll('.draw-dot').forEach(d => d.remove());
  drawPts.forEach(pt => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', pt[0]); c.setAttribute('cy', pt[1]);
    c.setAttribute('r',  '4');
    c.setAttribute('fill', '#f80');
    c.setAttribute('class', 'draw-dot');
    c.style.pointerEvents = 'none';
    preview.appendChild(c);
  });
}

function clearDrawPreview() {
  document.getElementById('draw-fill-preview').setAttribute('points', '');
  document.getElementById('draw-snap-line').setAttribute('opacity', '0');
  document.getElementById('draw-preview').querySelectorAll('.draw-dot').forEach(d => d.remove());
}

// ─── Editor UI helpers ───────────────────────────────

function refreshRegionList() {
  const list = document.getElementById('region-list');
  list.innerHTML = '';

  regions.forEach(r => {
    const item = document.createElement('div');
    item.className = 'region-item';
    item.innerHTML = `
      <span>${r.name}<span class="type-tag">[${r.type}]</span></span>
      <span class="del" data-id="${r.id}" title="Delete">×</span>`;
    item.querySelector('.del').addEventListener('click', ev => {
      ev.stopPropagation();
      regions = regions.filter(x => x.id !== r.id);
      saveRegions();
      renderRegions();
      refreshRegionList();
    });
    list.appendChild(item);
  });
}

function exportRegions() {
  const blob = new Blob([JSON.stringify(regions, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement('a'), { href: url, download: 'regions.json' });
  a.click();
  URL.revokeObjectURL(url);
  setStatus('↓ Exported regions.json');
}

function resetRegions() {
  if (!confirm('Reset all regions to defaults?')) return;
  regions = JSON.parse(JSON.stringify(DEFAULT_REGIONS));
  saveRegions();
  renderRegions();
  refreshRegionList();
  setStatus('✓ Reset to defaults.');
}

function setStatus(msg) {
  document.getElementById('edit-status').innerHTML = msg.replace(/\n/g, '<br>');
}

// ─── Event wiring ────────────────────────────────────

function wireEvents() {
  document.getElementById('btn-close-projects').addEventListener('click', closeProjects);
  document.getElementById('projects-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeProjects();
  });

  document.getElementById('edit-toggle').addEventListener('click', toggleEdit);
  document.getElementById('btn-draw-start').addEventListener('click', startDraw);
  document.getElementById('btn-draw-finish').addEventListener('click', finishDraw);
  document.getElementById('btn-draw-cancel').addEventListener('click', cancelDraw);
  document.getElementById('btn-export').addEventListener('click', exportRegions);
  document.getElementById('btn-reset').addEventListener('click', resetRegions);
  document.getElementById('inp-type').addEventListener('change', e => {
    document.getElementById('inp-url').style.display = e.target.value === 'link' ? 'block' : 'none';
  });

  const svg = document.getElementById('main-svg');
  svg.addEventListener('click',     onSVGClick);
  svg.addEventListener('dblclick',  onSVGDblClick);
  svg.addEventListener('mousemove', onSVGMouseMove);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeProjects();
      if (drawing) cancelDraw();
      if (editMode) toggleEdit();
    }
    if (e.key === 'Backspace' && drawing && drawPts.length) {
      drawPts.pop();
      updateDrawPreview();
    }
  });
}

// ─── Go ──────────────────────────────────────────────
boot();