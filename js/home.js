// ===== LOADER =====
const loaderPercent=document.getElementById('loaderPercent');
let loadProg=0;
const loadInterval=setInterval(()=>{
  loadProg+=Math.random()*8;
  if(loadProg>=100){loadProg=100;clearInterval(loadInterval)}
  loaderPercent.textContent=String(Math.floor(loadProg)).padStart(2,'0');
},60);
const finishLoader=()=>{
  const el=document.getElementById('loader');
  if(el) el.classList.add('done');
};
window.addEventListener('load',()=>setTimeout(finishLoader,450),{once:true});
setTimeout(finishLoader,1800);

// ===== BURGER MENU =====
const burger=document.getElementById('burger');
const mobileMenu=document.getElementById('mobileMenu');
burger.addEventListener('click',()=>{
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow=mobileMenu.classList.contains('open')?'hidden':'';
});

// ===== CURSOR =====
const isTouchDevice='ontouchstart' in window || navigator.maxTouchPoints>0;
const dot=document.getElementById('cursorDot'),ring=document.getElementById('cursorRing'),label=document.getElementById('cursorLabel');
let mx=0,my=0,rx=0,ry=0;

if(!isTouchDevice){
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
  function animCursor(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';label.style.left=(rx+60)+'px';label.style.top=ry+'px';requestAnimationFrame(animCursor)}
  animCursor();

  function setupHover(els,lbl,mode){
    els.forEach(el=>{
      el.addEventListener('mouseenter',()=>{
        ring.classList.add(mode||'hover');
        if(lbl){label.textContent=lbl;label.classList.add('show')}
      });
      el.addEventListener('mouseleave',()=>{
        ring.classList.remove('hover');ring.classList.remove('view');
        if(lbl)label.classList.remove('show');
      });
    });
  }
  setupHover(document.querySelectorAll('a:not(.btn-primary),button,.motif,.slot,.cal-day.available,.faq-item'));
  setupHover(document.querySelectorAll('.btn-primary'),'RDV');
  setupHover(document.querySelectorAll('.service-card,.bento-item,.tech-card'),'View','view');
}

// ===== PROGRESS BAR =====
const progressBar=document.getElementById('progressBar');
window.addEventListener('scroll',()=>{
  const h=document.documentElement.scrollHeight-window.innerHeight;
  progressBar.style.width=(window.scrollY/h*100)+'%';
},{passive:true});

// ===== HEADER =====
const header=document.getElementById('header');
window.addEventListener('scroll',()=>{header.classList.toggle('scrolled',window.scrollY>50)},{passive:true});

// ===== NAV DOTS =====
const navDots=document.querySelectorAll('.nav-dot');
const sectionIds=['hero','about','timeline','services','tech','pathologies','urgence','contact'];
window.addEventListener('scroll',()=>{
  let current='hero';
  sectionIds.forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el.getBoundingClientRect().top<window.innerHeight/2)current=id;
  });
  navDots.forEach(d=>d.classList.toggle('active',d.dataset.section===current));
},{passive:true});
navDots.forEach(d=>{
  d.addEventListener('click',()=>{
    const target=document.getElementById(d.dataset.section);
    if(target)target.scrollIntoView({behavior:'smooth'});
  });
});

// ===== PAGE TRANSITION =====
const pageTransition=document.getElementById('pageTransition');
function showPage(hash){
  const id=hash==='#rdv'?'page-rdv':'page-home';
  const currentPage=document.querySelector('.page.active');
  if(currentPage&&currentPage.id===id)return;
  // Close mobile menu if open
  if(mobileMenu.classList.contains('open')){
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow='';
  }
  pageTransition.classList.add('active');
  setTimeout(()=>{
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav a[data-link]').forEach(a=>a.classList.remove('active'));
    document.querySelectorAll(`.nav a[href="${hash}"]`).forEach(a=>a.classList.add('active'));
    window.scrollTo({top:0,behavior:'instant'});
    setTimeout(initReveal,50);
  },500);
  setTimeout(()=>{pageTransition.classList.remove('active')},1000);
}
window.addEventListener('hashchange',()=>showPage(location.hash||'#home'));
document.querySelectorAll('[data-link]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(href.startsWith('#')){
      e.preventDefault();
      location.hash=href;
      showPage(href);
    }
  });
});
showPage(location.hash||'#home');

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
