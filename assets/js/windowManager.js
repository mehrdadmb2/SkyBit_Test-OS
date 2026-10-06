/* SkyBit OS 2.0 — window manager: open, focus, drag, resize, minimize, maximize, taskbar. */
(() => {
  const state = SkyBit.state;
  const apps = SkyBit.apps;
  const area = document.getElementById('window-area');
  const template = document.getElementById('window-template');

  function clamp(v,min,max){ return Math.max(min, Math.min(max,v)); }
  function focusWindow(el) {
    if (!el) return;
    state.z += 1;
    el.style.zIndex = String(state.z);
    state.activeWindow = el.dataset.appId;
    document.querySelectorAll('.os-window').forEach(w => w.classList.toggle('is-active', w === el));
    document.querySelectorAll('.task-item').forEach(t => t.classList.toggle('active', t.dataset.appId === state.activeWindow));
  }

  function spawn(appId) {
    const meta = apps[appId];
    if (!meta || !template) return null;
    const fragment = template.content.cloneNode(true);
    const el = fragment.querySelector('.os-window');
    el.dataset.appId = appId;
    const existing = state.windows.get(appId);
    if (existing) { existing.classList.remove('is-minimized'); focusWindow(existing); return existing; }

    const offset = Math.min(state.windows.size, 7) * 22;
    const width = Math.min(meta.width, Math.max(320, window.innerWidth - 20));
    const height = Math.min(meta.height, Math.max(220, window.innerHeight - 98));
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.left = `${Math.max(8, (window.innerWidth - width) / 2 + offset - 55)}px`;
    el.style.top = `${Math.max(10, (window.innerHeight - height) / 2 - 25 + offset)}px`;
    el.querySelector('.window-title').textContent = meta.title;
    el.querySelector('.window-app-icon').innerHTML = `<i class="${meta.icon}"></i>`;

    area.appendChild(el);
    state.windows.set(appId, el);
    bind(el);
    buildTaskButton(appId);
    focusWindow(el);
    return el;
  }

  function buildTaskButton(appId) {
    const center = document.getElementById('taskbar-apps');
    if (!center || center.querySelector(`[data-app-id="${appId}"]`)) return;
    const btn = document.createElement('button');
    btn.className = 'task-item';
    btn.dataset.appId = appId;
    btn.title = apps[appId].title;
    btn.innerHTML = `<i class="${apps[appId].icon}"></i><span>${SkyBit.apps[appId].title}</span>`;
    btn.addEventListener('click', () => {
      const w = state.windows.get(appId);
      if (!w) return;
      if (w.classList.contains('is-minimized')) { w.classList.remove('is-minimized'); focusWindow(w); }
      else if (state.activeWindow === appId) w.classList.add('is-minimized');
      else focusWindow(w);
    });
    center.appendChild(btn);
  }

  function closeWindow(el) {
    const appId = el.dataset.appId;
    el.style.animation = 'toastOut .22s var(--ease) forwards';
    setTimeout(() => {
      el.remove();
      state.windows.delete(appId);
      document.querySelector(`.task-item[data-app-id="${CSS.escape(appId)}"]`)?.remove();
      if (state.activeWindow === appId) {
        const next = [...state.windows.values()].filter(w => !w.classList.contains('is-minimized')).sort((a,b) => Number(b.style.zIndex||0)-Number(a.style.zIndex||0))[0];
        focusWindow(next);
      }
    }, 220);
  }

  function toggleMax(el) {
    el.classList.toggle('is-maximized');
    if (el.classList.contains('is-maximized')) {
      el.dataset.restore = JSON.stringify({ left:el.style.left, top:el.style.top, width:el.style.width, height:el.style.height });
      el.style.left='8px'; el.style.top='8px'; el.style.width='calc(100% - 16px)'; el.style.height='calc(100% - 16px)';
      el.querySelector('[data-window-action="maximize"]').innerHTML = '<i class="fa-regular fa-window-restore"></i>';
    } else {
      const r = JSON.parse(el.dataset.restore || '{}');
      el.style.left = r.left || '20px'; el.style.top = r.top || '20px'; el.style.width = r.width || '700px'; el.style.height = r.height || '480px';
      el.querySelector('[data-window-action="maximize"]').innerHTML = '<i class="fa-regular fa-square"></i>';
    }
    focusWindow(el);
  }

  function bind(el) {
    el.addEventListener('pointerdown', () => focusWindow(el));
    el.querySelector('[data-window-action="close"]').addEventListener('click', () => closeWindow(el));
    el.querySelector('[data-window-action="minimize"]').addEventListener('click', () => el.classList.add('is-minimized'));
    el.querySelector('[data-window-action="maximize"]').addEventListener('click', () => toggleMax(el));
    drag(el.querySelector('.window-titlebar'), el);
    resize(el.querySelector('.window-resize-handle'), el);
  }

  function drag(handle, el) {
    handle.addEventListener('pointerdown', e => {
      if (el.classList.contains('is-maximized') || e.target.closest('.window-controls')) return;
      focusWindow(el);
      const startX=e.clientX, startY=e.clientY, startL=el.offsetLeft, startT=el.offsetTop;
      handle.setPointerCapture(e.pointerId);
      const move = ev => {
        el.style.left = `${clamp(startL + ev.clientX-startX, 4, window.innerWidth-70)}px`;
        el.style.top = `${clamp(startT + ev.clientY-startY, 4, window.innerHeight-110)}px`;
      };
      const up = () => { handle.removeEventListener('pointermove',move); handle.removeEventListener('pointerup',up); };
      handle.addEventListener('pointermove',move); handle.addEventListener('pointerup',up);
    });
  }

  function resize(handle, el) {
    handle.addEventListener('pointerdown', e => {
      e.stopPropagation();
      if (el.classList.contains('is-maximized')) return;
      const startX=e.clientX, startY=e.clientY, w=el.offsetWidth, h=el.offsetHeight;
      handle.setPointerCapture(e.pointerId);
      const move = ev => {
        el.style.width = `${Math.max(320, w + ev.clientX-startX)}px`;
        el.style.height = `${Math.max(220, h + ev.clientY-startY)}px`;
      };
      const up = () => { handle.removeEventListener('pointermove',move); handle.removeEventListener('pointerup',up); };
      handle.addEventListener('pointermove',move); handle.addEventListener('pointerup',up);
    });
  }

  function fill(appId, bodyHtml, toolbarHtml='', status='Ready') {
    const el = spawn(appId);
    if (!el) return null;
    el.querySelector('[data-window-body]').innerHTML = bodyHtml;
    const toolbar = el.querySelector('[data-window-toolbar]');
    toolbar.innerHTML = toolbarHtml;
    el.querySelector('[data-window-status]').textContent = status;
    return el;
  }

  function closeAll() { [...state.windows.values()].forEach(closeWindow); }

  window.openApp = (appId) => {
    const map = { projects:'projects', terminal:'terminal', explorer:'explorer', browser:'browser', dashboard:'dashboard', settings:'settings', tools:'tools', notes:'notes', about:'about' };
    return window.mountApp?.(map[appId] || appId);
  };
  window.SkyBitWindow = { spawn, fill, focus:focusWindow, closeAll };
})();
