// ===== RDV =====
const state={motif:null,date:null,slot:null,viewDate:new Date()};
const monthNames=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const dayNames=['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

const rdvEls={
  calendar:document.getElementById('calendarSection'),
  slots:document.getElementById('slotsSection'),
  recap:document.getElementById('recapSection'),
  confirm:document.getElementById('confirmSection')
};

function rdvScrollTo(el){
  if(!el)return;
  requestAnimationFrame(()=>setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),40));
}

function setRdvPanel(el,display){
  if(!el)return;
  el.style.display=display;
  el.classList.remove('visible','is-visible');
  requestAnimationFrame(()=>el.classList.add('visible','is-visible'));
}

function resetRdvAfterMotif(){
  state.date=null;
  state.slot=null;
  rdvEls.slots.style.display='none';
  rdvEls.recap.style.display='none';
  rdvEls.confirm.style.display='none';
}

document.querySelectorAll('.motif').forEach(m=>{
  m.addEventListener('click',()=>{
    document.querySelectorAll('.motif').forEach(x=>x.classList.remove('selected'));
    m.classList.add('selected');
    state.motif=m.dataset.motif;
    resetRdvAfterMotif();
    updateSteps(2);
    renderCalendar();
    setRdvPanel(rdvEls.calendar,'block');
    rdvScrollTo(rdvEls.calendar);
  });
});

function updateSteps(n){
  document.querySelectorAll('.step').forEach(s=>{
    const sn=+s.dataset.step;
    s.classList.remove('active','done');
    if(sn<n)s.classList.add('done');
    if(sn===n)s.classList.add('active');
  });
}

function renderCalendar(){
  const calendarDays=document.getElementById('calendarDays');
  const monthTitle=document.getElementById('calMonthYear');
  if(!calendarDays||!monthTitle)return;

  const d=state.viewDate;
  const year=d.getFullYear(),month=d.getMonth();
  monthTitle.textContent=`${monthNames[month]} ${year}`;

  const first=new Date(year,month,1);
  const last=new Date(year,month+1,0);
  const startDay=(first.getDay()+6)%7;
  const today=new Date();
  today.setHours(0,0,0,0);

  let html=dayNames.map(n=>`<div class="cal-day-name">${n}</div>`).join('');
  for(let i=0;i<startDay;i++)html+='<div class="cal-day empty" aria-hidden="true"></div>';

  for(let day=1;day<=last.getDate();day++){
    const date=new Date(year,month,day);
    const dow=date.getDay();
    const isPast=date<today;
    const isWeekend=dow===0||dow===6;
    const isAvailable=!isPast&&!isWeekend;
    const isToday=date.getTime()===today.getTime();
    const isSelected=state.date&&state.date.getTime()===date.getTime();
    let cls='cal-day '+(isAvailable?'available':'disabled');
    if(isToday)cls+=' today';
    if(isSelected)cls+=' selected';
    html+=`<button type="button" class="${cls}" data-day="${day}" ${isAvailable?'':'disabled'}>${day}</button>`;
  }

  calendarDays.innerHTML=html;
  calendarDays.querySelectorAll('.cal-day.available').forEach(el=>{
    el.addEventListener('click',()=>{
      const day=Number(el.dataset.day);
      state.date=new Date(year,month,day);
      state.slot=null;
      updateSteps(3);
      renderCalendar();
      showSlots();
    });
  });

  const prev=document.getElementById('prevMonth');
  if(prev)prev.disabled=(year===today.getFullYear()&&month<=today.getMonth());
}

document.getElementById('prevMonth')?.addEventListener('click',()=>{
  state.viewDate.setMonth(state.viewDate.getMonth()-1);
  renderCalendar();
});

document.getElementById('nextMonth')?.addEventListener('click',()=>{
  state.viewDate.setMonth(state.viewDate.getMonth()+1);
  renderCalendar();
});

function showSlots(){
  if(!state.date)return;
  const slots=['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];
  const seed=state.date.getDate()+state.date.getMonth();
  const available=slots.filter((_,i)=>(i+seed)%3!==0);
  const grid=document.getElementById('slotsGrid');
  const dateLabel=document.getElementById('slotDate');
  if(!grid||!dateLabel)return;

  dateLabel.textContent=state.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  grid.innerHTML=available.map(s=>`<button type="button" class="slot" data-slot="${s}">${s}</button>`).join('');

  grid.querySelectorAll('.slot').forEach(el=>{
    el.addEventListener('click',()=>{
      grid.querySelectorAll('.slot').forEach(x=>x.classList.remove('selected'));
      el.classList.add('selected');
      state.slot=el.dataset.slot;
      updateSteps(4);
      showRecap();
    });
  });

  setRdvPanel(rdvEls.slots,'block');
  rdvScrollTo(rdvEls.slots);
}

function showRecap(){
  if(!state.date||!state.slot)return;
  document.getElementById('recapMotif').textContent=state.motif||'—';
  document.getElementById('recapDate').textContent=state.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  document.getElementById('recapSlot').textContent=state.slot;
  setRdvPanel(rdvEls.recap,'grid');
  rdvScrollTo(rdvEls.recap);
}

function confirmRdv(){
  const name=document.getElementById('fName').value.trim();
  const email=document.getElementById('fEmail').value.trim();
  const phone=document.getElementById('fPhone').value.trim();

  if(!name||!email||!phone){alert('Veuillez remplir tous les champs');return}
  if(!/^[\\d\\s+().-]{10,}$/.test(phone)){alert('Numéro de téléphone invalide');return}

  document.getElementById('confMotif').textContent=state.motif||'—';
  document.getElementById('confDate').textContent=state.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+' à '+state.slot;
  rdvEls.recap.style.display='none';
  setRdvPanel(rdvEls.confirm,'block');
  updateSteps(4);
  rdvScrollTo(rdvEls.confirm);
}

renderCalendar();tml lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dr. Claire Moreau — Ophtalmologue à Paris</title>
<meta name="theme-color" content="#F5F1EA">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-400-normal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-500-normal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-600-normal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/fraunces@latest/latin-700-normal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-300-normal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-400-normal.css" rel="stylesheet">
<style>
:root{
  --sage:#0F766E;
  --sage-dark:#0a5a54;
  --sage-light:#14908a;
  --mint:#5EEAD4;
  --cream:#F5F1EA;
  --cream-2:#EDE8DE;
  --cream-3:#E5DFD2;
  --ink:#0f0f0f;
  --ink-2:#2a2a2a;
  --muted:#7a7a7a;
  --copper:#C8956D;
  --line:rgba(15,15,15,.08);
  --line-dark:rgba(255,255,255,.08);
  --shadow:0 30px 80px -20px rgba(15,118,110,.25);
  --shadow-lg:0 40px 100px -30px rgba(0,0,0,.3);
  --radius:20px;
  --glass:rgba(255,255,255,.55);
  --glass-border:rgba(255,255,255,.6);
  --pad-x:60px;
  --section-pad:160px;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{
  font-family:'Inter',sans-serif;
  background:var(--cream);
  color:var(--ink);
  line-height:1.6;
  overflow-x:hidden;
  cursor:none;
  font-weight:300;
}
body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;
  opacity:.035;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
h1,h2,h3,h4{font-family:'Fraunces',serif;font-weight:400;line-height:1.02;color:var(--ink);letter-spacing:-.025em}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
button{font-family:inherit;cursor:none;border:none;background:none}
::selection{background:var(--sage);color:var(--cream)}

/* ====== LOADER ====== */
.loader{
  position:fixed;inset:0;z-index:10000;
  background:var(--ink);
  display:flex;align-items:center;justify-content:center;flex-direction:column;
  transition:opacity 1.2s cubic-bezier(.77,0,.18,1),visibility 1.2s;
}
.loader.done{opacity:0;visibility:hidden}
.loader-iris{
  width:200px;height:200px;position:relative;
  display:flex;align-items:center;justify-content:center;
}
.loader-iris svg{width:100%;height:100%;animation:loaderSpin 4s linear infinite}
@keyframes loaderSpin{to{transform:rotate(360deg)}}
.loader-pupil{
  position:absolute;width:40px;height:40px;border-radius:50%;
  background:var(--ink);
  animation:loaderPulse 1.4s ease-in-out infinite;
}
@keyframes loaderPulse{0%,100%{transform:scale(1)}50%{transform:scale(.6)}}
.loader-text{
  color:var(--cream);font-family:'Fraunces',serif;
  font-size:14px;letter-spacing:6px;text-transform:uppercase;
  margin-top:40px;opacity:0;animation:loaderText 1.5s .3s forwards;
  font-style:italic;
}
@keyframes loaderText{to{opacity:.7}}
.loader-bar{
  width:200px;height:1px;background:rgba(255,255,255,.1);
  margin-top:24px;overflow:hidden;position:relative;
}
.loader-bar::after{
  content:'';display:block;height:100%;width:0;
  background:var(--mint);animation:loaderFill 2.4s cubic-bezier(.77,0,.18,1) forwards;
}
@keyframes loaderFill{to{width:100%}}
.loader-percent{
  position:absolute;bottom:40px;right:60px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;
  color:rgba(245,241,234,.4);
}
.loader-corner{
  position:absolute;font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;color:rgba(245,241,234,.3);
  text-transform:uppercase;
}
.loader-corner.tl{top:40px;left:60px}
.loader-corner.tr{top:40px;right:60px}
.loader-corner.bl{bottom:40px;left:60px}
.loader-corner.br{bottom:40px;right:60px}

/* ====== CURSOR ====== */
.cursor-dot,.cursor-ring,.cursor-label{
  position:fixed;top:0;left:0;pointer-events:none;z-index:9999;
  border-radius:50%;transform:translate(-50%,-50%);
  mix-blend-mode:difference;
}
.cursor-dot{width:5px;height:5px;background:var(--cream);transition:transform .2s,opacity .3s}
.cursor-ring{width:36px;height:36px;border:1px solid var(--cream);transition:width .4s cubic-bezier(.16,1,.3,1),height .4s cubic-bezier(.16,1,.3,1),border-color .3s,background .3s}
.cursor-ring.hover{width:80px;height:80px;background:var(--cream)}
.cursor-ring.view{width:100px;height:100px;background:var(--cream)}
.cursor-label{
  width:auto;height:auto;border-radius:30px;
  background:transparent;color:var(--ink);
  padding:0;font-size:10px;font-weight:500;
  letter-spacing:2px;text-transform:uppercase;
  opacity:0;transition:opacity .3s;
  white-space:nowrap;mix-blend-mode:difference;
}
.cursor-label.show{opacity:1}

/* ====== PROGRESS ====== */
.progress-bar{
  position:fixed;top:0;left:0;height:1px;width:0;
  background:linear-gradient(90deg,var(--sage),var(--mint));z-index:200;transition:width .1s;
}

/* ====== NAV DOTS ====== */
.nav-dots{
  position:fixed;right:30px;top:50%;transform:translateY(-50%);
  z-index:90;display:flex;flex-direction:column;gap:14px;
}
.nav-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--line);cursor:none;
  transition:all .4s;position:relative;
}
.nav-dot.active{background:var(--ink);transform:scale(1.4)}
.nav-dot::before{
  content:attr(data-label);
  position:absolute;right:20px;top:50%;transform:translateY(-50%);
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);opacity:0;transition:opacity .3s;
  white-space:nowrap;pointer-events:none;
}
.nav-dot:hover::before{opacity:1}

