/* SkyBit OS 2.0 — live synthetic dashboard metrics. */
(() => {
  function mount() {
    const body = `<div class="window-inner">
      <div class="app-heading"><div><div class="app-kicker">SYSTEM TELEMETRY</div><h2>Nexus Dashboard</h2><p>Live synthetic metrics designed for a cinematic system-monitor effect. No real device telemetry is collected.</p></div><span class="badge badge-green">● LIVE</span></div>
      <div class="stat-grid">
        ${card('CPU LOAD','34%','virtual workload',38,'var(--cyan)')}
        ${card('MEMORY','11.8 GB','virtual pool 32 GB',36,'var(--violet)')}
        ${card('UPTIME','12:48:21','session runtime',68,'var(--green)')}
        ${card('NODES','24 / 24','healthy links',100,'var(--pink)')}
      </div>
      <div class="dashboard-layout">
        <div class="panel-card"><div class="panel-card-head"><span>ACTIVITY STREAM</span><span id="dash-clock">--:--:--</span></div><div class="activity-list" data-activity-list>${rows()}</div></div>
        <div class="panel-card"><div class="panel-card-head"><span>RESOURCE MIX</span><span>LIVE</span></div><div class="kpi-bars"><div class="kpi-line"><span>Render</span><div class="bar"><span data-kpi="render" style="width:62%"></span></div><b data-kpi-value="render">62%</b></div><div class="kpi-line"><span>Scripts</span><div class="bar"><span data-kpi="script" style="width:41%"></span></div><b data-kpi-value="script">41%</b></div><div class="kpi-line"><span>Canvas</span><div class="bar"><span data-kpi="canvas" style="width:76%"></span></div><b data-kpi-value="canvas">76%</b></div><div class="kpi-line"><span>Storage</span><div class="bar"><span data-kpi="storage" style="width:28%"></span></div><b data-kpi-value="storage">28%</b></div></div></div>
      </div>
    </div>`;
    const el = SkyBitWindow.fill('dashboard', body, `<span class="tool-button"><i class="fa-solid fa-gauge-high"></i> Telemetry</span><span class="tool-button">Synthetic</span>`, 'Telemetry refresh 1s');
    if (!el) return;
    const update = () => {
      const vals={render:rand(46,88),script:rand(22,64),canvas:rand(52,91),storage:rand(21,34)};
      Object.entries(vals).forEach(([k,v])=>{ el.querySelector(`[data-kpi="${k}"]`).style.width=v+'%'; el.querySelector(`[data-kpi-value="${k}"]`).textContent=v+'%'; });
      const dashClock=el.querySelector('#dash-clock'); if(dashClock) dashClock.textContent=new Date().toLocaleTimeString();
      const cpu=el.querySelector('.stat-card:nth-child(1) .value'); if(cpu) cpu.textContent=rand(18,69)+'%';
    };
    update(); el._dashTimer=setInterval(update,1100); el.addEventListener('DOMNodeRemoved',()=>clearInterval(el._dashTimer));
  }
  function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
  function card(label,value,meta,percent){ return `<div class="stat-card"><div class="label">${label}</div><div class="value">${value}</div><div class="meta">${meta}</div><div class="progress-mini"><span style="width:${percent}%"></span></div></div>`; }
  function rows(){ return [['Kernel heartbeat','Core scheduler acknowledged.','NOW'],['Project indexer','12 workspace entries synchronized.','15s'],['Visual core','Shader layers calibrated.','31s'],['Network bus','Synthetic uplink stable.','58s'],['Notification bus','No delivery failures.','2m'],['Workspace','Showcase profile active.','3m']].map((r,i)=>`<div class="activity-row"><span class="a-dot" style="opacity:${1-i*.11}"></span><div><strong>${r[0]}</strong><span>${r[1]}</span></div><time>${r[2]}</time></div>`).join(''); }
  window.mountDashboard=mount;
})();
