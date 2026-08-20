const TOTAL_DAYS = 6;
const STORAGE_KEY = 'gei-progress';
const getProgress = () => Math.max(0, Math.min(TOTAL_DAYS, Number(localStorage.getItem(STORAGE_KEY)) || 0));
function updateProgress(value = getProgress()) {
  value = Math.max(0, Math.min(TOTAL_DAYS, Number(value) || 0));
  const fill = document.querySelector('#progressFill');
  const count = document.querySelector('#progressCount');
  if (fill) fill.style.width = `${value / TOTAL_DAYS * 100}%`;
  if (count) count.textContent = `${value}/${TOTAL_DAYS}`;
}
function completeDay(day) {
  const next = Math.max(getProgress(), Number(day) || 0);
  localStorage.setItem(STORAGE_KEY, next);
  updateProgress(next);
}

document.addEventListener('DOMContentLoaded', () => {
  updateProgress();
  const gate = document.querySelector('#liftGate');
  const welcome = document.querySelector('#welcome');
  const portal = document.querySelector('#portal');
  const close = document.querySelector('#closePortal');
  if (gate) gate.addEventListener('click', () => {
    welcome.hidden = true;
    portal.hidden = false;
    portal.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', '#portal');
  });
  if (close) close.addEventListener('click', () => {
    portal.hidden = true;
    welcome.hidden = false;
    welcome.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', location.pathname);
  });
  if (location.hash === '#portal' && welcome && portal) {
    welcome.hidden = true;
    portal.hidden = false;
  }
});
