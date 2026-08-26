/* ===================================================================
   שחר, השכרת רכב | UI-only interactive prototype
   No backend: all pricing / booking state lives client-side in memory.
=================================================================== */

const CARS = [
  {
    id: 'economy',
    name: 'עירוני · קבוצה A',
    model: 'פולקסווגן UP! או דומה',
    category: 'economy',
    categoryLabel: 'עירוני',
    img: 'assets/images/cars/car-economy.png',
    seats: 4, bags: 1, trans: 'ידני', ac: true,
    rating: 4.6,
    badge: 'הכי משתלם',
    price: { halfday: 79, daily: 129, weekly: 749, monthly: 2890 }
  },
  {
    id: 'family',
    name: 'משפחתי · קבוצה B',
    model: 'טויוטה קורולה או דומה',
    category: 'family',
    categoryLabel: 'משפחתי',
    img: 'assets/images/cars/car-family.png',
    seats: 5, bags: 3, trans: 'אוטומט', ac: true,
    rating: 4.8,
    badge: 'הכי מבוקש',
    price: { halfday: 99, daily: 169, weekly: 949, monthly: 3790 }
  },
  {
    id: 'comfort',
    name: 'נוח · קבוצה C',
    model: 'שקודה אוקטביה או דומה',
    category: 'comfort',
    categoryLabel: 'נוח',
    img: 'assets/images/cars/car-comfort.png',
    seats: 5, bags: 3, trans: 'אוטומט', ac: true,
    rating: 4.7,
    badge: '',
    price: { halfday: 119, daily: 199, weekly: 1119, monthly: 4490 }
  },
  {
    id: 'suv',
    name: 'שטח SUV · קבוצה D',
    model: 'יונדאי טוסון או דומה',
    category: 'suv',
    categoryLabel: 'שטח',
    img: 'assets/images/cars/car-suv.png',
    seats: 5, bags: 4, trans: 'אוטומט', ac: true,
    rating: 4.8,
    badge: '',
    price: { halfday: 149, daily: 249, weekly: 1399, monthly: 5590 }
  },
  {
    id: 'suv-premium',
    name: 'יוקרה SUV · קבוצה E',
    model: 'מרצדס ML או דומה',
    category: 'luxury',
    categoryLabel: 'יוקרה',
    img: 'assets/images/cars/car-suv-premium.png',
    seats: 5, bags: 4, trans: 'אוטומט', ac: true,
    rating: 4.9,
    badge: 'פרימיום',
    price: { halfday: 209, daily: 349, weekly: 1990, monthly: 7890 }
  },
  {
    id: 'luxury',
    name: 'ספורט יוקרה · קבוצה F',
    model: 'BMW i8 או דומה',
    category: 'luxury',
    categoryLabel: 'יוקרה',
    img: 'assets/images/cars/car-luxury.png',
    seats: 2, bags: 2, trans: 'אוטומט', ac: true,
    rating: 5.0,
    badge: 'אקסקלוסיבי',
    price: { halfday: 349, daily: 590, weekly: 3390, monthly: 13290 }
  }
];

const EXTRAS = [
  { id: 'cdw',   name: 'ביטוח מקיף, בלי השתתפות עצמית', desc: 'מכסה נזק וגניבה, בלי לשלם מהכיס בתאונה', price: 39, unit: 'day', icon: 'shield' },
  { id: 'driver', name: 'נהג נוסף',                       desc: 'עוד נהג מורשה, על אותו חוזה',           price: 25, unit: 'day', icon: 'user' },
  { id: 'gps',   name: 'ניווט GPS',                       desc: 'מערכת ניווט מובנית בעברית',             price: 15, unit: 'day', icon: 'nav' },
  { id: 'seat',  name: 'כיסא בטיחות לילדים',              desc: 'מותקן ומוכן מראש בעת האיסוף',           price: 20, unit: 'day', icon: 'seat' },
  { id: 'fuel',  name: 'מיכל דלק מלא מראש',               desc: 'מחזירים ריק, בלי לחפש תחנה',            price: 129, unit: 'once', icon: 'fuel' }
];

