/* SkyBit OS 2.0 — low-cost canvas particle field. */
(() => {
  let enabled=true, raf=0, particles=[], ctx, canvas;
  function init(){
    canvas=document.getElementById('space-canvas'); if(!canvas)return;
    ctx=canvas.getContext('2d'); resize(); window.addEventListener('resize',resize); reset(); draw();
  }
  function resize(){ if(!canvas)return; const dpr=Math.min(devicePixelRatio||1,1.4); canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0); }
  function reset(){ particles=Array.from({length:Math.min(100,Math.floor(innerWidth/13))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.1,r:Math.random()*1.2+.2,a:Math.random()*.55+.12})); }
  function draw(){
    if(ctx && enabled){ ctx.clearRect(0,0,innerWidth,innerHeight); for(const p of particles){ p.x+=p.vx;p.y+=p.vy;if(p.x<-10)p.x=innerWidth+10;if(p.x>innerWidth+10)p.x=-10;if(p.y<-10)p.y=innerHeight+10;if(p.y>innerHeight+10)p.y=-10; ctx.beginPath();ctx.fillStyle=`rgba(120,220,255,${p.a})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill(); } }
    raf=requestAnimationFrame(draw);
  }
  window.SkyBitSpace={setEnabled(v){enabled=!!v;if(!enabled&&ctx)ctx.clearRect(0,0,innerWidth,innerHeight);}};
  window.startDesktopAnimations=init;
})();
