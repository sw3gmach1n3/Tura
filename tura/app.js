// app.js - Simple logic + localStorage

const qs = s => document.querySelector(s);
const bigName = qs('#bigName');
const todayDateEl = qs('#todayDate');
const refDateEl = qs('#refDate');
const refPersonEl = qs('#refPerson');
const switchDayEl = qs('#switchDay');

const modal = qs('#modal');
const checkModal = qs('#checkModal');

const inputRefDate = qs('#inputRefDate');
const inputRefPerson = qs('#inputRefPerson');
const inputNameA = qs('#inputNameA');
const inputNameB = qs('#inputNameB');
const inputSwitchDay = qs('#inputSwitchDay');

const inputCheckDate = qs('#inputCheckDate');
const checkResult = qs('#checkResult');

const defaultData = {
  referenceDate: '2025-05-03',
  refPerson: 'Nuța',
  nameA: 'Nuța',
  nameB: 'Angi',
  switchDayIndex: 5 // vineri
};

function loadSettings(){
  const raw = localStorage.getItem('tura.settings');
  return raw ? JSON.parse(raw) : defaultData;
}
function saveSettings(v){
  localStorage.setItem('tura.settings', JSON.stringify(v));
}

function parseDateISO(s){
  // s like YYYY-MM-DD -> Date at 00:00 local
  if(!s) return null;
  const parts = s.split('-').map(Number);
  return new Date(parts[0], parts[1]-1, parts[2]);
}

function daysBetween(a,b){
  // Clear time, compute floor difference in days
  const _a = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const _b = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  const diff = (_b - _a) / (1000*60*60*24);
  return Math.floor(diff);
}

function whoOnDate(targetDate, settings){
  const ref = parseDateISO(settings.referenceDate);
  if(!ref) return '—';
  const d = targetDate;
  const dayDiff = daysBetween(ref, d);
  const weeksPassed = Math.floor(dayDiff / 7);
  const isEven = (weeksPassed % 2 === 0);
  return isEven ? settings.refPerson : (settings.refPerson === settings.nameA ? settings.nameB : settings.nameA);
}

function updateUI(){
  const settings = loadSettings();
  const today = new Date();
  todayDateEl.textContent = today.toLocaleDateString();
  refDateEl.textContent = settings.referenceDate;
  refPersonEl.textContent = settings.refPerson;
  // switch day label (we'll show text)
  const days = ['duminică','luni','marți','miercuri','joi','vineri','sâmbătă'];
  switchDayEl.textContent = days[settings.switchDayIndex || 5];

  const who = whoOnDate(today, settings);
  bigName.textContent = who.toUpperCase();
}

function openSettings(){
  const s = loadSettings();
  inputRefDate.value = s.referenceDate;
  inputRefPerson.value = s.refPerson;
  inputNameA.value = s.nameA;
  inputNameB.value = s.nameB;
  inputSwitchDay.value = (s.switchDayIndex||5).toString();
  modal.classList.remove('hidden');
}

function closeSettings(){ modal.classList.add('hidden'); }
function openCheck(){ checkModal.classList.remove('hidden'); }
function closeCheck(){ checkModal.classList.add('hidden'); checkResult.textContent = ''; inputCheckDate.value=''; }

qs('#btnSettings').addEventListener('click', openSettings);
qs('#closeSettings').addEventListener('click', closeSettings);
qs('#saveSettings').addEventListener('click', ()=>{
  const v = {
    referenceDate: inputRefDate.value || defaultData.referenceDate,
    refPerson: inputRefPerson.value || defaultData.refPerson,
    nameA: inputNameA.value || defaultData.nameA,
    nameB: inputNameB.value || defaultData.nameB,
    switchDayIndex: parseInt(inputSwitchDay.value,10) || defaultData.switchDayIndex
  };
  saveSettings(v);
  updateUI();
  closeSettings();
});

qs('#btnCheckOther').addEventListener('click', openCheck);
qs('#closeCheck').addEventListener('click', closeCheck);
qs('#doCheck').addEventListener('click', ()=>{
  const s = loadSettings();
  if(!inputCheckDate.value){ checkResult.textContent = 'Introdu o dată.'; return; }
  const d = parseDateISO(inputCheckDate.value);
  const who = whoOnDate(d, s);
  checkResult.textContent = who.toUpperCase();
});

// init defaults if none
if(!localStorage.getItem('tura.settings')) saveSettings(defaultData);

// initial render
updateUI();

// register service worker (for PWA)
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{ /* ignore */ });
}
