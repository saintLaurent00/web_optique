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
