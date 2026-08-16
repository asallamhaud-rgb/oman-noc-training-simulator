import { Store } from './store.js';
import { Views } from './views.js';

function render() {
  const st = Store.state;
  document.querySelectorAll('.nav-item').forEach(el => {
    if(el.dataset.view === st.currentView) el.classList.add('active');
    else el.classList.remove('active');
  });

  const contentEl = document.getElementById('content');
  const viewFn = Views[st.currentView] || Views.dashboard;
  contentEl.innerHTML = viewFn();
}

// Event delegation for navigation and actions
document.addEventListener('click', e => {
  const nav = e.target.closest('[data-view]');
  if(nav) {
    e.preventDefault();
    Store.dispatch('navigate', nav.dataset.view, render);
    return;
  }

  const actionBtn = e.target.closest('.action-btn');
  if(actionBtn) {
    const action = actionBtn.dataset.action;
    if(action === 'assign-fm') {
      Store.dispatch('assign-fm', { ticket: actionBtn.dataset.ticket, eng: actionBtn.dataset.eng }, render);
    } else {
      Store.dispatch(action, actionBtn.dataset.payload, render);
    }
    return;
  }

  const manualItem = e.target.closest('.manual-select');
  if(manualItem) {
    Store.dispatch('select-manual', manualItem.dataset.id, render);
  }
});

// Initial render
render();
