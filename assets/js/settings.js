/* SkyBit OS 2.0 — visual settings with persistence. */
(() => {
  function mount(){
    const s=SkyBit.state.settings;
    const body=`<div class="settings-layout"><nav class="settings-tabs"><button class="settings-tab active">Appearance</button><button class="settings-tab">Desktop</button><button class="settings-tab">About</button></nav><section class="settings-content">
      <div class="setting-group"><h3>THEME CORE</h3><div class="theme-options">${['night','ice','amber','mono'].map(t=>`<button class="theme-button ${s.theme===t?'active':''}" data-theme="${t}">${t.toUpperCase()}</button>`).join('')}</div></div>
      <div class="setting-group"><div class="setting-row"><div class="copy"><strong>HUD Grid</strong><small>Show the perspective matrix on the desktop wallpaper.</small></div>${toggle('grid',s.grid)}</div><div class="setting-row"><div class="copy"><strong>Particle Field</strong><small>Enable low-density canvas stars and motion particles.</small></div>${toggle('particles',s.particles)}</div><div class="setting-row"><div class="copy"><strong>Full Motion</strong><small>Disable this to minimize non-essential interface animation.</small></div>${toggle('motion',!s.reducedMotion)}</div></div>
      <div class="setting-group"><div class="setting-row"><div class="copy"><strong>Glow intensity</strong><small>Controls the visual bloom around the interface.</small></div><div style="width:170px"><input data-setting-glow type="range" min="40" max="140" value="${s.glow}" style="width:100%;accent-color:var(--cyan)"></div></div></div>
      <div class="setting-group"><div class="setting-row"><div class="copy"><strong>Storage</strong><small>Preferences are stored locally in your browser.</small></div><button class="tool-button" data-reset-settings><i class="fa-solid fa-rotate-left"></i> Reset</button></div></div>
    </section></div>`;
    const el=SkyBitWindow.fill('settings',body,'<span class="tool-button"><i class="fa-solid fa-floppy-disk"></i> Auto-save</span>','Preferences persisted locally');
    if(!el)return;
    el.querySelectorAll('[data-theme]').forEach(btn=>btn.addEventListener('click',()=>{s.theme=btn.dataset.theme;window.applySkyBitSettings?.();el.querySelectorAll('[data-theme]').forEach(x=>x.classList.toggle('active',x.dataset.theme===s.theme));toast('Theme updated',`Visual theme: ${s.theme.toUpperCase()}`,'fa-solid fa-palette');}));
    el.querySelector('[data-setting-glow]')?.addEventListener('input',e=>{s.glow=Number(e.target.value);window.applySkyBitSettings?.();});
    el.querySelector('[data-reset-settings]')?.addEventListener('click',()=>{s.theme='night';s.grid=true;s.particles=true;s.reducedMotion=false;s.glow=100;window.applySkyBitSettings?.();window.location.reload();});
    el.querySelectorAll('[data-setting-toggle]').forEach(box=>box.addEventListener('change',()=>{
      const k=box.dataset.settingToggle; if(k==='grid')s.grid=box.checked; if(k==='particles')s.particles=box.checked; if(k==='motion')s.reducedMotion=!box.checked; window.applySkyBitSettings?.();
    }));
  }
  function toggle(key,checked){ return `<label class="switch"><input type="checkbox" data-setting-toggle="${key}" ${checked?'checked':''}><span class="slider"></span></label>`; }
  window.mountSettings=mount;
})();
