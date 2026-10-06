/* SkyBit OS 2.0 — core application registry, state, UI helpers. */
(() => {
  const state = {
    windows: new Map(),
    z: 100,
    activeWindow: null,
    notifications: [],
    settings: {
      theme: localStorage.getItem('skybit-theme') || 'night',
      grid: localStorage.getItem('skybit-grid') !== 'off',
      particles: localStorage.getItem('skybit-particles') !== 'off',
      reducedMotion: localStorage.getItem('skybit-motion') === 'reduced',
      glow: Number(localStorage.getItem('skybit-glow') || 100)
    },
    sessionStart: Date.now()
  };

  const apps = {
    dashboard: { title:'Nexus Dashboard', icon:'fa-solid fa-chart-line', emoji:'📡', category:'System', width:820, height:565 },
    terminal: { title:'Terminal', icon:'fa-solid fa-terminal', emoji:'⌘', category:'Developer', width:720, height:470 },
    explorer: { title:'File Explorer', icon:'fa-solid fa-folder-open', emoji:'📁', category:'Workspace', width:760, height:520 },
    browser: { title:'Nexus Browser', icon:'fa-solid fa-globe', emoji:'🌐', category:'Internet', width:820, height:540 },
    projects: { title:'Projects', icon:'fa-solid fa-layer-group', emoji:'🧩', category:'Showcase', width:780, height:520 },
    settings: { title:'Settings', icon:'fa-solid fa-sliders', emoji:'⚙️', category:'System', width:720, height:520 },
    tools: { title:'Toolbox', icon:'fa-solid fa-toolbox', emoji:'🛠️', category:'Utilities', width:720, height:520 },
    notes: { title:'Notes', icon:'fa-solid fa-note-sticky', emoji:'📝', category:'Productivity', width:650, height:500 },
    about: { title:'About SkyBit OS', icon:'fa-solid fa-circle-info', emoji:'◉', category:'System', width:620, height:430 }
  };

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

  window.SkyBit = { state, apps, $, $$ };

  function saveSettings() {
    localStorage.setItem('skybit-theme', state.settings.theme);
    localStorage.setItem('skybit-grid', state.settings.grid ? 'on' : 'off');
    localStorage.setItem('skybit-particles', state.settings.particles ? 'on' : 'off');
    localStorage.setItem('skybit-motion', state.settings.reducedMotion ? 'reduced' : 'full');
    localStorage.setItem('skybit-glow', String(state.settings.glow));
  }

  function applySettings() {
    document.body.classList.remove('theme-ice','theme-amber','theme-mono');
    if (state.settings.theme !== 'night') document.body.classList.add(`theme-${state.settings.theme}`);
    document.documentElement.style.setProperty('--motion', state.settings.reducedMotion ? '0.001' : '1');
    document.documentElement.style.setProperty('--glow-scale', String(state.settings.glow / 100));
    const grid = document.querySelector('.wallpaper-grid');
    if (grid) grid.style.display = state.settings.grid ? '' : 'none';
    if (window.SkyBitSpace) window.SkyBitSpace.setEnabled(state.settings.particles);
    saveSettings();
  }

  function toast(title, message, icon='fa-solid fa-bolt') {
    const stack = $('#toast-stack');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<div class="toast-icon"><i class="${icon}"></i></div><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 320);
    }, 3600);
  }

  function notify(title, message, icon='fa-solid fa-bell') {
    state.notifications.unshift({ title, message, icon, time:new Date() });
    state.notifications = state.notifications.slice(0, 12);
    renderNotifications();
    toast(title, message, icon);
  }

  function renderNotifications() {
    const list = $('#notification-list');
    const count = $('#notification-count');
    if (!list || !count) return;
    count.textContent = state.notifications.length ? String(Math.min(state.notifications.length, 99)) : '';
    list.innerHTML = state.notifications.length ? state.notifications.map(n => `
      <div class="notification-item">
        <div class="ni-icon"><i class="${n.icon}"></i></div>
        <div><strong>${escapeHtml(n.title)}</strong><p>${escapeHtml(n.message)}</p><time>${formatRelative(n.time)}</time></div>
      </div>`).join('') : `<div class="empty-state"><i class="fa-regular fa-bell-slash"></i><strong>All clear</strong><p>No new system notifications. The workspace is quiet.</p></div>`;
  }

  function formatRelative(date) {
    const sec = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    if (sec < 10) return 'just now';
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    return `${Math.floor(min / 60)}h ago`;
  }

  function escapeHtml(value='') {
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function setPanel(id, visible) { const el = document.getElementById(id); if (el) el.classList.toggle('hidden', !visible); }
  function closePanels(except='') {
    ['start-menu','notification-center','quick-panel'].filter(id => id !== except).forEach(id => setPanel(id,false));
  }

  function toggleStart() {
    const el = $('#start-menu');
    if (!el) return;
    const show = el.classList.contains('hidden');
    closePanels(show ? 'start-menu' : '');
    el.classList.toggle('hidden', !show);
    if (show) setTimeout(() => $('#launcher-search-input')?.focus(), 40);
  }

  function togglePanel(id) {
    const el = $('#'+id);
    if (!el) return;
    const show = el.classList.contains('hidden');
    closePanels(show ? id : '');
    el.classList.toggle('hidden', !show);
  }

  function bindGlobalUi() {
    $('#start-button')?.addEventListener('click', e => { e.stopPropagation(); toggleStart(); });
    $('#notification-button')?.addEventListener('click', e => { e.stopPropagation(); togglePanel('notification-center'); });
    $('#quick-button')?.addEventListener('click', e => { e.stopPropagation(); togglePanel('quick-panel'); });
    $('#clock-button')?.addEventListener('click', () => window.openApp?.('dashboard'));
    $('#rail-avatar')?.addEventListener('click', () => window.openApp?.('about'));
    $('#launcher-settings')?.addEventListener('click', () => { setPanel('start-menu',false); window.openApp?.('settings'); });
    $('#clear-notifications')?.addEventListener('click', () => { state.notifications=[]; renderNotifications(); });
    document.addEventListener('click', e => {
      if (!e.target.closest('.start-menu') && !e.target.closest('#start-button')) setPanel('start-menu',false);
      if (!e.target.closest('.notification-center') && !e.target.closest('#notification-button')) setPanel('notification-center',false);
      if (!e.target.closest('.quick-panel') && !e.target.closest('#quick-button')) setPanel('quick-panel',false);
    });

    $$('.quick-tile').forEach(btn => btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'theme') {
        state.settings.theme = state.settings.theme === 'night' ? 'ice' : state.settings.theme === 'ice' ? 'amber' : 'night';
        applySettings();
        toast('Visual core changed', `Theme: ${state.settings.theme.toUpperCase()}`, 'fa-solid fa-palette');
      }
      if (action === 'grid') state.settings.grid = !state.settings.grid;
      if (action === 'particles') state.settings.particles = !state.settings.particles;
      if (action === 'motion') state.settings.reducedMotion = !state.settings.reducedMotion;
      if (['grid','particles','motion'].includes(action)) applySettings();
      syncQuickPanel();
    }));

    $('#glow-slider')?.addEventListener('input', e => {
      state.settings.glow = Number(e.target.value);
      applySettings();
    });

    $('#launcher-search-input')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      $$('.launcher-app').forEach(a => a.classList.toggle('hidden', q && !a.textContent.toLowerCase().includes(q)));
    });
  }

  function syncQuickPanel() {
    $$('.quick-tile').forEach(btn => {
      const action = btn.dataset.action;
      btn.classList.toggle('active', action === 'theme' || (action === 'grid' && state.settings.grid) || (action === 'particles' && state.settings.particles) || (action === 'motion' && !state.settings.reducedMotion));
    });
    const slider = $('#glow-slider'); if (slider) slider.value = String(state.settings.glow);
  }

  function bootReady() {
    applySettings();
    bindGlobalUi();
    syncQuickPanel();
    renderNotifications();
  }

  window.notify = notify;
  window.toast = toast;
  window.applySkyBitSettings = applySettings;
  window.toggleSkyBitPanel = togglePanel;

  document.addEventListener('DOMContentLoaded', bootReady);
})();