const ICONS = {
  shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>',
  user: '<circle cx="12" cy="8" r="3.3"/><path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5"/>',
  nav: '<path d="M12 2l4 15-4-2.5L8 17 12 2z"/>',
  seat: '<path d="M7 3h6v7l4 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>',
  fuel: '<path d="M5 21V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v15"/><path d="M5 11h10"/><path d="M15 8l3 3v6a1.5 1.5 0 0 1-3 0"/>',
};

const state = {
  period: 'daily',         // halfday | daily | weekly | monthly
  activeCategory: 'all',
  currentCar: null,
  step: 1,
  extras: {},              // { extraId: bool }
};

const els = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheEls();
  renderFleet();
  bindRentalTabs();
  updateTabsPriceHint();
  bindDropoffToggle();
  bindCategoryChips();
  bindModal();
  bindHeroForm();
  bindMobileStickyBar();
  bindWhatsappShare();
  bindMobileNav();
  bindCustomSelects();
  bindDatePickers();
  setDefaultDates();
});

function cacheEls(){
  els.fleetGrid = document.getElementById('fleetGrid');
  els.categoryRow = document.getElementById('categoryRow');
  els.rentalTabs = document.querySelectorAll('.rental-tabs button');
  els.modalOverlay = document.getElementById('bookingModal');
  els.modalMain = document.getElementById('modalMain');
  els.modalSide = document.getElementById('modalSide');
  els.progressTrack = document.getElementById('progressTrack');
  els.modalFooter = document.getElementById('modalFooter');
  els.modalTitle = document.getElementById('modalTitle');
  els.mobileCtaBar = document.getElementById('mobileCtaBar');
  els.dropoffToggleInput = document.getElementById('dropoffToggle');
  els.dropoffField = document.getElementById('dropoffLocationField');
  els.rentalNote = document.getElementById('rentalNote');
  els.pickupDate = document.getElementById('pickupDate');
  els.returnDate = document.getElementById('returnDate');
}

/* ---------------- Fleet rendering ---------------- */

function periodLabel(period){
  if(period === 'halfday') return 'לחצי יום';
  if(period === 'daily') return 'ליום';
  if(period === 'weekly') return 'לשבוע';
  return 'לחודש';
}

function renderFleet(){
  const filtered = state.activeCategory === 'all'
    ? CARS
    : CARS.filter(c => c.category === state.activeCategory);

  els.fleetGrid.innerHTML = filtered.map(car => cardTemplate(car)).join('');

  els.fleetGrid.querySelectorAll('[data-select-car]').forEach(card => {
    card.addEventListener('click', () => openBookingModal(card.getAttribute('data-select-car')));
  });
}

function cardTemplate(car){
  const price = car.price[state.period];
  return `
  <article class="car-card" data-select-car="${car.id}">
    <div class="car-media">
      ${car.badge ? `<span class="car-badge${car.category==='luxury' ? ' badge-dark':''}">${car.badge}</span>` : ''}
      <img src="${car.img}" alt="${car.name}, ${car.categoryLabel}" loading="lazy">
    </div>
    <div class="car-body">
      <div class="car-title-row">
        <div>
          <h3>${car.name}</h3>
          <div class="cat-label">${car.model}</div>
        </div>
        <div class="car-rating" aria-label="דירוג ${car.rating} מתוך 5">
          ${starIcon()} ${car.rating.toFixed(1)}
        </div>
      </div>
      <div class="car-specs">
        <span class="car-spec">${seatIcon()} ${car.seats} נוסעים</span>
        <span class="car-spec">${bagIcon()} ${car.bags} מזוודות</span>
        <span class="car-spec">${gearIcon()} ${car.trans}</span>
        <span class="car-spec">${acIcon()} מיזוג</span>
      </div>
      <div class="car-footer">
        <div class="car-price">
          <span class="amount">₪${price.toLocaleString('he-IL')}</span>
          <span class="period"> ${periodLabel(state.period)}, כולל מע״מ</span>
        </div>
        <button class="btn btn-primary" type="button">בחרו רכב</button>
      </div>
    </div>
  </article>`;
}

function bindRentalTabs(){
  els.rentalTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      els.rentalTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.period = btn.getAttribute('data-period');
      renderFleet();
      updateMobileBar();
      updateTabsPriceHint();
      els.rentalNote?.classList.toggle('visible', state.period === 'halfday');
    });
  });
}

