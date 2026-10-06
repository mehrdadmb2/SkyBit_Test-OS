/* SkyBit OS 2.0 — simulated developer terminal. */
(() => {
  const commands = {
    help: 'help  clear  neofetch  status  projects  open <app>  theme <night|ice|amber|mono>  time  about  echo <text>',
    neofetch: `SKYBIT OS // NEXUS\nKernel: NX-K 2.0.0\nShell: skysh 1.4\nRuntime: Browser Sandbox\nVisual Core: Glass/Matrix\nNetwork: Simulated / Online\nBuild: SHOWCASE`,
    status: 'Kernel online\nWindow manager online\nVisual compositor online\nNotification bus online\nAll user-space modules nominal.',
    projects: 'SkyBit OS\nEventScope\nArzPulse\nGeoPulse\nV2ray Sub Radar\nSmartHome Hybrid IoT',
    about: 'SkyBit OS is a fictional browser-based operating system showcase — deliberately visual, interactive and dependency-light.',
    time: () => new Date().toLocaleString()
  };

  function mount() {
    const body = `
      <div class="terminal-screen">
        <div class="terminal-output" data-terminal-output></div>
        <div class="term-prompt"><span class="prompt">skybit@nexus:~$</span><input class="term-input" data-term-input autocomplete="off" spellcheck="false" aria-label="Terminal input"></div>
      </div>`;
    const el = SkyBitWindow.fill('terminal', body, `<span class="tool-button"><i class="fa-solid fa-circle" style="color:var(--green)"></i> LIVE SHELL</span><span class="tool-button">skysh 1.4</span>`, 'Interactive shell');
    if (!el) return;
    const out = el.querySelector('[data-terminal-output]');
    const input = el.querySelector('[data-term-input]');
    const history = [];
    let pos = 0;
    const print = (txt, cls='info') => {
      const node = document.createElement('div');
      node.className = `term-line ${cls}`;
      node.textContent = txt;
      out.appendChild(node);
      el.querySelector('.terminal-screen').scrollTop = el.querySelector('.terminal-screen').scrollHeight;
    };
    print('NEXUS SHELL // SKYBIT OS 2.0', 'success');
    print('Type "help" for available commands.', 'info');
    input.focus();
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const raw = input.value.trim();
        if (!raw) return;
        history.push(raw); pos=history.length;
        print(`skybit@nexus:~$ ${raw}`, 'info');
        run(raw, print);
        input.value='';
      } else if (e.key === 'ArrowUp') { e.preventDefault(); pos=Math.max(0,pos-1); input.value=history[pos] || ''; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); pos=Math.min(history.length,pos+1); input.value=history[pos] || ''; }
    });
    el.querySelector('.terminal-screen').addEventListener('click', () => input.focus());
  }

  function run(raw, print) {
    const parts = raw.split(/\s+/); const cmd=parts.shift().toLowerCase(); const arg=parts.join(' ');
    if (cmd === 'clear') { document.querySelector('.os-window[data-app-id="terminal"] [data-terminal-output]').innerHTML=''; return; }
    if (cmd === 'echo') { print(arg || '', 'success'); return; }
    if (cmd === 'open') { if (SkyBit.apps[arg]) { window.openApp(arg); print(`Launching ${SkyBit.apps[arg].title}...`,'success'); } else print(`Unknown app: ${arg}`,'error'); return; }
    if (cmd === 'theme') {
      const map={night:'night',ice:'ice',amber:'amber',mono:'mono'};
      if (!map[arg]) { print('theme: choose night | ice | amber | mono','warn'); return; }
      SkyBit.state.settings.theme=map[arg]; window.applySkyBitSettings?.(); print(`Theme switched to ${arg}.`,'success'); return;
    }
    const value = commands[cmd];
    if (typeof value === 'function') { print(value(),'success'); return; }
    if (typeof value === 'string') { print(value, cmd==='status'||cmd==='neofetch' ? 'success':'info'); return; }
    print(`Command not found: ${cmd}. Type "help".`, 'error');
  }

  window.mountTerminal = mount;
})();
