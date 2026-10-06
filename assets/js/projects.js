/* SkyBit OS 2.0 — project showcase grid. */
(() => {
  const projects = [
    {name:'SkyBit OS', desc:'Cinematic browser desktop with Matrix boot, glass windows and modular apps.', icon:'fa-solid fa-cube', tags:['HTML','CSS','JS'], state:'ACTIVE'},
    {name:'EventScope', desc:'Universal telemetry and analytics concept connecting web, APIs, bots and cloud services.', icon:'fa-solid fa-radar', tags:['Telemetry','Analytics','Cloud'], state:'CONCEPT'},
    {name:'ArzPulse', desc:'Crypto and gold market monitoring interface with futuristic market pulse aesthetics.', icon:'fa-solid fa-chart-column', tags:['Crypto','Bot','Realtime'], state:'CONCEPT'},
    {name:'GeoPulse', desc:'Location intelligence experiment with maps, status reporting and automation.', icon:'fa-solid fa-location-crosshairs', tags:['Maps','Worker','D1'], state:'LAB'},
    {name:'V2ray Sub Radar', desc:'Subscription radar concept for protocol, server and availability visualization.', icon:'fa-solid fa-satellite-dish', tags:['Network','Radar','Bot'], state:'LAB'},
    {name:'SmartHome Hub', desc:'Hybrid IoT control architecture with ESP32, local fallback and dashboards.', icon:'fa-solid fa-house-signal', tags:['ESP32','IoT','Local'], state:'FIELD'}
  ];
  function mount(){
    const body=`<div class="window-inner"><div class="app-heading"><div><div class="app-kicker">WORKSPACE / SHOWCASE</div><h2>Projects</h2><p>A cinematic portfolio surface for prototypes, automations and engineering experiments.</p></div><span class="badge badge-purple">${projects.length} MODULES</span></div><div class="project-grid">${projects.map(p=>`<article class="project-card"><span class="project-state">${p.state}</span><div class="project-icon"><i class="${p.icon}"></i></div><h3>${p.name}</h3><p>${p.desc}</p><div class="project-tags">${p.tags.map(t=>`<span class="project-tag">${t}</span>`).join('')}</div></article>`).join('')}</div></div>`;
    SkyBitWindow.fill('projects',body,`<span class="tool-button primary"><i class="fa-solid fa-layer-group"></i> All projects</span><span class="tool-button">Showcase mode</span>`,`${projects.length} project modules`);
  }
  window.mountProjects=mount;
})();
