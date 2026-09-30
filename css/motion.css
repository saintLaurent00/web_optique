/* =========================================================
   PRECISION IN MOTION — COMPLETE MOTION ORCHESTRATOR
   ========================================================= */

(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)');
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];
  const SECTION_SELECTORS = ['.marquee','.stats','.section','.timeline-section','.services-section','.tech-section','.patho-section','.journey-section','.urgence-section','.testimonials','.faq-section','.contact-section','.cta-final','.footer','.rdv-hero'];

  function revealTargets(){
    const explicit=qsa('[data-motion], .motion-reveal, .reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-stagger');
    const semantic=qsa(['.section-tag','.section-title','.section-lead','.about-content','.about-visual','.about-feat','.stat-card','.timeline-item','.service-card','.tech-card','.bento-item','.journey-step','.urgence-visual','.urgence-item','.testi','.faq-item','.contact-row','.contact-form','.cta-final .section-tag','.cta-final h2','.cta-final p','.cta-final .btn-primary'].join(','));
    const all=[...new Set([...explicit,...semantic])];
    if(reduceMotion.matches || !('IntersectionObserver' in window)){all.forEach(el=>el.classList.add('is-visible','visible'));return;}
    all.forEach(el=>{if(!el.dataset.motion && !el.classList.contains('reveal') && !el.classList.contains('reveal-up') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right') && !el.classList.contains('reveal-stagger')) el.dataset.motion='up';});
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-visible','visible');observer.unobserve(entry.target);}),{threshold:.12,rootMargin:'0px 0px -7% 0px'});
    all.forEach(el=>observer.observe(el));
  }

  function header(){
    const header=qs('.header'); if(!header)return; let ticking=false;
    const update=()=>{header.classList.toggle('scrolled',scrollY>32);qs('.hero')?.classList.toggle('is-scrolling',scrollY>80);ticking=false;};
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true}); update();
  }

  function globalScrollProgress(){
    const bar=qs('.progress-bar');if(!bar)return;let ticking=false;
    const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;const p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;bar.style.width=(p*100)+'%';ticking=false;};
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();
  }

  function sectionProgress(){
    const sections=qsa(SECTION_SELECTORS.join(','));const dots=qsa('.nav-dot');if(!sections.length)return;let ticking=false;
    const update=()=>{let active=0,best=Infinity;sections.forEach((s,i)=>{const r=s.getBoundingClientRect();const d=Math.abs(r.top-innerHeight*.38);if(d<best){best=d;active=i;}});dots.forEach((d,i)=>d.classList.toggle('active',i===active));ticking=false;};
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();
  }

  function heroIris(){
    const iris=qs('.hero-iris'),pupil=qs('.hero-pupil');if(!iris||!pupil||reduceMotion.matches||coarsePointer.matches)return;let tx=0,ty=0,cx=0,cy=0;
    addEventListener('mousemove',e=>{const r=iris.getBoundingClientRect();tx=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-.5)*2));ty=Math.max(-1,Math.min(1,((e.clientY-r.top)/r.height-.5)*2));},{passive:true});
    const render=()=>{cx+=(tx-cx)*.075;cy+=(ty-cy)*.075;pupil.style.transform='translate(calc(-50% + '+(cx*10)+'px), calc(-50% + '+(cy*10)+'px))';requestAnimationFrame(render);};requestAnimationFrame(render);
    qsa('.hero .btn-primary').forEach(btn=>{btn.addEventListener('mouseenter',()=>{pupil.style.width='154px';pupil.style.height='154px';});btn.addEventListener('mouseleave',()=>{pupil.style.width='';pupil.style.height='';});});
  }

  function timeline(){
    const section=qs('.timeline-section'),items=qsa('.timeline-item'),progress=qs('.timeline-progress');if(!section||!items.length)return;
    if(reduceMotion.matches){items.forEach(i=>i.classList.add('visible'));if(progress)progress.style.height='100%';return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');}),{threshold:.2});items.forEach(item=>observer.observe(item));
    if(progress){let ticking=false;const update=()=>{const rect=section.getBoundingClientRect();const start=innerHeight*.65,end=innerHeight*.15;const p=Math.max(0,Math.min(1,(start-rect.top)/Math.max(1,rect.height-(start-end))));progress.style.height=(p*100)+'%';ticking=false;};addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();}
  }

  function journey(){
    const section=qs('.journey-section'),steps=qsa('.journey-step');if(!section||!steps.length)return;
    if(reduceMotion.matches){steps.forEach(s=>s.classList.add('visible'));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)entry.target.classList.add('visible');}),{threshold:.25});steps.forEach(step=>observer.observe(step));
    const journey=qs('.journey',section);if(!journey||coarsePointer.matches)return;const line=document.createElement('div');line.className='journey-progress';journey.prepend(line);let ticking=false;
    const update=()=>{const rect=journey.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight*.72-rect.top)/Math.max(1,rect.height)));line.style.width=(p*80)+'%';ticking=false;};addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true;}},{passive:true});update();
  }

  function technology(){const section=qs('.tech-section');if(!section)return;if(reduceMotion.matches){section.classList.add('scan-active');return;}const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;section.classList.add('scan-active');observer.unobserve(section);}),{threshold:.3});observer.observe(section);}

  function servicesDrag(){
    const track=qs('.services-scroll');if(!track||coarsePointer.matches)return;let down=false,startX=0,startScroll=0;
    track.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;startScroll=track.scrollLeft;track.setPointerCapture?.(e.pointerId);});
    track.addEventListener('pointermove',e=>{if(down)track.scrollLeft=startScroll-(e.clientX-startX);});
    ['pointerup','pointercancel'].forEach(t=>track.addEventListener(t,()=>{down=false;}));
  }

  function cursor(){
    if(reduceMotion.matches||coarsePointer.matches)return;const dot=qs('.cursor-dot'),ring=qs('.cursor-ring');if(!dot||!ring)return;let x=innerWidth/2,y=innerHeight/2,rx=x,ry=y;
    addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;},{passive:true});
    const render=()=>{rx+=(x-rx)*.16;ry+=(y-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';dot.style.left=x+'px';dot.style.top=y+'px';requestAnimationFrame(render);};requestAnimationFrame(render);
    qsa('a,button,.slot,.cal-day,.motif,.faq-item').forEach(el=>{el.addEventListener('mouseenter',()=>ring.classList.add('hover'));el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));});
  }

  function booking(){
    const steps=qsa('.step'),stepBar=qs('.steps');if(!stepBar)return;const update=()=>{const active=steps.findIndex(s=>s.classList.contains('active'));const i=Math.max(0,active);stepBar.style.setProperty('--booking-progress',(((i+1)/Math.max(1,steps.length))*100)+'%');stepBar.classList.add('booking-progress');};update();
    new MutationObserver(update).observe(stepBar,{attributes:true,subtree:true,attributeFilter:['class']});
    const container=qs('.rdv-container');if(!container)return;
    new MutationObserver(()=>{qsa('.slot,.cal-day,.motif',container).forEach(el=>{if(el.dataset.motionBound)return;el.dataset.motionBound='1';el.addEventListener('click',()=>el.animate([{transform:'scale(1)'},{transform:'scale(.965)'},{transform:'scale(1)'}],{duration:220,easing:'cubic-bezier(.16,1,.3,1)'}));});update();}).observe(container,{childList:true,subtree:true});
  }

  function pageTransition(){const loader=qs('.loader');if(!loader)return;const finish=()=>{if(!loader.classList.contains('done'))loader.classList.add('done');};if(document.readyState==='complete')setTimeout(finish,300);else addEventListener('load',()=>setTimeout(finish,300),{once:true});}

  function init(){qs('.hero')?.classList.add('is-motion-ready');revealTargets();header();globalScrollProgress();sectionProgress();heroIris();timeline();journey();technology();servicesDrag();cursor();booking();pageTransition();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();