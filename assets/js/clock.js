/* SkyBit OS 2.0 — clock, date and session time. */
(() => {
  function tick(){
    const now=new Date();
    const clock=document.getElementById('clock'); const date=document.getElementById('date'); const rail=document.getElementById('rail-session'); const qDate=document.getElementById('quick-date');
    if(clock) clock.textContent=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    if(date) date.textContent=now.toLocaleDateString([], {weekday:'short',month:'short',day:'numeric'}).toUpperCase();
    if(rail){ const sec=Math.floor((Date.now()-SkyBit.state.sessionStart)/1000); const h=String(Math.floor(sec/3600)).padStart(2,'0'); const m=String(Math.floor(sec/60)%60).padStart(2,'0'); const s=String(sec%60).padStart(2,'0'); rail.textContent=`SESSION ${h}:${m}:${s}`; }
    if(qDate) qDate.textContent=now.toLocaleDateString([], {month:'short',day:'numeric'});
  }
  window.startClock=()=>{tick();setInterval(tick,1000);};
})();
