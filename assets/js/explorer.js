/* SkyBit OS 2.0 — local virtual file explorer. */
(() => {
  const files = [
    {name:'Applications', kind:'folder', icon:'fa-solid fa-folder-tree', size:'8 modules', note:'Installed showcase applications'},
    {name:'Projects', kind:'folder', icon:'fa-solid fa-folder-open', size:'12 items', note:'Prototype repositories and concepts'},
    {name:'System', kind:'folder', icon:'fa-solid fa-microchip', size:'28 files', note:'Kernel, compositor and runtime metadata'},
    {name:'README.md', kind:'markdown', icon:'fa-brands fa-markdown', size:'6.3 KB', note:'Project overview and interface notes'},
    {name:'boot.log', kind:'log', icon:'fa-solid fa-file-lines', size:'2.1 KB', note:'Simulated secure-boot transcript'},
    {name:'config.sky', kind:'config', icon:'fa-solid fa-sliders', size:'1.8 KB', note:'Local visual preferences'},
    {name:'network.map', kind:'data', icon:'fa-solid fa-diagram-project', size:'14 KB', note:'Synthetic node topology'},
    {name:'manifest.json', kind:'json', icon:'fa-solid fa-code', size:'4.2 KB', note:'Application registry'}
  ];

  function mount() {
    const toolbar = `<button class="tool-button" data-explorer-home><i class="fa-solid fa-house"></i> Home</button><button class="tool-button" data-explorer-sort><i class="fa-solid fa-arrow-down-a-z"></i> Sort</button><span style="margin-left:auto;color:#5f7189;font-size:9px">NEXUS://USER/WORKSPACE</span>`;
    const body = `<div class="file-grid" data-file-grid>${files.map(f=>`<button class="file-card" data-file="${f.name}"><i class="file-icon ${f.icon}"></i><strong>${f.name}</strong><small>${f.size}<br>${f.note}</small></button>`).join('')}</div>`;
    const el = SkyBitWindow.fill('explorer', body, toolbar, `${files.length} objects`);
    if (!el) return;
    el.querySelectorAll('[data-file]').forEach(btn => btn.addEventListener('dblclick', () => openFile(btn.dataset.file)));
    el.querySelector('[data-explorer-sort]')?.addEventListener('click', () => {
      [...el.querySelectorAll('.file-card')].sort((a,b)=>a.textContent.localeCompare(b.textContent)).forEach(n=>el.querySelector('[data-file-grid]').appendChild(n));
    });
    el.querySelector('[data-explorer-home]')?.addEventListener('click', () => toast('Explorer', 'Already at workspace root.', 'fa-solid fa-house'));
  }
  function openFile(name) {
    const f = files.find(x=>x.name===name); if (!f) return;
    if (f.kind==='folder') { toast('Virtual folder', `${f.name} is represented as a showcase container.`, 'fa-solid fa-folder-open'); return; }
    window.mountNotes?.(`// ${name}\n\n${f.note}\n\nThis file is a simulated system artifact used by the SkyBit OS showcase.`);
  }
  window.mountExplorer = mount;
})();