function updateTabsPriceHint(){
  const hintEl = document.getElementById('tabsPriceHint');
  if(!hintEl) return;
  const cheapest = Math.min(...CARS.map(c => c.price[state.period]));
  hintEl.innerHTML = `החל מ-<strong>₪${cheapest.toLocaleString('he-IL')}</strong> ${periodLabel(state.period)}`;
}

function bindCategoryChips(){
  els.categoryRow.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      els.categoryRow.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeCategory = chip.getAttribute('data-category');
      renderFleet();
    });
  });
}

function bindDropoffToggle(){
  if(!els.dropoffToggleInput) return;
  els.dropoffToggleInput.addEventListener('change', () => {
    els.dropoffField.style.display = els.dropoffToggleInput.checked ? 'block' : 'none';
  });
}

function setDefaultDates(){
  const today = new Date();
  const pickup = new Date(today); pickup.setDate(today.getDate() + 2);
  const ret = new Date(today); ret.setDate(today.getDate() + 5);
  pickupDatePickerCtrl?.setDate(pickup);
  returnDatePickerCtrl?.setDate(ret);
}

/* ---------------- Custom select (location fields) ---------------- */

function bindCustomSelects(){
  document.querySelectorAll('.custom-select').forEach(root => {
    const trigger = root.querySelector('.custom-select-trigger');
    const valueEl = root.querySelector('.custom-select-value');
    const list = root.querySelector('.custom-select-list');
    const hidden = root.parentElement.querySelector(`input[type=hidden]`);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = root.classList.contains('open');
      closeAllPopups();
      if(!isOpen) root.classList.add('open');
    });

    list.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        list.querySelectorAll('li').forEach(o => o.classList.remove('selected'));
        li.classList.add('selected');
        valueEl.textContent = li.textContent;
        if(hidden) hidden.value = li.textContent;
        root.classList.remove('open');
      });
    });
  });
}

function closeAllPopups(){
  document.querySelectorAll('.custom-select.open, .custom-date.open').forEach(o => o.classList.remove('open'));
}

/* ---------------- Custom date picker ---------------- */

const HEBREW_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HEBREW_WEEKDAYS = ['א','ב','ג','ד','ה','ו','ש'];

function sameDay(a, b){
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function stripTime(d){ return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function formatISO(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function formatDisplay(d){
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function createDatePicker(rootId, { minDateGetter, onChange } = {}){
  const root = document.getElementById(rootId);
  if(!root) return null;
  const trigger = root.querySelector('.custom-date-trigger');
  const valueEl = root.querySelector('.custom-date-value');
  const panel = root.querySelector('.custom-date-panel');
  const hidden = root.parentElement.querySelector('input[type=hidden]');

  let selected = new Date();
  let viewYear = selected.getFullYear();
  let viewMonth = selected.getMonth();

  function render(){
    const minDate = minDateGetter ? minDateGetter() : null;
    const first = new Date(viewYear, viewMonth, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    let html = `
      <div class="dp-header">
        <button type="button" class="dp-nav" data-nav="prev">&rsaquo;</button>
        <span class="dp-title">${HEBREW_MONTHS[viewMonth]} ${viewYear}</span>
        <button type="button" class="dp-nav" data-nav="next">&lsaquo;</button>
      </div>
      <div class="dp-weekdays">${HEBREW_WEEKDAYS.map(d => `<span>${d}</span>`).join('')}</div>
      <div class="dp-grid">`;

    for(let i = 0; i < startOffset; i++) html += `<span class="dp-day dp-empty"></span>`;
    for(let d = 1; d <= daysInMonth; d++){
      const thisDate = new Date(viewYear, viewMonth, d);
      const isSelected = selected && sameDay(thisDate, selected);
      const isToday = sameDay(thisDate, new Date());
      const disabled = minDate && thisDate < stripTime(minDate);
      html += `<button type="button" class="dp-day${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}" ${disabled ? 'disabled' : ''} data-day="${d}">${d}</button>`;
    }
    html += `</div>`;
    panel.innerHTML = html;

    panel.querySelector('[data-nav="prev"]').addEventListener('click', (e) => {
      e.stopPropagation();
      viewMonth--; if(viewMonth < 0){ viewMonth = 11; viewYear--; }
      render();
    });
    panel.querySelector('[data-nav="next"]').addEventListener('click', (e) => {
      e.stopPropagation();
      viewMonth++; if(viewMonth > 11){ viewMonth = 0; viewYear++; }
      render();
    });
    panel.querySelectorAll('.dp-day:not(.dp-empty)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(btn.disabled) return;
        setDate(new Date(viewYear, viewMonth, parseInt(btn.getAttribute('data-day'), 10)));
        root.classList.remove('open');
        onChange && onChange(selected);
      });
    });
  }

  function setDate(date){
    selected = date;
    viewYear = date.getFullYear();
    viewMonth = date.getMonth();
    if(hidden) hidden.value = formatISO(date);
    valueEl.textContent = formatDisplay(date);
    render();
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = root.classList.contains('open');
    closeAllPopups();
    if(!wasOpen){ root.classList.add('open'); render(); }
  });

  return { setDate, getDate: () => selected };
}

let pickupDatePickerCtrl = null;
let returnDatePickerCtrl = null;

function bindDatePickers(){
  pickupDatePickerCtrl = createDatePicker('pickupDatePicker', {
    onChange(date){
      const ret = returnDatePickerCtrl?.getDate();
      if(ret && ret < date){
        const bumped = new Date(date); bumped.setDate(date.getDate() + 3);
        returnDatePickerCtrl.setDate(bumped);
      }
    }
  });
  returnDatePickerCtrl = createDatePicker('returnDatePicker', {
    minDateGetter: () => pickupDatePickerCtrl?.getDate()
  });

  document.addEventListener('click', closeAllPopups);
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeAllPopups(); });
}

