(() => {
  'use strict';

  const state = {
    motif: null,
    date: null,
    slot: null,
    viewDate: new Date()
  };

  const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  const dayNames = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  const $ = (id) => document.getElementById(id);
  const els = {
    calendar: $('calendarSection'),
    slots: $('slotsSection'),
    recap: $('recapSection'),
    confirm: $('confirmSection'),
    form: $('rdvForm')
  };

  if (!els.calendar || !els.slots || !els.recap || !els.confirm || !els.form) return;

  const showPanel = (el) => {
    if (el) el.hidden = false;
  };

  const hidePanel = (el) => {
    if (el) el.hidden = true;
  };

  const updateSteps = (active) => {
    document.querySelectorAll('.step').forEach((step) => {
      const number = Number(step.dataset.step);
      step.classList.toggle('done', number < active);
      step.classList.toggle('active', number === active);
    });
  };

  const resetBookingAfterMotif = () => {
    state.date = null;
    state.slot = null;
    hidePanel(els.slots);
    hidePanel(els.recap);
    hidePanel(els.confirm);
  };

  function renderCalendar() {
    const calendarDays = $('calendarDays');
    const monthTitle = $('calMonthYear');
    if (!calendarDays || !monthTitle) return;

    const year = state.viewDate.getFullYear();
    const month = state.viewDate.getMonth();
    monthTitle.textContent = monthNames[month] + ' ' + year;

    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDay = (first.getDay() + 6) % 7;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = dayNames.map((day) => '<div class="cal-day-name">' + day + '</div>').join('');

    for (let i = 0; i < startDay; i += 1) {
      html += '<div class="cal-day empty" aria-hidden="true"></div>';
    }

    for (let day = 1; day <= last.getDate(); day += 1) {
      const date = new Date(year, month, day);
      const weekend = date.getDay() === 0 || date.getDay() === 6;
      const available = date >= today && !weekend;
      const todayClass = date.getTime() === today.getTime() ? ' today' : '';
      const selectedClass = state.date && state.date.getTime() === date.getTime() ? ' selected' : '';

      html += '<button type="button" class="cal-day ' +
        (available ? 'available' : 'disabled') +
        todayClass + selectedClass +
        '" data-day="' + day + '"' +
        (available ? '' : ' disabled') +
        '>' + day + '</button>';
    }

    calendarDays.innerHTML = html;

    calendarDays.querySelectorAll('.cal-day.available').forEach((button) => {
      button.addEventListener('click', () => {
        state.date = new Date(year, month, Number(button.dataset.day));
        state.slot = null;
        updateSteps(3);
        renderCalendar();
        showSlots();
      });
    });

    const currentMonth = year * 12 + month;
    const todayMonth = today.getFullYear() * 12 + today.getMonth();
    const prev = $('prevMonth');
    if (prev) prev.disabled = currentMonth <= todayMonth;
  }

  function showSlots() {
    if (!state.date) return;

    const grid = $('slotsGrid');
    const dateLabel = $('slotDate');
    if (!grid || !dateLabel) return;

    const slots = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'];
    const seed = state.date.getDate() + state.date.getMonth();
    const available = slots.filter((_, index) => (index + seed) % 3 !== 0);

    dateLabel.textContent = state.date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    grid.innerHTML = available
      .map((slot) => '<button type="button" class="slot" data-slot="' + slot + '">' + slot + '</button>')
      .join('');

    grid.querySelectorAll('.slot').forEach((button) => {
      button.addEventListener('click', () => {
        grid.querySelectorAll('.slot').forEach((item) => item.classList.remove('selected'));
        button.classList.add('selected');
        state.slot = button.dataset.slot;
        updateSteps(4);
        showRecap();
      });
    });

    showPanel(els.slots);
  }

  function showRecap() {
    if (!state.date || !state.slot) return;

    $('recapMotif').textContent = state.motif || '—';
    $('recapDate').textContent = state.date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    $('recapSlot').textContent = state.slot;

    showPanel(els.recap);
  }

  document.querySelectorAll('.motif').forEach((motif) => {
    motif.addEventListener('click', () => {
      document.querySelectorAll('.motif').forEach((item) => item.classList.remove('selected'));
      motif.classList.add('selected');

      state.motif = motif.dataset.motif || motif.textContent.trim();
      state.viewDate = new Date();
      resetBookingAfterMotif();

      updateSteps(2);
      renderCalendar();
      showPanel(els.calendar);
    });
  });

  $('prevMonth')?.addEventListener('click', () => {
    state.viewDate = new Date(
      state.viewDate.getFullYear(),
      state.viewDate.getMonth() - 1,
      1
    );
    renderCalendar();
  });

  $('nextMonth')?.addEventListener('click', () => {
    state.viewDate = new Date(
      state.viewDate.getFullYear(),
      state.viewDate.getMonth() + 1,
      1
    );
    renderCalendar();
  });

  els.form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!state.motif || !state.date || !state.slot) return;

    const name = $('fName')?.value.trim();
    const email = $('fEmail')?.value.trim();
    const phone = $('fPhone')?.value.trim();

    if (!name || !email || !phone) {
      els.form.reportValidity();
      return;
    }

    const phoneInput = $('fPhone');
    if (!/^[\d\s+().-]{10,}$/.test(phone)) {
      phoneInput?.setCustomValidity('Veuillez saisir un numéro de téléphone valide.');
      phoneInput?.reportValidity();
      phoneInput?.setCustomValidity('');
      return;
    }

    $('confMotif').textContent = state.motif;
    $('confDate').textContent =
      state.date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }) + ' à ' + state.slot;

    hidePanel(els.recap);
    showPanel(els.confirm);
  });

  hidePanel(els.calendar);
  hidePanel(els.slots);
  hidePanel(els.recap);
  hidePanel(els.confirm);
  updateSteps(1);
})();