// Home-only behavior: visual canvas, counters, FAQ, parallax and service interactions.
const isTouchDevice='ontouchstart' in window || navigator.maxTouchPoints>0;

// ===== HERO CANVAS =====
const heroCanvas=document.getElementById('heroCanvas');
if(heroCanvas){
  const ctx=heroCanvas.getContext('2d');
  let w,h,particles=[];
  function resizeCanvas(){w=heroCanvas.width=heroCanvas.offsetWidth;h=heroCanvas.height=heroCanvas.offsetHeight}
  resizeCanvas();window.addEventListener('resize',resizeCanvas);
  const particleCount=window.innerWidth<768?25:50;
  for(let i=0;i<particleCount;i++){
    particles.push({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
      r:Math.random()*2+.5,
      o:Math.random()*.5+.2
    });
  }
  function drawParticles(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>w)p.vx*=-1;
      if(p.y<0||p.y>h)p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(15,118,110,${p.o})`;
      ctx.fill();
    });
    particles.forEach((a,i)=>{
      particles.slice(i+1).forEach(b=>{
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<100){
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=`rgba(15,118,110,${.15*(1-d/100)})`;
          ctx.lineWidth=.5;ctx.stroke();
        }
      });
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ===== HERO IRIS TRACKING =====
const heroIris=document.getElementById('heroIris');
const heroPupil=document.getElementById('heroPupil');
if(!isTouchDevice){
  document.addEventListener('mousemove',e=>{
    if(!heroIris||!heroPupil)return;
    const rect=heroIris.getBoundingClientRect();
    const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
    const dx=e.clientX-cx,dy=e.clientY-cy;
    const dist=Math.hypot(dx,dy);
    const maxPupil=30;
    const factor=Math.min(dist/400,1);
    const px=(dx/(dist+1))*maxPupil*factor;
    const py=(dy/(dist+1))*maxPupil*factor;
    heroPupil.style.transform=`translate(calc(-50% + ${px}px),calc(-50% + ${py}px))`;
  });
}

// ===== CTA CANVAS =====
const ctaCanvas=document.getElementById('ctaCanvas');
if(ctaCanvas){
  const ctx=ctaCanvas.getContext('2d');
  let w,h,orbs=[];
  function resizeCta(){w=ctaCanvas.width=ctaCanvas.offsetWidth;h=ctaCanvas.height=ctaCanvas.offsetHeight}
  resizeCta();window.addEventListener('resize',resizeCta);
  const orbCount=window.innerWidth<768?3:6;
  for(let i=0;i<orbCount;i++){
    orbs.push({
      x:Math.random()*w,y:Math.random()*h,
      vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5,
      r:Math.random()*200+100,
      c:i%2===0?'rgba(94,234,212,.15)':'rgba(200,149,109,.1)'
    });
  }
  function drawOrbs(){
    ctx.clearRect(0,0,w,h);
    orbs.forEach(o=>{
      o.x+=o.vx;o.y+=o.vy;
      if(o.x<-o.r)o.x=w+o.r;
      if(o.x>w+o.r)o.x=-o.r;
      if(o.y<-o.r)o.y=h+o.r;
      if(o.y>h+o.r)o.y=-o.r;
      const grad=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
      grad.addColorStop(0,o.c);
      grad.addColorStop(1,'transparent');
      ctx.fillStyle=grad;
      ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,Math.PI*2);ctx.fill();
    });
    requestAnimationFrame(drawOrbs);
  }
  drawOrbs();
}

// ===== REVEAL =====
function initReveal(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}});
  },{threshold:.1});
  document.querySelectorAll('.reveal,.reveal-stagger,.img-reveal').forEach(el=>obs.observe(el));
}
initReveal();

// ===== STATS RINGS =====
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.stat-ring').forEach(ring=>ring.classList.add('animate'));
      statsObs.disconnect();
    }
  });
},{threshold:.3});
const statsSection=document.querySelector('.stats');
if(statsSection)statsObs.observe(statsSection);

// ===== COUNTERS =====
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target,target=+el.dataset.count;
      let cur=0,step=target/50;
      const t=setInterval(()=>{
        cur+=step;
        if(cur>=target){cur=target;clearInterval(t)}
        el.textContent=Math.floor(cur).toLocaleString('fr-FR');
      },30);
      countObs.unobserve(el);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));

// ===== TIMELINE PROGRESS =====
const timelineSection=document.getElementById('timeline');
const timelineProgress=document.getElementById('timelineProgress');
if(timelineSection&&timelineProgress){
  window.addEventListener('scroll',()=>{
    const rect=timelineSection.getBoundingClientRect();
    const sectionTop=rect.top;
    const sectionHeight=rect.height;
    const windowHeight=window.innerHeight;
    if(sectionTop<windowHeight&&sectionTop+sectionHeight>0){
      const progress=Math.min(Math.max((windowHeight-sectionTop)/(sectionHeight+windowHeight),0),1);
      timelineProgress.style.height=(progress*100)+'%';
    }
  },{passive:true});
}

// ===== FAQ =====
document.querySelectorAll('.faq-item').forEach(item=>{
  item.addEventListener('click',()=>{
    const isOpen=item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
    if(!isOpen)item.classList.add('open');
  });
});

// ===== PARALLAX IMAGES =====
window.addEventListener('scroll',()=>{
  document.querySelectorAll('.about-img-main img, .urgence-visual img').forEach(img=>{
    const rect=img.getBoundingClientRect();
    const center=rect.top+rect.height/2;
    const offset=(center-window.innerHeight/2)*0.05;
    img.style.transform=`translateY(${offset}px) scale(1.05)`;
  });
},{passive:true});

// ===== MAGNETIC BUTTONS (desktop only) =====
if(!isTouchDevice){
  document.querySelectorAll('.btn-primary').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const rect=btn.getBoundingClientRect();
      const x=e.clientX-rect.left-rect.width/2;
      const y=e.clientY-rect.top-rect.height/2;
      btn.style.transform=`translate(${x*0.15}px,${y*0.25}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave',()=>{
      btn.style.transform='';
    });
  });
}

// ===== SERVICES DRAG SCROLL =====
const servicesScroll=document.getElementById('servicesScroll');
if(servicesScroll){
  let isDown=false,startX,scrollLeft;
  servicesScroll.addEventListener('mousedown',e=>{
    isDown=true;servicesScroll.style.cursor='grabbing';
    startX=e.pageX-servicesScroll.offsetLeft;
    scrollLeft=servicesScroll.scrollLeft;
  });
  servicesScroll.addEventListener('mouseleave',()=>{isDown=false;servicesScroll.style.cursor=''});
  servicesScroll.addEventListener('mouseup',()=>{isDown=false;servicesScroll.style.cursor=''});
  servicesScroll.addEventListener('mousemove',e=>{
    if(!isDown)return;
    e.preventDefault();
    const x=e.pageX-servicesScroll.offsetLeft;
    const walk=(x-startX)*1.5;
    servicesScroll.scrollLeft=scrollLeft-walk;
  });
}