function bindHeroForm(){
  const form = document.getElementById('heroSearchForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('fleet').scrollIntoView({ behavior:'smooth', block:'start' });
  });
}

/* ---------------- Mobile nav drawer ---------------- */

function bindMobileNav(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mobileNav');
  if(!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------------- Mobile sticky CTA ---------------- */

function bindMobileStickyBar(){
  const hero = document.querySelector('.hero');
  if(!hero || !els.mobileCtaBar) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      els.mobileCtaBar.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });
  io.observe(hero);
  updateMobileBar();
  document.getElementById('mobileCtaGo')?.addEventListener('click', () => {
    document.getElementById('fleet').scrollIntoView({ behavior:'smooth' });
  });
}

function updateMobileBar(){
  const cheapest = Math.min(...CARS.map(c => c.price[state.period]));
  const amountEl = document.getElementById('mobileCtaAmount');
  const periodEl = document.getElementById('mobileCtaPeriod');
  if(amountEl) amountEl.textContent = `החל מ-₪${cheapest.toLocaleString('he-IL')}`;
  if(periodEl) periodEl.textContent = periodLabel(state.period);
}

/* ---------------- Booking modal ---------------- */

function rentalDaysFromDates(){
  if(!els.pickupDate?.value || !els.returnDate?.value) return 3;
  const d1 = new Date(els.pickupDate.value);
  const d2 = new Date(els.returnDate.value);
  const diff = Math.round((d2 - d1) / 86400000);
  return diff > 0 ? diff : 3;
}

function openBookingModal(carId){
  state.currentCar = CARS.find(c => c.id === carId);
  state.step = 1;
  state.extras = {};
  state.confirmCode = null;
  EXTRAS.forEach(x => state.extras[x.id] = false);
  els.modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderModal();
}