/* Feature module router — kept here so one global entry point decides what content each window receives. */
window.mountApp = (appId) => {
  const fn = ({dashboard:window.mountDashboard,terminal:window.mountTerminal,explorer:window.mountExplorer,browser:window.mountBrowser,projects:window.mountProjects,settings:window.mountSettings,tools:window.mountTools}[appId]);
  if (fn) return fn();
  if (appId === 'notes') return window.mountNotes?.();
  if (appId === 'about') {
    const body = `<div class="window-inner"><div class="app-heading"><div><div class="app-kicker">SYSTEM IDENTITY</div><h2>About SkyBit OS</h2><p>A fictional next-generation browser operating environment made for interface experimentation, portfolio demos and visual storytelling.</p></div><span class="badge badge-cyan">SKYBIT 2.0</span></div><div class="stat-grid" style="margin-top:14px"><div class="stat-card"><div class="label">RENDERER</div><div class="value">CANVAS</div><div class="meta">low-cost particle layer</div></div><div class="stat-card"><div class="label">UI</div><div class="value">CSS</div><div class="meta">glass / gradients</div></div><div class="stat-card"><div class="label">LOGIC</div><div class="value">JS</div><div class="meta">modular runtime</div></div><div class="stat-card"><div class="label">DEPLOY</div><div class="value">STATIC</div><div class="meta">GitHub Pages ready</div></div></div><div class="panel-card" style="margin-top:12px;padding:13px"><div class="panel-card-head" style="padding:0 0 9px;border:0"><span>DESIGN LANGUAGE</span><span>GLASS / MATRIX / NEXUS</span></div><p style="margin:0;color:#72849a;font-size:9px;line-height:1.8">The interface intentionally combines frosted glass, cinematic gradients, subtle 3D depth, Japanese matrix typography, responsive windows and practical showcase utilities without a heavy rendering framework.</p></div></div>`;
    return SkyBitWindow.fill('about',body,'<span class="tool-button"><i class="fa-solid fa-circle-info"></i> System info</span>','SkyBit OS 2.0 showcase');
  }
};