/* ====== HEADER ====== */
.header{
  position:fixed;top:0;left:0;right:0;z-index:100;
  padding:24px var(--pad-x);
  display:flex;align-items:center;justify-content:space-between;
  transition:all .5s cubic-bezier(.16,1,.3,1);
}
.header.scrolled{
  padding:16px var(--pad-x);
  background:rgba(245,241,234,.85);
  backdrop-filter:blur(24px) saturate(180%);
  -webkit-backdrop-filter:blur(24px) saturate(180%);
  border-bottom:1px solid var(--line);
}
.logo{
  display:flex;align-items:center;gap:12px;
  font-family:'Fraunces',serif;font-weight:400;font-size:17px;
  letter-spacing:-.01em;z-index:101;
}
.logo-mark{
  width:36px;height:36px;border-radius:50%;
  background:var(--ink);
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
  transition:transform .8s cubic-bezier(.16,1,.3,1);
}
.logo:hover .logo-mark{transform:rotate(360deg) scale(1.05)}
.logo-mark svg{width:20px;height:12px}
.nav{display:flex;gap:40px;align-items:center}
.nav a{
  font-weight:400;font-size:14px;color:var(--ink-2);
  position:relative;transition:color .3s;
  letter-spacing:-.01em;
}
.nav a:not(.btn-primary):hover{color:var(--ink)}
.nav a:not(.btn-primary)::after{
  content:'';position:absolute;left:0;bottom:-4px;
  width:0;height:1px;background:var(--ink);transition:width .5s cubic-bezier(.16,1,.3,1);
}
.nav a:not(.btn-primary):hover::after{width:100%}

/* ====== BURGER MENU ====== */
.burger{
  display:none;
  width:44px;height:44px;
  position:relative;z-index:102;
  flex-direction:column;justify-content:center;align-items:center;gap:6px;
  cursor:none;
}
.burger span{
  display:block;width:24px;height:1.5px;
  background:var(--ink);
  transition:all .4s cubic-bezier(.16,1,.3,1);
  transform-origin:center;
}
.burger.open span:nth-child(1){transform:translateY(3.75px) rotate(45deg)}
.burger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.burger.open span:nth-child(3){transform:translateY(-3.75px) rotate(-45deg)}

/* Mobile menu overlay */
.mobile-menu{
  position:fixed;inset:0;z-index:100;
  background:var(--cream);
  display:flex;flex-direction:column;
  padding:120px 30px 40px;
  transform:translateY(-100%);
  transition:transform .6s cubic-bezier(.77,0,.18,1);
  overflow-y:auto;
}
.mobile-menu.open{transform:translateY(0)}
.mobile-menu a{
  font-family:'Fraunces',serif;
  font-size:32px;font-weight:400;
  padding:18px 0;
  border-bottom:1px solid var(--line);
  display:flex;justify-content:space-between;align-items:center;
  color:var(--ink);
  transition:color .3s,padding-left .3s;
}
.mobile-menu a:hover{color:var(--sage);padding-left:10px}
.mobile-menu a .mm-arrow{
  font-size:18px;color:var(--muted);
  transition:transform .3s,color .3s;
}
.mobile-menu a:hover .mm-arrow{transform:translateX(4px);color:var(--sage)}
.mobile-menu-footer{
  margin-top:auto;padding-top:40px;
  border-top:1px solid var(--line);
}
.mobile-menu-footer p{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);margin-bottom:8px;
}
.mobile-menu-footer a{
  font-family:'Fraunces',serif;
  font-size:18px;border:none;padding:4px 0;
}
.mobile-menu-cta{
  margin-top:30px;
}
.mobile-menu-cta .btn-primary{width:100%;justify-content:center;padding:18px}

/* ====== BOUTON RDV ====== */
.btn-rdv-wrapper{position:relative;display:inline-flex;align-items:center}
.btn-rdv-wrapper::before{
  content:'';position:absolute;inset:-6px;border-radius:46px;
  background:transparent;border:1.5px solid rgba(94,234,212,.3);
  animation:haloPulse 2.5s ease-in-out infinite;z-index:0;pointer-events:none;
}
@keyframes haloPulse{
  0%,100%{border-color:rgba(94,234,212,.25);transform:scale(1);opacity:1}
  50%{border-color:rgba(94,234,212,.55);transform:scale(1.04);opacity:.7}
}
.btn-rdv-indicator{
  position:absolute;top:-4px;right:-4px;
  width:10px;height:10px;background:#34D399;border-radius:50%;
  z-index:2;box-shadow:0 0 0 0 rgba(52,211,153,.6);
  animation:indicatorPulse 2s infinite;
}
@keyframes indicatorPulse{
  0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.6)}
  50%{box-shadow:0 0 0 8px rgba(52,211,153,0)}
}
.btn-primary{
  background:var(--ink);color:var(--cream);
  padding:15px 30px;border-radius:40px;
  font-weight:400;font-size:13px;letter-spacing:.02em;
  transition:all .5s cubic-bezier(.16,1,.3,1);
  display:inline-flex;align-items:center;gap:10px;
  position:relative;overflow:hidden;z-index:1;
}
.btn-primary::before{
  content:'';position:absolute;inset:0;
  background:var(--sage);
  transform:translateY(100%);transition:transform .5s cubic-bezier(.16,1,.3,1);
  z-index:0;
}
.btn-primary span{position:relative;z-index:1;transition:transform .5s}
.btn-primary:hover{transform:translateY(-3px);box-shadow:0 20px 40px -10px rgba(15,118,110,.45)}
.btn-primary:hover::before{transform:translateY(0)}
.btn-primary .arrow{display:inline-block;transition:transform .5s}
.btn-primary:hover .arrow{transform:translateX(4px)}
.btn-ghost{
  display:inline-flex;align-items:center;gap:10px;
  font-size:13px;color:var(--muted);transition:color .3s;
}
.btn-ghost:hover{color:var(--ink)}
.btn-ghost .line{width:30px;height:1px;background:currentColor;transition:width .4s}
.btn-ghost:hover .line{width:50px}

/* ====== PAGES ====== */
.page{display:none;opacity:0;transition:opacity .6s}
.page.active{display:block;opacity:1}

.page-transition{
  position:fixed;inset:0;z-index:9990;
  background:var(--ink);
  transform:translateY(100%);
  pointer-events:none;
}
.page-transition.active{animation:pageSlide 1s cubic-bezier(.77,0,.18,1) forwards}
@keyframes pageSlide{
  0%{transform:translateY(100%)}
  45%{transform:translateY(0)}
  55%{transform:translateY(0)}
  100%{transform:translateY(-100%)}
}

/* ====== HERO ====== */
.hero{
  min-height:100vh;
  padding:140px var(--pad-x) 60px;
  position:relative;overflow:hidden;
  display:flex;flex-direction:column;justify-content:space-between;
  background:radial-gradient(ellipse at top right,rgba(94,234,212,.15),transparent 50%),
             radial-gradient(ellipse at bottom left,rgba(200,149,109,.08),transparent 50%),
             var(--cream);
}
.hero-canvas{position:absolute;inset:0;z-index:1;pointer-events:none}
.hero-grid-lines{position:absolute;inset:0;z-index:1;pointer-events:none;opacity:.4}
.hero-grid-lines::before,.hero-grid-lines::after{
  content:'';position:absolute;background:var(--line);
}
.hero-grid-lines::before{top:0;bottom:0;left:33.33%;width:1px}
.hero-grid-lines::after{top:0;bottom:0;right:33.33%;width:1px}

.hero-top{
  display:flex;justify-content:space-between;align-items:flex-start;
  margin-bottom:40px;position:relative;z-index:3;
}
.hero-tag{
  display:inline-flex;align-items:center;gap:10px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);
}
.hero-tag::before{
  content:'';width:6px;height:6px;border-radius:50%;
  background:var(--sage);
  box-shadow:0 0 0 4px rgba(15,118,110,.15);
  animation:pulse 2s infinite;
}
@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(15,118,110,.15)}50%{box-shadow:0 0 0 10px rgba(15,118,110,.02)}}
.hero-meta{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);text-align:right;
}
.hero-meta div{margin-bottom:4px}

