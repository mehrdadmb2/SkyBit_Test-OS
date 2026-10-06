/* SkyBit OS 2.0 — small browser-side utilities. */
(() => {
  function mount(){
    const body=`<div class="tool-grid">
      <article class="tool-card"><h3>JSON Pretty</h3><p>Format compact JSON for quick inspection.</p><textarea class="tool-textarea" data-json-in placeholder='{"skybit":true}'></textarea><button class="tool-button primary" data-json-btn style="margin-top:7px">Format</button><div class="tool-result" data-json-out>—</div></article>
      <article class="tool-card"><h3>Base64</h3><p>Encode or decode UTF-8 text.</p><textarea class="tool-textarea" data-b64-in placeholder="SkyBit OS"></textarea><div style="display:flex;gap:6px;margin-top:7px"><button class="tool-button primary" data-b64-enc>Encode</button><button class="tool-button" data-b64-dec>Decode</button></div><div class="tool-result" data-b64-out>—</div></article>
      <article class="tool-card"><h3>Color Inspector</h3><p>Pick an accent and preview it in the current theme.</p><input class="tool-input" data-color-input type="color" value="#4ce8ff" style="padding:3px;height:34px"><div class="tool-result" data-color-out>#4CE8FF</div></article>
      <article class="tool-card"><h3>Timestamp</h3><p>Generate current Unix and ISO timestamps.</p><button class="tool-button primary" data-time-btn>Generate</button><div class="tool-result" data-time-out>—</div></article>
    </div>`;
    const el=SkyBitWindow.fill('tools',body,'<span class="tool-button"><i class="fa-solid fa-wand-magic-sparkles"></i> Client-side tools</span>','No data leaves this page');
    if(!el)return;
    el.querySelector('[data-json-btn]').onclick=()=>{try{el.querySelector('[data-json-out]').textContent=JSON.stringify(JSON.parse(el.querySelector('[data-json-in]').value),null,2);}catch{el.querySelector('[data-json-out]').textContent='Invalid JSON';}};
    el.querySelector('[data-b64-enc]').onclick=()=>{try{el.querySelector('[data-b64-out]').textContent=btoa(unescape(encodeURIComponent(el.querySelector('[data-b64-in]').value)));}catch{el.querySelector('[data-b64-out]').textContent='Encode failed';}};
    el.querySelector('[data-b64-dec]').onclick=()=>{try{el.querySelector('[data-b64-out]').textContent=decodeURIComponent(escape(atob(el.querySelector('[data-b64-in]').value)));}catch{el.querySelector('[data-b64-out]').textContent='Decode failed';}};
    el.querySelector('[data-color-input]').oninput=e=>{el.querySelector('[data-color-out]').textContent=e.target.value.toUpperCase();document.documentElement.style.setProperty('--cyan',e.target.value);};
    el.querySelector('[data-time-btn]').onclick=()=>{const now=new Date();el.querySelector('[data-time-out]').textContent=`Unix: ${Math.floor(now.getTime()/1000)}\nISO: ${now.toISOString()}`;};
  }
  window.mountTools=mount;
})();