window.mountNotes = (initial='') => {
  const body = `<div class="note-editor"><div style="display:flex;justify-content:space-between;align-items:center"><div><div class="app-kicker">LOCAL NOTE</div><strong style="font-size:12px">Scratchpad</strong></div><button class="tool-button" data-note-clear>Clear</button></div><textarea data-note-area placeholder="Write something...">${SkyBit.$.escapeHtml ? SkyBit.$.escapeHtml(initial) : initial}</textarea><div style="display:flex;justify-content:space-between;align-items:center;color:#566980;font-size:8px"><span>Autosaved locally</span><button class="tool-button primary" data-note-save><i class="fa-solid fa-floppy-disk"></i> Save</button></div></div>`;
  const el = SkyBitWindow.fill('notes',body,'<span class="tool-button"><i class="fa-solid fa-shield-halved"></i> Local-only</span>','Saved to browser storage');
  if (!el) return;
  const area = el.querySelector('[data-note-area]');
  if (!initial) area.value = localStorage.getItem('skybit-note') || '';
  const save = () => { localStorage.setItem('skybit-note',area.value); el.querySelector('[data-window-status]').textContent='Saved just now'; toast('Notes saved','Your scratchpad was stored locally.','fa-solid fa-floppy-disk'); };
  el.querySelector('[data-note-save]').onclick=save;
  el.querySelector('[data-note-clear]').onclick=()=>{area.value='';save();};
};

/* Safe tiny escape helper for note content. */
SkyBit.$.escapeHtml = value => String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