.hero-middle{
  position:relative;z-index:3;
  display:grid;grid-template-columns:1.3fr auto;gap:60px;align-items:center;
  flex:1;
}
.hero-title{
  font-size:clamp(56px,10vw,160px);
  font-weight:400;line-height:.92;
  letter-spacing:-.04em;
}
.hero-title .line{display:block;overflow:hidden;padding:4px 0}
.hero-title .word{
  display:inline-block;
  transform:translateY(110%);
  animation:wordUp 1.2s cubic-bezier(.16,1,.3,1) forwards;
}
@keyframes wordUp{to{transform:translateY(0)}}
.hero-title .italic{font-style:italic;color:var(--sage);font-weight:400}
.hero-title .outline{
  -webkit-text-stroke:1.5px var(--ink);
  color:transparent;font-style:italic;
}
.hero-title .word:nth-child(1){animation-delay:.1s}
.hero-title .word:nth-child(2){animation-delay:.2s}
.hero-title .word:nth-child(3){animation-delay:.3s}
.hero-title .word:nth-child(4){animation-delay:.4s}
.hero-title .word:nth-child(5){animation-delay:.5s}

.hero-iris-wrap{
  position:relative;
  width:420px;height:420px;
  display:flex;align-items:center;justify-content:center;
}
.hero-iris{
  width:380px;height:380px;border-radius:50%;
  position:relative;
  background:radial-gradient(circle at 35% 35%,#a7f3e8,var(--mint) 25%,var(--sage) 60%,var(--sage-dark) 100%);
  box-shadow:
    0 0 80px rgba(94,234,212,.4),
    inset 0 0 60px rgba(15,118,110,.3),
    0 30px 80px -20px rgba(15,118,110,.3);
  animation:irisFloat 6s ease-in-out infinite;
}
@keyframes irisFloat{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-15px)}
}
.hero-iris::before{
  content:'';position:absolute;inset:0;border-radius:50%;
  background:
    repeating-conic-gradient(from 0deg,transparent 0deg,rgba(255,255,255,.08) 2deg,transparent 4deg),
    radial-gradient(circle at 50% 50%,transparent 30%,rgba(15,118,110,.4) 70%);
  animation:irisRotate 20s linear infinite;
}
@keyframes irisRotate{to{transform:rotate(360deg)}}
.hero-pupil{
  position:absolute;top:50%;left:50%;
  width:140px;height:140px;border-radius:50%;
  background:radial-gradient(circle at 40% 40%,#1a2e2b,var(--ink));
  transform:translate(-50%,-50%);
  transition:transform .3s ease-out;
  box-shadow:inset 0 0 30px rgba(0,0,0,.5);
}
.hero-pupil::before{
  content:'';position:absolute;top:15%;left:20%;
  width:30%;height:30%;border-radius:50%;
  background:rgba(255,255,255,.8);
  filter:blur(2px);
}
.hero-pupil::after{
  content:'';position:absolute;bottom:25%;right:20%;
  width:15%;height:15%;border-radius:50%;
  background:rgba(255,255,255,.5);
  filter:blur(1px);
}
.hero-iris-ring{
  position:absolute;inset:-20px;border-radius:50%;
  border:1px solid rgba(94,234,212,.3);
  animation:ringPulseOuter 3s ease-in-out infinite;
}
.hero-iris-ring.r2{inset:-40px;border-color:rgba(94,234,212,.15);animation-delay:.5s}
.hero-iris-ring.r3{inset:-60px;border-color:rgba(94,234,212,.08);animation-delay:1s}
@keyframes ringPulseOuter{
  0%,100%{transform:scale(1);opacity:1}
  50%{transform:scale(1.05);opacity:.5}
}

.hero-bottom{
  display:grid;grid-template-columns:1fr 1fr 1fr;
  gap:40px;align-items:end;
  padding-top:40px;border-top:1px solid var(--line);
  position:relative;z-index:3;margin-top:60px;
}
.hero-desc{
  font-size:15px;color:var(--ink-2);max-width:380px;
  line-height:1.6;font-weight:300;
}
.hero-cta{display:flex;flex-direction:column;gap:16px;align-items:flex-end}
.hero-cta .btn-primary{padding:20px 40px;font-size:14px}
.hero-scroll{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);
  display:flex;align-items:center;gap:12px;
}
.scroll-line{
  width:40px;height:1px;background:var(--muted);position:relative;overflow:hidden;
}
.scroll-line::after{
  content:'';position:absolute;inset:0;
  background:var(--ink);
  animation:scrollLine 2s infinite;
}
@keyframes scrollLine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

/* ====== MARQUEE ====== */
.marquee{
  padding:40px 0;
  border-top:1px solid var(--line);
  border-bottom:1px solid var(--line);
  overflow:hidden;
  background:var(--cream);
}
.marquee:hover .marquee-track{animation-play-state:paused}
.marquee-track{
  display:flex;gap:60px;
  animation:marquee 50s linear infinite;
  width:max-content;
}
@keyframes marquee{to{transform:translateX(-50%)}}
.marquee-item{
  font-family:'Fraunces',serif;
  font-size:clamp(32px,4vw,64px);
  font-weight:400;font-style:italic;
  color:var(--ink);
  display:flex;align-items:center;gap:60px;
  white-space:nowrap;
  transition:color .4s;
}
.marquee-item:hover{color:var(--sage)}
.marquee-item .star{color:var(--sage);font-style:normal;font-size:.5em}

/* ====== STATS ====== */
.stats{
  padding:var(--section-pad) var(--pad-x);
  background:var(--ink);color:var(--cream);
  position:relative;overflow:hidden;
}
.stats::before{
  content:'';position:absolute;top:-50%;right:-20%;
  width:900px;height:900px;border-radius:50%;
  background:radial-gradient(circle,rgba(94,234,212,.08),transparent 60%);
}
.stats-wrap{max-width:1400px;margin:0 auto;position:relative;z-index:1}
.stats-head{
  display:flex;justify-content:space-between;align-items:end;
  margin-bottom:80px;padding-bottom:40px;border-bottom:1px solid var(--line-dark);
}
.stats-head h3{
  font-family:'Fraunces',serif;
  font-size:clamp(32px,4vw,56px);
  font-weight:400;color:var(--cream);
  letter-spacing:-.02em;max-width:600px;line-height:1.1;
}
.stats-head h3 em{font-style:italic;color:var(--mint)}
.stats-head .tag{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:3px;text-transform:uppercase;
  color:rgba(245,241,234,.5);
}
.stats-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:30px;
}
.stat-card{
  padding:30px;
  border:1px solid var(--line-dark);
  border-radius:16px;
  background:rgba(255,255,255,.02);
  backdrop-filter:blur(10px);
  transition:all .5s;
}
.stat-card:hover{background:rgba(255,255,255,.05);border-color:rgba(94,234,212,.3);transform:translateY(-4px)}
.stat-ring{width:80px;height:80px;margin-bottom:20px;position:relative}
.stat-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.stat-ring circle{fill:none;stroke-width:3}
.stat-ring .bg{stroke:rgba(255,255,255,.1)}
.stat-ring .fg{stroke:var(--mint);stroke-linecap:round;stroke-dasharray:220;stroke-dashoffset:220;transition:stroke-dashoffset 2s cubic-bezier(.16,1,.3,1)}
.stat-ring.animate .fg{stroke-dashoffset:var(--offset)}
.stat-ring-num{
  position:absolute;inset:0;
  display:flex;align-items:center;justify-content:center;
  font-family:'Fraunces',serif;
  font-size:20px;color:var(--cream);font-weight:400;
}
.stat-label{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:rgba(245,241,234,.5);
  margin-bottom:8px;
}
.stat-desc{font-size:12px;color:rgba(245,241,234,.6);line-height:1.5}

/* ====== SECTIONS ====== */
.section{padding:var(--section-pad) var(--pad-x);max-width:1500px;margin:0 auto;position:relative}
.section-tag{
  display:inline-flex;align-items:center;gap:12px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:3px;text-transform:uppercase;
  color:var(--sage);margin-bottom:28px;
}
.section-tag::before{
  content:'';width:30px;height:1px;background:var(--sage);
}
.section-title{
  font-size:clamp(40px,6vw,88px);
  font-weight:400;line-height:1;
  letter-spacing:-.03em;
  margin-bottom:30px;
}
.section-title em{font-style:italic;color:var(--sage)}
.section-lead{
  font-size:17px;color:var(--ink-2);max-width:560px;
  line-height:1.7;font-weight:300;
}

/* ====== ABOUT ====== */
.about{
  display:grid;grid-template-columns:1fr 1.2fr;
  gap:100px;align-items:center;
}
.about-visual{position:relative;height:720px}
.about-img-main{
  position:absolute;top:0;left:0;right:40px;bottom:100px;
  border-radius:var(--radius);overflow:hidden;
  background:var(--cream-2);
  box-shadow:var(--shadow-lg);
}
.about-img-main img{width:100%;height:100%;object-fit:cover;transition:transform 1.5s cubic-bezier(.16,1,.3,1)}
.about-img-main:hover img{transform:scale(1.05)}
.about-img-accent{
  position:absolute;bottom:0;right:0;
  width:260px;height:200px;border-radius:var(--radius);
  overflow:hidden;border:10px solid var(--cream);
  box-shadow:var(--shadow);
}
.about-img-accent img{width:100%;height:100%;object-fit:cover}

.glass-card{
  position:absolute;
  background:var(--glass);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border:1px solid var(--glass-border);
  border-radius:16px;
  padding:16px 20px;
  box-shadow:0 20px 40px -10px rgba(0,0,0,.15);
  z-index:3;
  display:flex;align-items:center;gap:12px;
  animation:glassFloat 5s ease-in-out infinite;
}
@keyframes glassFloat{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-8px)}
}
.glass-card.gc1{top:40px;right:-20px;animation-delay:0s}
.glass-card.gc2{bottom:140px;left:-40px;animation-delay:1.5s}
.glass-card.gc3{bottom:20px;right:40px;animation-delay:3s}
.glass-card-ic{
  width:40px;height:40px;border-radius:12px;
  background:var(--sage);color:var(--cream);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;flex-shrink:0;
}
.glass-card-ic.mint{background:var(--mint);color:var(--ink)}
.glass-card-ic.copper{background:var(--copper);color:var(--cream)}
.glass-card-txt strong{display:block;font-family:'Fraunces',serif;font-size:18px;font-weight:500;letter-spacing:-.01em}
.glass-card-txt span{font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:1px;text-transform:uppercase}

