(() => {
  'use strict';

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


})();
