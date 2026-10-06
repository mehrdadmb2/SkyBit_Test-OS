/* SkyBit OS 2.0 — desktop icons and launcher. */
(() => {
  const icons = [
    ['dashboard','Dashboard','fa-solid fa-chart-line'],
    ['terminal','Terminal','fa-solid fa-terminal'],
    ['explorer','Explorer','fa-solid fa-folder-tree'],
    ['browser','Browser','fa-solid fa-globe'],
    ['projects','Projects','fa-solid fa-layer-group'],
    ['tools','Toolbox','fa-solid fa-toolbox'],
    ['notes','Notes','fa-solid fa-note-sticky'],
    ['settings','Settings','fa-solid fa-sliders']
  ];

  function createDesktopIcons() {
    const container = document.getElementById('desktop-icons');
    if (!container || container.dataset.ready) return;
    container.dataset.ready='1';
    container.innerHTML = icons.map(([id,title,icon]) => `<button class="desktop-icon" data-app="${id}" title="Open ${title}"><span class="icon"><i class="${icon}"></i></span><span>${title}</span></button>`).join('');
    container.querySelectorAll('[data-app]').forEach(btn => {
      btn.addEventListener('dblclick', () => window.openApp(btn.dataset.app));
      btn.addEventListener('click', () => {
        container.querySelectorAll('.desktop-icon').forEach(x => x.classList.remove('selected'));
        btn.classList.add('selected');
      });
      btn.addEventListener('touchend', () => window.openApp(btn.dataset.app), {passive:true});
    });
  }

  function buildLauncher() {
    const container = document.getElementById('launcher-apps');
    if (!container) return;
    container.innerHTML = icons.map(([id,title,icon]) => `<button class="launcher-app" data-launch-app="${id}"><span class="la-icon"><i class="${icon}"></i></span><span><strong>${title}</strong><small>${SkyBit.apps[id]?.category || 'System'}</small></span></button>`).join('');
    container.querySelectorAll('[data-launch-app]').forEach(btn => btn.addEventListener('click', () => {
      document.getElementById('start-menu')?.classList.add('hidden');
      window.openApp(btn.dataset.launchApp);
    }));
  }

  window.initializeDesktop = () => {
    createDesktopIcons();
    buildLauncher();
    setTimeout(() => window.notify?.('Nexus initialized', 'Desktop environment is ready for showcase mode.', 'fa-solid fa-bolt'), 600);
    setTimeout(() => window.notify?.('Tip', 'Double-click a desktop icon or use the Start launcher.', 'fa-solid fa-lightbulb'), 1800);
  };
})();