.about-content h2{margin-bottom:30px}
.about-text{font-size:16px;color:var(--ink-2);margin-bottom:20px;line-height:1.7;font-weight:300}
.about-signature{
  margin-top:30px;padding-top:30px;border-top:1px solid var(--line);
  display:flex;align-items:center;gap:20px;
}
.about-signature-img{
  width:60px;height:60px;border-radius:50%;overflow:hidden;
  background:var(--cream-2);flex-shrink:0;
}
.about-signature-img img{width:100%;height:100%;object-fit:cover}
.about-signature-name{font-family:'Fraunces',serif;font-size:18px;font-style:italic}
.about-signature-role{font-size:12px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:1px;text-transform:uppercase}
.about-features{
  display:grid;grid-template-columns:1fr 1fr;gap:24px;
  margin-top:40px;
}
.about-feat{
  padding:24px 0;border-top:1px solid var(--line);
  transition:all .4s;
}
.about-feat:hover{padding-left:10px}
.about-feat-num{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;color:var(--sage);margin-bottom:12px;
  letter-spacing:2px;
}
.about-feat h4{font-size:20px;margin-bottom:8px;font-weight:400}
.about-feat p{font-size:13px;color:var(--muted);line-height:1.5}

/* ====== TIMELINE ====== */
.timeline-section{
  padding:var(--section-pad) var(--pad-x);
  background:var(--cream-2);
  position:relative;overflow:hidden;
}
.timeline-wrap{max-width:1200px;margin:0 auto}
.timeline-head{text-align:center;margin-bottom:100px}
.timeline-head .section-tag{justify-content:center}
.timeline{position:relative;padding:40px 0}
.timeline::before{
  content:'';position:absolute;
  left:50%;top:0;bottom:0;width:1px;
  background:linear-gradient(180deg,transparent,var(--line) 10%,var(--line) 90%,transparent);
  transform:translateX(-50%);
}
.timeline-progress{
  position:absolute;
  left:50%;top:0;width:1px;height:0;
  background:var(--sage);
  transform:translateX(-50%);
  transition:height .1s linear;
  z-index:1;
}
.timeline-item{
  display:grid;grid-template-columns:1fr 80px 1fr;
  gap:0;align-items:center;
  margin-bottom:60px;
  position:relative;
}
.timeline-item:last-child{margin-bottom:0}
.timeline-content{
  padding:30px;
  background:var(--cream);
  border:1px solid var(--line);
  border-radius:16px;
  transition:all .5s;
}
.timeline-content:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--sage)}
.timeline-item:nth-child(odd) .timeline-content{grid-column:1}
.timeline-item:nth-child(even) .timeline-content{grid-column:3}
.timeline-dot{
  grid-column:2;justify-self:center;
  width:60px;height:60px;border-radius:50%;
  background:var(--cream);
  border:2px solid var(--line);
  display:flex;align-items:center;justify-content:center;
  font-family:'Fraunces',serif;
  font-size:16px;color:var(--sage);font-weight:500;
  position:relative;z-index:2;
  transition:all .5s;
}
.timeline-item.visible .timeline-dot{
  background:var(--sage);color:var(--cream);border-color:var(--sage);
  transform:scale(1.1);
}
.timeline-year{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;color:var(--sage);
  margin-bottom:8px;text-transform:uppercase;
}
.timeline-content h4{font-size:22px;margin-bottom:8px;font-weight:400}
.timeline-content p{font-size:14px;color:var(--ink-2);line-height:1.6;font-weight:300}

/* ====== SERVICES ====== */
.services-section{
  padding:var(--section-pad) 0 var(--section-pad) var(--pad-x);
  background:var(--cream);
  position:relative;overflow:hidden;
}
.services-wrap{max-width:1500px;margin:0 auto;padding-right:var(--pad-x)}
.services-head{
  display:grid;grid-template-columns:1fr 1fr;gap:60px;
  align-items:end;margin-bottom:80px;padding-right:var(--pad-x);
}
.services-scroll{
  display:flex;gap:24px;
  overflow-x:auto;
  scroll-snap-type:x mandatory;
  scrollbar-width:none;
  padding-bottom:20px;
  padding-right:var(--pad-x);
  -webkit-overflow-scrolling:touch;
}
.services-scroll::-webkit-scrollbar{display:none}
.service-card{
  flex:0 0 420px;
  scroll-snap-align:start;
  background:var(--cream-2);
  border-radius:var(--radius);
  overflow:hidden;
  transition:all .7s cubic-bezier(.16,1,.3,1);
  position:relative;
  border:1px solid var(--line);
}
.service-card:hover{transform:translateY(-10px);box-shadow:var(--shadow-lg);border-color:transparent}
.service-img{
  height:320px;overflow:hidden;position:relative;
  background:linear-gradient(135deg,var(--sage),var(--sage-dark));
}
.service-img img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.16,1,.3,1)}
.service-card:hover .service-img img{transform:scale(1.08)}
.service-img::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.5));
}
.service-num{
  position:absolute;top:20px;left:20px;z-index:2;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;color:var(--cream);
  letter-spacing:2px;
  background:rgba(0,0,0,.3);backdrop-filter:blur(10px);
  padding:8px 14px;border-radius:20px;
}
.service-body{padding:36px}
.service-body h3{font-size:26px;margin-bottom:14px;font-weight:400}
.service-body p{font-size:14px;color:var(--ink-2);margin-bottom:24px;line-height:1.6;font-weight:300}
.service-link{
  font-size:11px;font-weight:500;color:var(--sage);
  display:inline-flex;align-items:center;gap:8px;
  letter-spacing:2px;text-transform:uppercase;
  font-family:'JetBrains Mono',monospace;
  transition:gap .4s;
}
.service-card:hover .service-link{gap:14px}

.scroll-indicator{
  display:flex;align-items:center;gap:16px;
  margin-top:40px;padding-right:var(--pad-x);
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);
}
.scroll-indicator-line{
  flex:1;height:1px;background:var(--line);position:relative;overflow:hidden;
}
.scroll-indicator-line::after{
  content:'';position:absolute;inset:0;width:30%;
  background:var(--sage);
  animation:scrollIndicate 3s ease-in-out infinite;
}
@keyframes scrollIndicate{
  0%{transform:translateX(-100%)}
  50%{transform:translateX(230%)}
  100%{transform:translateX(230%)}
}

/* ====== TECH ====== */
.tech-section{
  padding:var(--section-pad) var(--pad-x);
  background:var(--ink);color:var(--cream);
  position:relative;overflow:hidden;
}
.tech-section::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(circle at 20% 30%,rgba(94,234,212,.1),transparent 40%),
    radial-gradient(circle at 80% 70%,rgba(200,149,109,.08),transparent 40%);
}
.tech-wrap{max-width:1500px;margin:0 auto;position:relative;z-index:1}
.tech-head{
  display:grid;grid-template-columns:1fr 1fr;gap:60px;
  align-items:end;margin-bottom:80px;
}
.tech-head .section-tag{color:var(--mint)}
.tech-head .section-tag::before{background:var(--mint)}
.tech-head h2{color:var(--cream)}
.tech-head h2 em{color:var(--mint)}
.tech-head p{color:rgba(245,241,234,.7)}
.tech-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:20px;
}
.tech-card{
  padding:32px;
  background:rgba(255,255,255,.03);
  backdrop-filter:blur(10px);
  border:1px solid var(--line-dark);
  border-radius:16px;
  transition:all .5s;
  position:relative;overflow:hidden;
}
.tech-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,var(--mint),transparent);
  transform:scaleX(0);transform-origin:left;
  transition:transform .6s;
}
.tech-card:hover{background:rgba(255,255,255,.06);border-color:rgba(94,234,212,.3);transform:translateY(-6px)}
.tech-card:hover::before{transform:scaleX(1)}
.tech-ic{
  width:56px;height:56px;border-radius:14px;
  background:rgba(94,234,212,.1);
  border:1px solid rgba(94,234,212,.2);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:20px;
  transition:all .4s;
}
.tech-ic svg{width:28px;height:28px;stroke:var(--mint);stroke-width:1.5;fill:none}
.tech-card:hover .tech-ic{background:var(--mint);border-color:var(--mint)}
.tech-card:hover .tech-ic svg{stroke:var(--ink)}
.tech-card h4{font-size:20px;color:var(--cream);margin-bottom:10px;font-weight:400}
.tech-card p{font-size:13px;color:rgba(245,241,234,.6);line-height:1.6;font-weight:300}
.tech-tag{
  display:inline-block;margin-top:16px;
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--mint);
  padding:4px 10px;border-radius:20px;
  background:rgba(94,234,212,.1);
  border:1px solid rgba(94,234,212,.2);
}

