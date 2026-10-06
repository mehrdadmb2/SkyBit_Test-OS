/* SkyBit OS 2.0 — curated showcase browser. External links open in a real tab. */
(() => {
  const cards = [
    ['fa-brands fa-github','GitHub','Open the project repository or inspect source code.','https://github.com/mehrdadmb2/SkyBit_Test-OS'],
    ['fa-solid fa-globe','GitHub Pages','See how a static deployment can host the desktop UI.','https://pages.github.com/'],
    ['fa-solid fa-code','Web Platform','MDN reference for Canvas, CSS and browser APIs.','https://developer.mozilla.org/']
  ];
  function mount() {
    const toolbar = `<div class="browser-toolbar"><button class="browser-nav-btn" data-back title="Back"><i class="fa-solid fa-arrow-left"></i></button><button class="browser-nav-btn" data-refresh title="Refresh"><i class="fa-solid fa-rotate-right"></i></button><input class="browser-address" value="skybit://nexus" data-address aria-label="Address"><button class="browser-nav-btn" data-go title="Go"><i class="fa-solid fa-arrow-right"></i></button></div>`;
    const body = `<div class="browser-shell"><div class="browser-content" data-browser-content>${home()}</div></div>`;
    const el = SkyBitWindow.fill('browser', body, toolbar, 'Curated browser / sandboxed showcase');
    if (!el) return;
    const address = el.querySelector('[data-address]');
    const content = el.querySelector('[data-browser-content]');
    const navigate = () => {
      const value = address.value.trim();
      if (!value || value==='skybit://nexus') { content.innerHTML=home(); bindExternal(el); return; }
      const url = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      content.innerHTML = `<div class="empty-state"><i class="fa-solid fa-arrow-up-right-from-square"></i><strong>External destination</strong><p>This demo intentionally does not embed arbitrary sites. Use the button below to open the URL in a new browser tab.</p><button class="tool-button primary" data-open-external><i class="fa-solid fa-up-right-from-square"></i> Open securely</button></div>`;
      content.querySelector('[data-open-external]')?.addEventListener('click',()=>window.open(url,'_blank','noopener,noreferrer'));
    };
    el.querySelector('[data-go]')?.addEventListener('click',navigate);
    address.addEventListener('keydown',e=>{ if(e.key==='Enter') navigate(); });
    el.querySelector('[data-refresh]')?.addEventListener('click',()=>{ content.innerHTML=home(); bindExternal(el); });
    el.querySelector('[data-back]')?.addEventListener('click',()=>{ address.value='skybit://nexus'; content.innerHTML=home(); bindExternal(el); });
    bindExternal(el);
  }
  function home(){
    return `<div class="browser-hero"><div class="app-kicker">SKYBIT / NEXUS WEB RUNTIME</div><h2>Build. Explore. Iterate.</h2><p>A lightweight browser surface for the OS showcase. Bookmarks below demonstrate real links without forcing third-party pages into an iframe.</p><div class="browser-cards">${cards.map((c,i)=>`<div class="browser-card"><i class="${c[0]}"></i><strong>${c[1]}</strong><span>${c[2]}</span><button class="tool-button" data-url="${c[3]}" style="margin-top:9px">Open</button></div>`).join('')}</div></div>`;
  }
  function bindExternal(el){ el.querySelectorAll('[data-url]').forEach(b=>b.addEventListener('click',()=>window.open(b.dataset.url,'_blank','noopener,noreferrer'))); }
  window.mountBrowser = mount;
})();