function closeBookingModal(){
  els.modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

function bindModal(){
  document.getElementById('modalCloseBtn')?.addEventListener('click', closeBookingModal);
  els.modalOverlay.addEventListener('click', (e) => {
    if(e.target === els.modalOverlay) closeBookingModal();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeBookingModal();
  });
}

function computeTotals(){
  const car = state.currentCar;
  const period = state.period;
  const days = period === 'halfday' ? 1 : period === 'daily' ? rentalDaysFromDates() : (period === 'weekly' ? 7 : 30);
  const base = car.price[period];
  let extrasTotal = 0;
  const extraLines = [];
  EXTRAS.forEach(x => {
    if(!state.extras[x.id]) return;
    const qty = x.unit === 'once' ? 1 : days;
    const lineTotal = x.price * qty;
    extrasTotal += lineTotal;
    extraLines.push({ ...x, qty, lineTotal });
  });
  return { days, base, extrasTotal, extraLines, total: base + extrasTotal };
}

function renderModal(){
  const car = state.currentCar;
  const steps = ['תוספות', 'פרטים אישיים', 'תשלום', 'אישור'];
  els.modalTitle.textContent = `הזמנת ${car.name}`;
  els.progressTrack.innerHTML = steps.map((_, i) =>
    `<span class="seg ${i < state.step ? 'done' : ''}"></span>`).join('');

  renderModalSide();
  renderModalStep();
  renderModalFooter();
}

function renderModalSide(){
  const car = state.currentCar;
  const t = computeTotals();
  els.modalSide.innerHTML = `
    <div class="summary-block">
      <h4>הרכב שנבחר</h4>
      <div class="summary-car">
        <img src="${car.img}" alt="${car.name}">
        <div>
          <strong>${car.name}</strong>
          <span>${car.model}</span>
        </div>
      </div>
    </div>
    <div class="summary-block">
      <h4>פרטי השכירות</h4>
      <div class="summary-line"><span>תקופה</span><strong>${state.period === 'halfday' ? 'חצי יום' : `${periodLabel(state.period).replace('ל','')} (${t.days} ימים)`}</strong></div>
      <div class="summary-line"><span>מחיר בסיס</span><strong>₪${t.base.toLocaleString('he-IL')}</strong></div>
      ${t.extraLines.map(x => `
        <div class="summary-line"><span>${x.name}</span><strong>₪${x.lineTotal.toLocaleString('he-IL')}</strong></div>
      `).join('')}
    </div>
    <div class="summary-total">
      <span class="label">סה״כ לתשלום</span>
      <span class="value">₪${t.total.toLocaleString('he-IL')}</span>
    </div>
  `;
}

function renderModalStep(){
  const car = state.currentCar;
  const t = computeTotals();
  let html = state.step < 4 ? `
    <div class="summary-toggle-mobile">
      <span>${car.name} · ${t.days} ימים</span>
      <span>סה״כ: ₪${t.total.toLocaleString('he-IL')}</span>
    </div>
  ` : '';

  if(state.step === 1){
    html += `
      <div class="step-title">תוספות אופציונליות</div>
      <div class="step-sub">בחרו את מה שחשוב לכם. אפשר גם לדלג ולהמשיך בלי תוספות.</div>
      ${EXTRAS.map(x => `
        <label class="extra-card ${state.extras[x.id] ? 'checked' : ''}" data-extra-row="${x.id}">
          <div class="icon-wrap"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[x.icon]}</svg></div>
          <div class="extra-info">
            <strong>${x.name}</strong>
            <span>${x.desc}</span>
          </div>
          <div class="extra-price">₪${x.price}${x.unit==='once' ? ' חד פעמי' : ' / יום'}</div>
          <input type="checkbox" data-extra-toggle="${x.id}" ${state.extras[x.id] ? 'checked' : ''}>
        </label>
      `).join('')}
    `;
  }

  if(state.step === 2){
    html += `
      <div class="step-title">פרטים אישיים</div>
      <div class="step-sub">הפרטים כאן להדגמה בלבד. לא נשמר ולא נשלח מידע אמיתי.</div>
      <div class="form-grid">
        <div class="form-field"><label>שם פרטי</label><input type="text" placeholder="ישראל"></div>
        <div class="form-field"><label>שם משפחה</label><input type="text" placeholder="ישראלי"></div>
        <div class="form-field"><label>טלפון נייד</label><input type="tel" placeholder="050-0000000"></div>
        <div class="form-field"><label>דוא״ל</label><input type="email" placeholder="name@example.com"></div>
        <div class="form-field"><label>מספר רישיון נהיגה</label><input type="text" placeholder="000000000"></div>
        <div class="form-field"><label>תאריך לידה</label><input type="date"></div>
      </div>
    `;
  }

  if(state.step === 3){
    html += `
      <div class="step-title">תשלום</div>
      <div class="step-sub">הדגמה בלבד. אין חיוב אמיתי בשלב זה.</div>
      <div class="pay-card-visual">
        <div class="chip-icon"></div>
        <div class="num">•••• •••• •••• 4291</div>
        <div class="row"><span>שם בעל הכרטיס</span><span>תוקף</span></div>
      </div>
      <div class="form-grid">
        <div class="form-field full"><label>מספר כרטיס</label><input type="text" placeholder="0000 0000 0000 0000"></div>
        <div class="form-field"><label>תוקף</label><input type="text" placeholder="MM/YY"></div>
        <div class="form-field"><label>CVV</label><input type="text" placeholder="123"></div>
      </div>
      <div class="summary-total" style="margin-top:20px;">
        <span class="label">סה״כ לחיוב</span>
        <span class="value">₪${t.total.toLocaleString('he-IL')}</span>
      </div>
    `;
  }

  if(state.step === 4){
    if(!state.confirmCode) state.confirmCode = 'SHR-' + Math.floor(100000 + Math.random()*899999);
    const code = state.confirmCode;
    html = `
      <div class="confirm-wrap">
        <div class="confirm-check">
          <svg class="icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2>ההזמנה אושרה!</h2>
        <p>שלחנו את פרטי ההזמנה לדוא״ל ולנייד שהזנתם. אפשר להציג את מספר האישור בעמדת האיסוף.</p>
        <div class="confirm-code">מספר אישור: ${code}</div>
        <div class="confirm-actions">
          <button class="btn btn-outline btn-sm" onclick="window.print()">הדפסת אישור</button>
          <a class="btn btn-primary btn-sm" id="waConfirmBtn" target="_blank" rel="noopener">שליחה לוואטסאפ</a>
        </div>
      </div>
    `;
  }

  els.modalMain.innerHTML = html;

  if(state.step === 1){
    els.modalMain.querySelectorAll('[data-extra-toggle]').forEach(input => {
      input.addEventListener('change', () => {
        const id = input.getAttribute('data-extra-toggle');
        state.extras[id] = input.checked;
        renderModal();
      });
    });
  }

  if(state.step === 4){
    const car = state.currentCar;
    const t = computeTotals();
    const msg = encodeURIComponent(
      `שלום! ההזמנה שלי בשחר השכרת רכב אושרה.\nרכב: ${car.name}\nתקופה: ${t.days} ימים\nסה״כ: ₪${t.total.toLocaleString('he-IL')}\nמספר אישור: ${state.confirmCode}`
    );
    const waBtn = document.getElementById('waConfirmBtn');
    if(waBtn) waBtn.href = `https://wa.me/?text=${msg}`;
  }
}