/* ====== BENTO ====== */
.patho-section{padding:var(--section-pad) var(--pad-x)}
.patho-wrap{max-width:1500px;margin:0 auto}
.bento{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  grid-template-rows:repeat(2,260px);
  gap:16px;
}
.bento-item{
  background:var(--cream-2);
  border-radius:var(--radius);
  padding:32px;
  position:relative;overflow:hidden;
  transition:all .6s cubic-bezier(.16,1,.3,1);
  border:1px solid var(--line);
  display:flex;flex-direction:column;justify-content:space-between;
}
.bento-item:hover{background:var(--ink);color:var(--cream);transform:translateY(-6px)}
.bento-item:hover h3,.bento-item:hover p{color:var(--cream)}
.bento-item:hover p{opacity:.7}
.bento-item:hover .bento-ic{background:var(--sage);color:var(--cream);border-color:var(--sage)}
.bento-item:hover .bento-ic svg{stroke:var(--cream)}
.bento-item.large{grid-column:span 2;grid-row:span 2;background-size:cover;background-position:center}
.bento-item.large::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(15,15,15,.3),rgba(15,15,15,.85));
  z-index:1;transition:background .6s;
}
.bento-item.large:hover::before{background:linear-gradient(180deg,rgba(15,118,110,.4),rgba(15,15,15,.9))}
.bento-item.large>*{position:relative;z-index:2;color:var(--cream)}
.bento-item.large h3{color:var(--cream);font-size:40px}
.bento-item.large p{color:rgba(245,241,234,.8)}
.bento-item.wide{grid-column:span 2}
.bento-ic{
  width:56px;height:56px;border-radius:14px;
  background:var(--cream);
  display:flex;align-items:center;justify-content:center;
  transition:all .4s;
  border:1px solid var(--line);
}
.bento-ic svg{width:26px;height:26px;stroke:var(--ink);stroke-width:1.5;fill:none}
.bento-item h3{font-size:24px;font-weight:400;margin-bottom:8px;transition:color .4s}
.bento-item.large h3{font-size:40px}
.bento-item p{font-size:14px;color:var(--ink-2);transition:all .4s;line-height:1.5;font-weight:300}
.bento-item.large p{font-size:16px;max-width:400px}
.bento-tag{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--sage);margin-bottom:12px;
}
.bento-item.large .bento-tag{color:var(--mint)}
.bento-item:hover .bento-tag{color:var(--mint)}

/* ====== JOURNEY ====== */
.journey-section{
  padding:var(--section-pad) var(--pad-x);
  background:var(--cream-2);
  position:relative;overflow:hidden;
}
.journey-wrap{max-width:1400px;margin:0 auto}
.journey-head{text-align:center;margin-bottom:100px}
.journey-head .section-tag{justify-content:center}
.journey{
  display:grid;grid-template-columns:repeat(5,1fr);gap:20px;
  position:relative;
}
.journey::before{
  content:'';position:absolute;
  top:40px;left:10%;right:10%;height:1px;
  background:linear-gradient(90deg,transparent,var(--line) 10%,var(--line) 90%,transparent);
}
.journey-step{
  text-align:center;position:relative;
  padding-top:80px;
}
.journey-num{
  position:absolute;top:0;left:50%;transform:translateX(-50%);
  width:80px;height:80px;border-radius:50%;
  background:var(--cream);
  border:1px solid var(--line);
  display:flex;align-items:center;justify-content:center;
  font-family:'Fraunces',serif;font-size:24px;color:var(--sage);
  transition:all .5s;
  z-index:1;
}
.journey-step:hover .journey-num{
  background:var(--sage);color:var(--cream);border-color:var(--sage);
  transform:translateX(-50%) scale(1.1) rotate(-5deg);
}
.journey-step h4{font-size:18px;margin-bottom:8px;font-weight:400}
.journey-step p{font-size:13px;color:var(--ink-2);line-height:1.5;font-weight:300}

/* ====== URGENCE ====== */
.urgence-section{
  padding:var(--section-pad) var(--pad-x);
  background:var(--cream);
  position:relative;overflow:hidden;
}
.urgence-wrap{
  max-width:1500px;margin:0 auto;
  display:grid;grid-template-columns:1fr 1fr;gap:100px;align-items:center;
  position:relative;z-index:1;
}
.urgence-visual{
  height:600px;border-radius:var(--radius);overflow:hidden;
  position:relative;
  box-shadow:var(--shadow-lg);
}
.urgence-visual img{width:100%;height:100%;object-fit:cover;transition:transform 1.5s}
.urgence-visual:hover img{transform:scale(1.05)}
.urgence-visual::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,transparent 40%,rgba(15,15,15,.5));
}
.urgence-visual-badge{
  position:absolute;bottom:30px;left:30px;
  background:var(--glass);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border:1px solid var(--glass-border);
  color:var(--ink);
  padding:16px 24px;border-radius:12px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  display:flex;align-items:center;gap:12px;z-index:2;
}
.urgence-visual-badge::before{
  content:'';width:8px;height:8px;border-radius:50%;
  background:#ef4444;animation:pulseRed 1.5s infinite;
}
@keyframes pulseRed{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}50%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
.urgence-section h2{margin-bottom:30px}
.urgence-section>p{color:var(--ink-2);margin-bottom:40px;font-size:17px;max-width:480px;font-weight:300}
.urgence-list{display:flex;flex-direction:column;max-width:1500px;margin:80px auto 0}
.urgence-item{
  padding:24px 0;
  border-bottom:1px solid var(--line);
  display:grid;grid-template-columns:60px 1fr auto;gap:24px;align-items:center;
  transition:all .4s;
}
.urgence-item:first-child{border-top:1px solid var(--line)}
.urgence-item:hover{padding-left:16px;background:linear-gradient(90deg,rgba(15,118,110,.04),transparent)}
.urgence-num{
  font-family:'JetBrains Mono',monospace;
  font-size:12px;color:var(--sage);letter-spacing:2px;
}
.urgence-item h4{font-size:22px;font-weight:400;font-style:italic}
.urgence-item .arrow{
  width:36px;height:36px;border-radius:50%;
  background:var(--cream-2);
  display:flex;align-items:center;justify-content:center;
  transition:all .4s;
}
.urgence-item:hover .arrow{background:var(--sage);color:var(--cream);transform:rotate(-45deg)}

/* ====== TESTIMONIALS ====== */
.testimonials{padding:var(--section-pad) var(--pad-x);background:var(--cream-2)}
.testi-wrap{max-width:1500px;margin:0 auto}
.testi-head{
  display:grid;grid-template-columns:1fr 1fr;gap:60px;
  align-items:end;margin-bottom:80px;
}
.testi-rating{
  display:flex;align-items:center;gap:16px;
  margin-top:20px;
}
.testi-rating-num{
  font-family:'Fraunces',serif;
  font-size:64px;line-height:1;color:var(--ink);
  letter-spacing:-.03em;
}
.testi-rating-info{display:flex;flex-direction:column;gap:4px}
.testi-stars{color:var(--copper);font-size:14px;letter-spacing:2px}
.testi-rating-text{font-size:12px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:1px;text-transform:uppercase}
.testi-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:24px;
}
.testi{
  background:var(--cream);
  padding:40px;border-radius:var(--radius);
  border:1px solid var(--line);
  transition:all .5s cubic-bezier(.16,1,.3,1);
  display:flex;flex-direction:column;
}
.testi:hover{transform:translateY(-8px);box-shadow:var(--shadow)}
.testi-quote{
  font-family:'Fraunces',serif;
  font-size:80px;color:var(--sage);
  line-height:.8;margin-bottom:10px;
  font-style:italic;
}
.testi p{font-size:15px;color:var(--ink-2);line-height:1.7;font-style:italic;font-weight:300;flex:1}
.testi-author{
  display:flex;align-items:center;gap:14px;
  padding-top:24px;margin-top:24px;border-top:1px solid var(--line);
}
.testi-avatar{
  width:48px;height:48px;border-radius:50%;overflow:hidden;
  background:linear-gradient(135deg,var(--sage),var(--mint));
  display:flex;align-items:center;justify-content:center;
  color:var(--cream);font-weight:500;font-size:14px;flex-shrink:0;
}
.testi-name{font-weight:500;font-size:14px;font-family:'Fraunces',serif}
.testi-role{font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;letter-spacing:1px;text-transform:uppercase}

/* ====== FAQ ====== */
.faq-section{padding:var(--section-pad) var(--pad-x);background:var(--cream)}
.faq-wrap{max-width:1000px;margin:0 auto}
.faq-head{text-align:center;margin-bottom:80px}
.faq-list{display:flex;flex-direction:column}
.faq-item{
  border-bottom:1px solid var(--line);
  padding:28px 0;
  cursor:none;
}
.faq-q{
  display:flex;justify-content:space-between;align-items:center;gap:20px;
}
.faq-q h4{font-size:24px;font-weight:400;transition:color .3s;flex:1}
.faq-item.open .faq-q h4{color:var(--sage);font-style:italic}
.faq-toggle{
  width:44px;height:44px;border-radius:50%;
  background:var(--cream-2);
  display:flex;align-items:center;justify-content:center;
  transition:all .5s cubic-bezier(.16,1,.3,1);flex-shrink:0;
  position:relative;border:1px solid var(--line);
}
.faq-toggle::before,.faq-toggle::after{
  content:'';position:absolute;background:var(--ink);
  transition:transform .5s cubic-bezier(.16,1,.3,1);
}
.faq-toggle::before{width:14px;height:1.5px}
.faq-toggle::after{width:1.5px;height:14px}
.faq-item.open .faq-toggle{background:var(--ink);transform:rotate(135deg)}
.faq-item.open .faq-toggle::before,.faq-item.open .faq-toggle::after{background:var(--cream)}
.faq-a{
  max-height:0;overflow:hidden;
  transition:max-height .6s cubic-bezier(.16,1,.3,1),padding .6s;
  color:var(--ink-2);font-size:15px;line-height:1.7;font-weight:300;
  padding-left:64px;
}
.faq-item.open .faq-a{max-height:300px;padding-top:20px}

/* ====== CONTACT ====== */
.contact-section{padding:var(--section-pad) var(--pad-x);background:var(--cream-2)}
.contact-wrap{max-width:1500px;margin:0 auto}
.contact-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:80px;
  margin-top:80px;
}
.contact-info{display:flex;flex-direction:column}
.contact-row{
  display:grid;grid-template-columns:140px 1fr;gap:30px;
  padding:32px 0;border-bottom:1px solid var(--line);
  align-items:start;
  transition:all .4s;
}
.contact-row:hover{padding-left:12px}
.contact-row:first-child{border-top:1px solid var(--line)}
.contact-row-label{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);padding-top:6px;
}
.contact-row-value{font-size:20px;font-family:'Fraunces',serif;font-weight:400;line-height:1.4}
.contact-row-value a{border-bottom:1px solid var(--line);transition:border-color .3s}
.contact-row-value a:hover{border-color:var(--sage);color:var(--sage)}
.contact-form{
  background:var(--cream);padding:50px;border-radius:var(--radius);
  border:1px solid var(--line);
  box-shadow:var(--shadow);
}
.contact-form h3{font-size:36px;margin-bottom:30px;font-weight:400}
.form-group{margin-bottom:28px;position:relative}
.form-group label{
  display:block;font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);margin-bottom:10px;
}
.form-group input,.form-group textarea{
  width:100%;padding:14px 0;
  border:none;border-bottom:1px solid var(--line);
  background:transparent;
  font-family:'Fraunces',serif;font-size:18px;font-weight:400;
  color:var(--ink);
  transition:border-color .3s;
}
.form-group input:focus,.form-group textarea:focus{
  outline:none;border-color:var(--sage);
}
.form-group textarea{resize:vertical;min-height:100px;font-family:'Inter',sans-serif;font-size:15px;font-weight:300}

