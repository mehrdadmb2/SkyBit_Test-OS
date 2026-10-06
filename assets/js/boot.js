/* SkyBit OS 2.0 — cinematic matrix boot sequence. */
(() => {
  const screen = document.getElementById('boot-screen');
  if (!screen) return;
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas?.getContext('2d');
  const log = document.getElementById('boot-log');
  const progress = document.getElementById('loading-progress');
  const percent = document.getElementById('loading-percent');
  const status = document.getElementById('boot-status');
  const countLabel = document.getElementById('boot-stream-count');
  const skip = document.getElementById('boot-skip');

  const glyphs = ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ン','零','一','二','三','四','五','六','七','八','九','未来','接続','核','空','星','>','/','_'];
  let columns = [], drops = [], raf = 0, matrixEnabled = true;

  function resize() {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const font = 14;
    const count = Math.ceil(window.innerWidth / font);
    columns = Array.from({length:count}, (_,i) => i * font);
    drops = columns.map(() => Math.floor(Math.random() * window.innerHeight / font));
  }
  function drawMatrix() {
    if (!ctx || !matrixEnabled) return;
    ctx.fillStyle = 'rgba(2,4,10,.11)';
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    ctx.font = '13px "Noto Sans JP", monospace';
    for (let i=0;i<columns.length;i++) {
      const x = columns[i];
      const y = drops[i] * 15;
      const char = glyphs[Math.floor(Math.random()*glyphs.length)];
      const bright = Math.random() > .985;
      ctx.fillStyle = bright ? 'rgba(220,255,255,.9)' : `rgba(76,232,255,${0.12 + Math.random()*.32})`;
      ctx.fillText(char, x, y);
      if (y > window.innerHeight && Math.random() > .975) drops[i] = 0;
      drops[i] += 1;
    }
    raf = requestAnimationFrame(drawMatrix);
  }
  resize();
  drawMatrix();
  window.addEventListener('resize', resize);

  const messages = [
    ['00:00:01','BIOS handshake complete','OK'],
    ['00:00:02','Verifying secure boot signature','OK'],
    ['00:00:03','Mounting NEXUS kernel image','OK'],
    ['00:00:04','Scanning memory topology / 32 GB virtual pool','OK'],
    ['00:00:05','Calibrating holographic compositor','OK'],
    ['00:00:06','Loading Japanese glyph matrix','OK'],
    ['00:00:07','Spawning telemetry bus / channel 07F','OK'],
    ['00:00:08','Linking workspace packages','OK'],
    ['00:00:09','Initializing window manager','OK'],
    ['00:00:10','Negotiating simulated network state','SYNC'],
    ['00:00:11','Indexing projects / repositories','OK'],
    ['00:00:12','Compiling visual shader layers','OK'],
    ['00:00:13','Starting developer services','OK'],
    ['00:00:14','Mounting local preferences','OK'],
    ['00:00:15','Priming system notifications','OK'],
    ['00:00:16','Activating desktop environment','READY'],
    ['00:00:17','Entering showcase mode / 歓迎','READY']
  ];

  const total = messages.length;
  let current = 0;
  let timer = null;
  let finished = false;

  function addLine(data) {
    const [time, msg, tag] = data;
    const el = document.createElement('div');
    el.className = 'boot-log-line';
    el.innerHTML = `<span class="time">${time}</span><span class="message"></span><span class="tag">${tag}</span>`;
    el.querySelector('.message').textContent = msg;
    log.appendChild(el);
    if (log.children.length > 7) log.removeChild(log.firstElementChild);
  }
  function updateCount() { countLabel.textContent = `${String(current).padStart(2,'0')} / ${String(total).padStart(2,'0')}`; }
  function step() {
    if (current >= total) return finish();
    addLine(messages[current]);
    current += 1;
    const value = Math.min(100, Math.round(current / total * 100));
    progress.style.width = `${value}%`;
    percent.textContent = `${value}%`;
    status.textContent = messages[current-1][1];
    updateCount();
    const nextDelay = current < 4 ? 230 : current < 11 ? 135 : 105;
    timer = setTimeout(step, nextDelay);
  }
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    progress.style.width = '100%';
    percent.textContent = '100%';
    status.textContent = 'Workspace ready — launching desktop';
    updateCount();
    setTimeout(() => {
      screen.classList.add('boot-finished');
      setTimeout(() => {
        screen.remove();
        document.getElementById('desktop')?.classList.remove('hidden');
        window.initializeDesktop?.();
        window.startClock?.();
        window.startDesktopAnimations?.();
      }, 520);
    }, 700);
  }

  skip?.addEventListener('click', () => {
    current = total;
    finish();
  });

  window.addEventListener('load', () => setTimeout(step, 420), { once:true });
})();