function renderModalFooter(){
  const isFirst = state.step === 1;
  const isLast = state.step === 4;
  let html = '';

  if(isLast){
    html = `<button class="btn btn-dark btn-block" id="modalDoneBtn">סגירה</button>`;
  } else {
    html = `
      ${!isFirst ? `<button class="btn btn-outline" id="modalBackBtn">חזרה</button>` : `<button class="btn btn-outline" id="modalCancelBtn">ביטול</button>`}
      <button class="btn btn-primary" id="modalNextBtn">${state.step === 3 ? 'אישור הזמנה' : 'המשך'}</button>
    `;
  }
  els.modalFooter.innerHTML = html;

  document.getElementById('modalNextBtn')?.addEventListener('click', () => {
    state.step += 1;
    renderModal();
    els.modalMain.scrollTop = 0;
  });
  document.getElementById('modalBackBtn')?.addEventListener('click', () => {
    state.step -= 1;
    renderModal();
    els.modalMain.scrollTop = 0;
  });
  document.getElementById('modalCancelBtn')?.addEventListener('click', closeBookingModal);
  document.getElementById('modalDoneBtn')?.addEventListener('click', closeBookingModal);
}

/* ---------------- WhatsApp share (hero / footer) ---------------- */

function bindWhatsappShare(){
  document.querySelectorAll('[data-wa-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = encodeURIComponent('היי! מצאתי אתר השכרת רכב נוח, שחר. אפשר להזמין ישירות דרכו:');
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    });
  });
}

/* ---------------- Icons (inline, no external deps) ---------------- */

function starIcon(){
  return `<svg class="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.5L22 9.3l-5 4.8 1.3 7L12 17.8 5.7 21l1.3-7-5-4.8 7.1-.8L12 2z"/></svg>`;
}
function seatIcon(){
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="3"/><path d="M5 21c0-4.5 3-7.5 7-7.5s7 3 7 7.5"/></svg>`;
}
function bagIcon(){
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="8" width="14" height="12" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>`;
}
function gearIcon(){
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 7v6"/><circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none"/><path d="M8 10h8"/></svg>`;
}
function acIcon(){
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12"/></svg>`;
}