/* ====== CTA FINAL ====== */
.cta-final{
  padding:200px var(--pad-x);
  background:var(--ink);color:var(--cream);
  text-align:center;position:relative;overflow:hidden;
  min-height:100vh;
  display:flex;flex-direction:column;align-items:center;justify-content:center;
}
.cta-final-canvas{position:absolute;inset:0;z-index:0}
.cta-final::before{
  content:'';position:absolute;inset:0;z-index:1;
  background:
    radial-gradient(circle at 30% 50%,rgba(94,234,212,.15),transparent 50%),
    radial-gradient(circle at 70% 50%,rgba(200,149,109,.1),transparent 50%);
}
.cta-final>*:not(.cta-final-canvas){position:relative;z-index:2}
.cta-final .section-tag{color:var(--mint);justify-content:center}
.cta-final .section-tag::before{background:var(--mint)}
.cta-final h2{
  color:var(--cream);
  font-size:clamp(48px,8vw,140px);
  font-weight:400;line-height:.92;
  letter-spacing:-.03em;
  margin-bottom:40px;
}
.cta-final h2 em{font-style:italic;color:var(--mint)}
.cta-final p{
  color:rgba(245,241,234,.7);max-width:500px;margin:0 auto 50px;
  font-size:17px;font-weight:300;
}
.cta-final .btn-primary{background:var(--mint);color:var(--ink);padding:22px 44px;font-size:15px}
.cta-final .btn-primary::before{background:var(--cream)}

/* ====== FOOTER ====== */
.footer{
  background:var(--ink);color:var(--cream);
  padding:80px var(--pad-x) 30px;
  border-top:1px solid var(--line-dark);
}
.footer-grid{
  max-width:1500px;margin:0 auto;
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;
  padding-bottom:60px;
}
.footer-brand .logo{color:var(--cream);margin-bottom:20px}
.footer-brand p{color:rgba(245,241,234,.5);font-size:14px;max-width:320px;line-height:1.7;font-weight:300}
.footer h5{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:rgba(245,241,234,.4);margin-bottom:20px;font-weight:400;
}
.footer a,.footer p{color:rgba(245,241,234,.7);font-size:14px;display:block;margin-bottom:10px;transition:color .2s;font-weight:300}
.footer a:hover{color:var(--mint)}
.footer-bottom{
  max-width:1500px;margin:0 auto;
  padding-top:30px;border-top:1px solid var(--line-dark);
  display:flex;justify-content:space-between;
  color:rgba(245,241,234,.4);font-size:11px;
  font-family:'JetBrains Mono',monospace;letter-spacing:1px;
}

/* ====== PAGE RDV ====== */
.rdv-hero{
  padding:180px var(--pad-x) 80px;
  position:relative;overflow:hidden;
}
.rdv-hero-wrap{max-width:1500px;margin:0 auto}
.rdv-hero h1{
  font-size:clamp(48px,8vw,120px);
  font-weight:400;line-height:.95;letter-spacing:-.03em;
  margin-bottom:24px;
}
.rdv-hero h1 em{font-style:italic;color:var(--sage)}
.rdv-hero p{font-size:18px;color:var(--ink-2);max-width:500px;font-weight:300}
.rdv-container{max-width:1100px;margin:0 auto;padding:0 var(--pad-x) 120px}

.steps{
  display:grid;grid-template-columns:repeat(4,1fr);gap:0;
  margin-bottom:80px;
  border-bottom:1px solid var(--line);
  padding-bottom:30px;
}
.step{
  display:flex;align-items:center;gap:16px;
  padding:0 20px;
  position:relative;
  transition:all .4s;
}
.step:not(:last-child)::after{
  content:'';position:absolute;right:0;top:50%;
  width:1px;height:20px;background:var(--line);
  transform:translateY(-50%);
}
.step-num{
  width:40px;height:40px;border-radius:50%;
  background:var(--cream-2);color:var(--muted);
  display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;
  font-size:12px;font-weight:400;
  transition:all .5s cubic-bezier(.16,1,.3,1);flex-shrink:0;
  border:1px solid var(--line);
}
.step.active .step-num{background:var(--ink);color:var(--cream);border-color:var(--ink);transform:scale(1.1)}
.step.done .step-num{background:var(--sage);color:var(--cream);border-color:var(--sage)}
.step-info{display:flex;flex-direction:column}
.step-label{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);margin-bottom:2px;
}
.step-title{font-size:16px;font-weight:400;font-family:'Fraunces',serif}
.step.active .step-title{color:var(--ink)}

.motif-head{text-align:center;margin-bottom:50px}
.motif-head h3{font-size:40px;margin-bottom:12px;font-weight:400}
.motif-head p{color:var(--ink-2);font-size:15px;font-weight:300}
.motif-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:60px}
.motif{
  padding:36px 24px;border-radius:var(--radius);
  background:var(--cream);
  border:1px solid var(--line);
  text-align:left;transition:all .5s cubic-bezier(.16,1,.3,1);
  cursor:none;
  position:relative;overflow:hidden;
}
.motif::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,var(--sage),var(--sage-dark));
  opacity:0;transition:opacity .5s;z-index:0;
}
.motif>*{position:relative;z-index:1;transition:color .5s}
.motif:hover{transform:translateY(-8px);box-shadow:var(--shadow)}
.motif.selected{border-color:transparent}
.motif.selected::before{opacity:1}
.motif.selected h3,.motif.selected p{color:var(--cream)}
.motif.selected .motif-ic{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.2)}
.motif.selected .motif-ic svg{stroke:var(--cream)}
.motif-ic{
  width:60px;height:60px;border-radius:16px;
  background:var(--cream-2);
  display:flex;align-items:center;justify-content:center;
  margin-bottom:24px;
  transition:all .5s;
  border:1px solid var(--line);
}
.motif-ic svg{width:28px;height:28px;stroke:var(--ink);stroke-width:1.5;fill:none;transition:stroke .5s}
.motif h3{font-size:20px;margin-bottom:8px;font-weight:400}
.motif p{font-size:13px;color:var(--muted);line-height:1.5;font-weight:300}

.calendar-wrap{
  background:var(--cream);border-radius:var(--radius);
  padding:40px;
  border:1px solid var(--line);
  margin-bottom:40px;
}
.calendar-head{
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:30px;
}
.calendar-head h3{font-size:32px;font-weight:400}
.cal-nav{
  width:48px;height:48px;border-radius:50%;
  background:var(--cream-2);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;transition:all .3s;
  border:1px solid var(--line);
}
.cal-nav:hover{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.cal-nav:disabled{opacity:.3;cursor:not-allowed}
.cal-nav:disabled:hover{background:var(--cream-2);color:var(--ink);border-color:var(--line)}
.calendar-days{
  display:grid;grid-template-columns:repeat(7,1fr);gap:8px;
}
.cal-day-name{
  text-align:center;font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);padding:10px 0;
}
.cal-day{
  aspect-ratio:1;border-radius:12px;
  display:flex;align-items:center;justify-content:center;
  font-size:14px;font-weight:400;
  color:var(--ink-2);
  transition:all .3s cubic-bezier(.16,1,.3,1);
  position:relative;
  border:1px solid transparent;
}
.cal-day.empty{background:transparent}
.cal-day.disabled{color:#ccc;background:var(--cream-2);cursor:not-allowed;opacity:.4}
.cal-day.available{
  background:rgba(15,118,110,.06);color:var(--sage-dark);
  font-weight:500;border-color:rgba(15,118,110,.15);
}
.cal-day.available:hover{background:var(--sage);color:var(--cream);border-color:var(--sage);transform:scale(1.08)}
.cal-day.selected{background:var(--ink);color:var(--cream);border-color:var(--ink)}
.cal-day.today::after{
  content:'';position:absolute;bottom:6px;
  width:4px;height:4px;border-radius:50%;background:var(--sage);
}
.cal-day.selected::after{background:var(--mint)}
.cal-hint{
  text-align:center;margin-top:24px;
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);
}

.slots-wrap{
  background:var(--cream);border-radius:var(--radius);
  padding:40px;
  border:1px solid var(--line);
  margin-bottom:40px;
}
.slots-wrap h3{font-size:28px;margin-bottom:8px;font-weight:400}
.slots-sub{
  font-family:'JetBrains Mono',monospace;
  font-size:11px;letter-spacing:2px;text-transform:uppercase;
  color:var(--muted);margin-bottom:24px;
  word-break:break-word;
}
.slots-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.slot{
  padding:16px;border-radius:12px;
  background:var(--cream-2);
  text-align:center;font-weight:500;font-size:14px;
  transition:all .3s cubic-bezier(.16,1,.3,1);
  cursor:none;
  border:1px solid var(--line);
  font-family:'JetBrains Mono',monospace;
  letter-spacing:.5px;
}
.slot:hover{background:var(--sage);color:var(--cream);border-color:var(--sage);transform:translateY(-3px)}
.slot.selected{background:var(--ink);color:var(--cream);border-color:var(--ink)}

.recap-form{
  display:grid;grid-template-columns:1fr 1.2fr;gap:40px;
  background:var(--cream);border-radius:var(--radius);
  padding:50px;
  border:1px solid var(--line);
}
.recap{
  padding:36px;border-radius:16px;
  background:var(--ink);color:var(--cream);
  position:relative;overflow:hidden;
}
.recap::before{
  content:'';position:absolute;top:-50%;right:-30%;
  width:300px;height:300px;border-radius:50%;
  background:radial-gradient(circle,rgba(94,234,212,.15),transparent 60%);
}
.recap h3{color:var(--cream);font-size:24px;margin-bottom:24px;font-weight:400;position:relative}
.recap-row{
  display:flex;justify-content:space-between;gap:12px;
  padding:14px 0;border-bottom:1px solid var(--line-dark);
  font-size:14px;position:relative;
}
.recap-row:last-child{border:none}
.recap-row span:first-child{
  font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:2px;text-transform:uppercase;
  color:rgba(245,241,234,.5);
  flex-shrink:0;
}
.recap-row span:last-child{font-weight:400;font-family:'Fraunces',serif;font-size:17px;text-align:right}

.confirm{
  text-align:center;padding:80px 40px;
  background:var(--cream);border-radius:var(--radius);
  border:1px solid var(--line);
}
.confirm-check{
  width:100px;height:100px;border-radius:50%;
  background:var(--sage);
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 30px;color:var(--cream);
  font-size:48px;
  animation:popIn .7s cubic-bezier(.34,1.56,.64,1);
  position:relative;
}
.confirm-check::before{
  content:'';position:absolute;inset:-10px;border-radius:50%;
  border:2px solid var(--sage);opacity:.3;
  animation:ringPulse 2s infinite;
}
@keyframes ringPulse{0%{transform:scale(1);opacity:.3}100%{transform:scale(1.5);opacity:0}}
@keyframes popIn{from{transform:scale(0) rotate(-180deg)}to{transform:scale(1) rotate(0)}}
.confirm h2{font-size:44px;margin-bottom:14px;font-weight:400}
.confirm>p{color:var(--ink-2);margin-bottom:30px;font-size:16px;font-weight:300}
.confirm-recap{
  background:var(--cream-2);padding:30px;border-radius:16px;
  margin-bottom:30px;text-align:left;max-width:500px;margin-left:auto;margin-right:auto;
}
.confirm-recap .recap-row span:first-child{color:var(--muted)}
.confirm-recap .recap-row span:last-child{color:var(--ink);font-family:'Fraunces',serif;font-size:17px}

/* ====== REVEAL ====== */
.reveal{opacity:0;transform:translateY(50px);transition:all 1.1s cubic-bezier(.16,1,.3,1)}
.reveal.visible{opacity:1;transform:translateY(0)}
.reveal-stagger>*{opacity:0;transform:translateY(40px);transition:all .9s cubic-bezier(.16,1,.3,1)}
.reveal-stagger.visible>*{opacity:1;transform:translateY(0)}
.reveal-stagger.visible>*:nth-child(1){transition-delay:.05s}
.reveal-stagger.visible>*:nth-child(2){transition-delay:.12s}
.reveal-stagger.visible>*:nth-child(3){transition-delay:.19s}
.reveal-stagger.visible>*:nth-child(4){transition-delay:.26s}
.reveal-stagger.visible>*:nth-child(5){transition-delay:.33s}
.reveal-stagger.visible>*:nth-child(6){transition-delay:.4s}

.img-reveal{position:relative;overflow:hidden}
.img-reveal::after{
  content:'';position:absolute;inset:0;
  background:var(--cream);
  transform:scaleX(1);transform-origin:right;
  transition:transform 1.2s cubic-bezier(.77,0,.18,1);
}
.img-reveal.visible::after{transform:scaleX(0)}

/* ========================================
   RESPONSIVE — TABLETTE (≤ 1024px)
   ======================================== */
@media(max-width:1024px){
  :root{
    --pad-x:40px;
    --section-pad:120px;
  }
  .header,.header.scrolled{padding-left:30px;padding-right:30px}
  .nav{display:none}
  .burger{display:flex}
  .nav-dots{display:none}
  
  .loader-corner{font-size:9px;letter-spacing:1px}
  .loader-corner.tl{top:30px;left:30px}
  .loader-corner.tr{top:30px;right:30px}
  .loader-corner.bl{bottom:30px;left:30px}
  .loader-corner.br{bottom:30px;right:30px}
  .loader-percent{bottom:30px;right:30px}
  
  .hero{padding-top:120px}
  .hero-middle{grid-template-columns:1fr;gap:40px}
  .hero-iris-wrap{width:320px;height:320px;margin:0 auto}
  .hero-iris{width:280px;height:280px}
  .hero-pupil{width:110px;height:110px}
  .hero-iris-ring.r3{display:none}
  .hero-bottom{grid-template-columns:1fr;gap:30px;margin-top:40px}
  .hero-cta{align-items:flex-start}
  
  .about,.services-head,.urgence-wrap,.contact-grid,.recap-form,.testi-head,.tech-head{grid-template-columns:1fr;gap:50px}
  .about-visual{height:560px}
  .about-img-accent{width:200px;height:160px}
  .glass-card.gc1{top:20px;right:10px}
  .glass-card.gc2{bottom:120px;left:10px}
  .glass-card.gc3{bottom:20px;right:20px}
  
  .stats-grid,.footer-grid,.tech-grid{grid-template-columns:repeat(2,1fr);gap:24px}
  .services-grid,.motif-grid,.testi-grid{grid-template-columns:repeat(2,1fr)}
  
  .bento{grid-template-columns:repeat(2,1fr);grid-template-rows:auto}
  .bento-item.large,.bento-item.wide{grid-column:span 2;grid-row:auto}
  .bento-item.large h3{font-size:32px}
  
  .journey{grid-template-columns:repeat(3,1fr);gap:30px}
  .journey::before{display:none}
  
  .timeline-item{grid-template-columns:50px 1fr;gap:20px}
  .timeline::before,.timeline-progress{left:25px}
  .timeline-dot{width:50px;height:50px;font-size:14px;grid-column:1}
  .timeline-item:nth-child(odd) .timeline-content,
  .timeline-item:nth-child(even) .timeline-content{grid-column:2}
  
  .steps{grid-template-columns:repeat(2,1fr);gap:20px}
  .step:not(:last-child)::after{display:none}
  .slots-grid{grid-template-columns:repeat(4,1fr)}
  .service-card{flex:0 0 340px}
  
  .urgence-visual{height:450px}
  .faq-q h4{font-size:20px}
  .faq-a{padding-left:0}
  
  .contact-row{grid-template-columns:120px 1fr;gap:20px}
  .contact-row-value{font-size:18px}
  
  .cta-final h2{font-size:clamp(40px,7vw,100px)}
}

/* ========================================
   RESPONSIVE — MOBILE (≤ 768px)
   ======================================== */
@media(max-width:768px){
  :root{
    --pad-x:24px;
    --section-pad:100px;
  }
  .header,.header.scrolled{padding:14px 20px}
  .logo{font-size:15px;gap:10px}
  .logo-mark{width:32px;height:32px}
  .logo-mark svg{width:18px;height:10px}
  .burger{width:40px;height:40px}
  .burger span{width:22px}
  
  .mobile-menu{padding:100px 24px 30px}
  .mobile-menu a{font-size:26px;padding:16px 0}
  
  .loader-iris{width:140px;height:140px}
  .loader-pupil{width:28px;height:28px}
  .loader-text{font-size:12px;letter-spacing:4px;margin-top:30px}
  .loader-bar{width:140px}
  .loader-corner{display:none}
  .loader-percent{bottom:24px;right:24px;font-size:10px}
  
  .hero{padding:110px 20px 40px;min-height:auto}
  .hero-top{flex-direction:column;gap:10px;margin-bottom:30px}
  .hero-meta{text-align:left}
  .hero-middle{gap:30px}
  .hero-title{font-size:clamp(44px,11vw,64px)}
  .hero-iris-wrap{width:240px;height:240px;margin:20px auto}
  .hero-iris{width:200px;height:200px}
  .hero-pupil{width:80px;height:80px}
  .hero-iris-ring.r2,.hero-iris-ring.r3{display:none}
  .hero-iris-ring{inset:-10px}
  .hero-bottom{gap:24px;margin-top:30px;padding-top:30px}
  .hero-desc{font-size:14px;max-width:100%}
  .hero-cta .btn-primary{padding:16px 28px;font-size:13px;width:100%;justify-content:center}
  .hero-scroll{display:none}
  
  .marquee{padding:30px 0}
  .marquee-item{font-size:clamp(24px,6vw,36px);gap:30px}
  .marquee-track{gap:30px}
  
  .stats{padding:80px 20px}
  .stats-head{flex-direction:column;align-items:flex-start;gap:20px;margin-bottom:50px;padding-bottom:30px}
  .stats-head h3{font-size:clamp(28px,6vw,40px);max-width:100%}
  .stats-grid{grid-template-columns:1fr 1fr;gap:16px}
  .stat-card{padding:20px}
  .stat-ring{width:60px;height:60px;margin-bottom:14px}
  .stat-ring-num{font-size:16px}
  .stat-label{font-size:9px}
  .stat-desc{display:none}
  
  .section{padding:80px 20px}
  .section-title{font-size:clamp(32px,8vw,48px);margin-bottom:20px}
  .section-lead{font-size:15px}
  .section-tag{font-size:10px;margin-bottom:20px}
  
  .about{gap:40px}
  .about-visual{height:480px}
  .about-img-main{right:20px;bottom:80px}
  .about-img-accent{width:160px;height:130px;border-width:6px}
  .glass-card{padding:12px 16px;border-radius:12px}
  .glass-card.gc1{top:10px;right:0}
  .glass-card.gc2{bottom:100px;left:0}
  .glass-card.gc3{bottom:10px;right:10px}
  .glass-card-ic{width:34px;height:34px;font-size:15px;border-radius:10px}
  .glass-card-txt strong{font-size:15px}
  .glass-card-txt span{font-size:9px}
  .about-text{font-size:15px}
  .about-signature-img{width:50px;height:50px}
  .about-signature-name{font-size:16px}
  .about-features{grid-template-columns:1fr;gap:16px;margin-top:30px}
  .about-feat{padding:18px 0}
  .about-feat h4{font-size:18px}
  
  .timeline-section{padding:80px 20px}
  .timeline-head{margin-bottom:60px}
  .timeline{padding:20px 0}
  .timeline-item{grid-template-columns:40px 1fr;gap:16px;margin-bottom:40px}
  .timeline::before,.timeline-progress{left:20px}
  .timeline-dot{width:40px;height:40px;font-size:12px}
  .timeline-content{padding:20px}
  .timeline-content h4{font-size:18px}
  .timeline-content p{font-size:13px}
  .timeline-year{font-size:10px}
  
  .services-section{padding:80px 0 80px 20px}
  .services-wrap{padding-right:20px}
  .services-head{padding-right:20px;margin-bottom:50px}
  .services-scroll{padding-right:20px;gap:16px}
  .service-card{flex:0 0 85vw;max-width:340px}
  .service-img{height:240px}
  .service-body{padding:24px}
  .service-body h3{font-size:22px}
  .service-body p{font-size:13px;margin-bottom:18px}
  .scroll-indicator{padding-right:20px;margin-top:30px}
  
  .tech-section{padding:80px 20px}
  .tech-head{margin-bottom:50px}
  .tech-grid{grid-template-columns:1fr 1fr;gap:14px}
  .tech-card{padding:22px}
  .tech-ic{width:46px;height:46px;margin-bottom:14px}
  .tech-ic svg{width:22px;height:22px}
  .tech-card h4{font-size:17px;margin-bottom:8px}
  .tech-card p{font-size:12px}
  .tech-tag{font-size:9px;padding:3px 8px;margin-top:12px}
  
  .patho-section{padding:80px 20px}
  .bento{grid-template-columns:1fr;grid-template-rows:auto;gap:14px}
  .bento-item{padding:24px;min-height:180px}
  .bento-item.large,.bento-item.wide{grid-column:span 1}
  .bento-item.large{min-height:280px}
  .bento-item.large h3{font-size:28px}
  .bento-item.large p{font-size:14px}
  .bento-item h3{font-size:20px}
  .bento-item p{font-size:13px}
  .bento-ic{width:46px;height:46px}
  .bento-ic svg{width:22px;height:22px}
  
  .journey-section{padding:80px 20px}
  .journey-head{margin-bottom:60px}
  .journey{grid-template-columns:1fr;gap:24px}
  .journey-step{
    padding:20px 20px 20px 80px;
    text-align:left;
    background:var(--cream);
    border-radius:16px;
    border:1px solid var(--line);
    position:relative;
  }
  .journey-num{
    top:50%;left:20px;
    transform:translateY(-50%);
    width:48px;height:48px;font-size:18px;
  }
  .journey-step:hover .journey-num{transform:translateY(-50%) scale(1.05)}
  .journey-step h4{font-size:17px;margin-bottom:4px}
  .journey-step p{font-size:12px}
  
  .urgence-section{padding:80px 20px}
  .urgence-wrap{gap:50px}
  .urgence-visual{height:360px}
  .urgence-visual-badge{bottom:20px;left:20px;padding:12px 18px;font-size:10px}
  .urgence-section h2{font-size:clamp(32px,7vw,48px)}
  .urgence-section>p{font-size:15px;margin-bottom:30px}
  .urgence-list{margin-top:50px}
  .urgence-item{grid-template-columns:40px 1fr auto;gap:14px;padding:18px 0}
  .urgence-num{font-size:11px}
  .urgence-item h4{font-size:17px}
  .urgence-item .arrow{width:32px;height:32px}
  
  .testimonials{padding:80px 20px}
  .testi-head{margin-bottom:50px}
  .testi-rating-num{font-size:48px}
  .testi-grid{grid-template-columns:1fr;gap:16px}
  .testi{padding:28px}
  .testi-quote{font-size:56px}
  .testi p{font-size:14px}
  
  .faq-section{padding:80px 20px}
  .faq-head{margin-bottom:50px}
  .faq-item{padding:20px 0}
  .faq-q h4{font-size:18px}
  .faq-toggle{width:38px;height:38px}
  .faq-toggle::before{width:12px}
  .faq-toggle::after{height:12px}
  
  .contact-section{padding:80px 20px}
  .contact-grid{gap:50px;margin-top:50px}
  .contact-row{grid-template-columns:1fr;gap:6px;padding:20px 0}
  .contact-row-label{padding-top:0}
  .contact-row-value{font-size:18px}
  .contact-form{padding:30px 24px}
  .contact-form h3{font-size:26px;margin-bottom:24px}
  .form-group{margin-bottom:22px}
  .form-group input,.form-group textarea{font-size:16px}
  
  .cta-final{padding:100px 20px;min-height:auto}
  .cta-final h2{font-size:clamp(36px,10vw,64px);margin-bottom:24px}
  .cta-final p{font-size:15px;margin-bottom:36px}
  .cta-final .btn-primary{padding:18px 32px;font-size:14px;width:100%;max-width:320px;justify-content:center}
  
  .footer{padding:60px 20px 24px}
  .footer-grid{grid-template-columns:1fr;gap:40px;padding-bottom:40px}
  .footer-brand p{max-width:100%}
  .footer-bottom{flex-direction:column;gap:8px;text-align:center;font-size:10px}
  
  /* RDV PAGE */
  .rdv-hero{padding:120px 20px 60px}
  .rdv-hero h1{font-size:clamp(36px,9vw,60px)}
  .rdv-hero p{font-size:15px}
  .rdv-container{padding:0 20px 80px}
  
  .steps{grid-template-columns:1fr;gap:14px;margin-bottom:50px;padding-bottom:20px}
  .step{padding:8px 0}
  .step-num{width:36px;height:36px;font-size:11px}
  .step-title{font-size:15px}
  
  .motif-head h3{font-size:28px}
  .motif-head p{font-size:14px}
  .motif-grid{grid-template-columns:1fr 1fr;gap:12px;margin-bottom:40px}
  .motif{padding:24px 18px}
  .motif-ic{width:48px;height:48px;margin-bottom:16px}
  .motif-ic svg{width:22px;height:22px}
  .motif h3{font-size:16px}
  .motif p{font-size:12px}
  
  .calendar-wrap{padding:24px 18px}
  .calendar-head h3{font-size:22px}
  .cal-nav{width:40px;height:40px;font-size:16px}
  .calendar-days{gap:4px}
  .cal-day-name{font-size:9px;padding:8px 0;letter-spacing:1px}
  .cal-day{font-size:13px;border-radius:10px}
  .cal-hint{font-size:10px;margin-top:18px}
  
  .slots-wrap{padding:24px 18px}
  .slots-wrap h3{font-size:22px}
  .slots-sub{font-size:10px;margin-bottom:18px}
  .slots-grid{grid-template-columns:repeat(3,1fr);gap:8px}
  .slot{padding:12px 8px;font-size:13px}
  
  .recap-form{grid-template-columns:1fr;padding:30px 20px;gap:24px}
  .recap{padding:24px}
  .recap h3{font-size:20px;margin-bottom:18px}
  .recap-row{font-size:13px;padding:12px 0;flex-wrap:wrap}
  .recap-row span:last-child{font-size:15px}
  
  .confirm{padding:50px 24px}
  .confirm-check{width:80px;height:80px;font-size:36px}
  .confirm h2{font-size:28px}
  .confirm>p{font-size:14px}
  .confirm-recap{padding:20px}
}

/* ========================================
   RESPONSIVE — PETIT MOBILE (≤ 420px)
   ======================================== */
@media(max-width:420px){
  :root{
    --pad-x:18px;
    --section-pad:80px;
  }
  .hero-title{font-size:44px}
  .hero-iris-wrap{width:200px;height:200px}
  .hero-iris{width:170px;height:170px}
  .hero-pupil{width:68px;height:68px}
  
  .stats-grid{grid-template-columns:1fr;gap:12px}
  .stat-card{padding:18px;display:flex;align-items:center;gap:16px}
  .stat-ring{width:50px;height:50px;margin-bottom:0;flex-shrink:0}
  .stat-info{flex:1}
  
  .about-visual{height:420px}
  .about-img-main{right:10px;bottom:60px}
  .about-img-accent{width:130px;height:100px;border-width:5px}
  .glass-card.gc2{display:none}
  
  .tech-grid{grid-template-columns:1fr}
  
  .motif-grid{grid-template-columns:1fr}
  
  .journey-step{padding-left:70px}
  .journey-num{width:42px;height:42px;font-size:16px}
  
  .slots-grid{grid-template-columns:repeat(2,1fr)}
  
  .recap-form{padding:24px 18px}
  
  .cal-day{font-size:12px}
  .cal-day-name{font-size:8px}
}

/* ========================================
   RESPONSIVE — GRAND ÉCRAN (≥ 1600px)
   ======================================== */
@media(min-width:1600px){
  :root{
    --pad-x:80px;
  }
  .section-title{font-size:clamp(60px,5vw,100px)}
  .hero-title{font-size:clamp(120px,9vw,180px)}
}

/* ========================================
   ACCESSIBILITÉ & PERFORMANCE
   ======================================== */
@media(hover:none){
  .cursor-dot,.cursor-ring,.cursor-label{display:none}
  body,button,a{cursor:auto}
  .service-card:hover,.bento-item:hover,.tech-card:hover,
  .testi:hover,.journey-step:hover .journey-num{transform:none}
}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms !important;
    animation-iteration-count:1 !important;
    transition-duration:.01ms !important;
  }
  .marquee-track{animation:none}
}

/* Touch devices optimization */
@media(pointer:coarse){
  .cal-day,.slot,.motif,.faq-item,.nav-dot,.btn-primary{
    min-height:44px;
  }
  .cal-day.available{min-height:44px}
  .slot{min-height:48px}
}
</style>
<link rel="stylesheet" href="css/motion.css">
</head>
<script src="js/motion.js" defer>
