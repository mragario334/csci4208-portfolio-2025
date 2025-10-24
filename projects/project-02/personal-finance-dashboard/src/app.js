// src/app.js
import AppState from './state/AppState.js';
import InitialBalancesView from './ui/InitialBalancesView.js';
import DashboardView from './ui/DashboardView.js';
import { saveToJsonBin, loadFromJsonBin } from './services/jsonbinService.js';

const root = document.getElementById('app');
const state = new AppState();

async function init() {
  root.innerHTML = `<p>Loading your data...</p>`;
  let binData = null;

  // 1️⃣ Load from JSONBin
  try {
    binData = await loadFromJsonBin();
    if (binData.record) {
      state.balances = binData.record.balances || {};
      state.transactions = binData.record.transactions || [];
      state.name = binData.record.name || '';
    }
  } catch (e) {
    console.warn('Failed to load from JSONBin:', e);
    root.innerHTML = `<p style="color:red;">⚠️ Could not load remote data. Using local or empty state.</p>`;
  }

  // 2️⃣ Restore localStorage and merge
  restoreFromLocalStorage();

  // 3️⃣ Determine initial view
  if (!Object.keys(state.balances).length) {
    const initView = new InitialBalancesView(state, root, async () => {
      await persistState();
      showDashboard();
    });
    initView.render();
  } else {
    showDashboard();
  }

  // --- Helper Functions ---

  async function persistState() {
    try {
      await saveToJsonBin({
        balances: state.balances,
        transactions: state.transactions,
        name: state.name
      });
      localStorage.setItem('appData', JSON.stringify({
        balances: state.balances,
        transactions: state.transactions,
        name: state.name,
        lastSaved: Date.now()
      }));
      console.log('✅ State saved to JSONBin + localStorage');
    } catch (e) {
      console.warn('Save failed, storing locally instead:', e);
      localStorage.setItem('appData', JSON.stringify({
        balances: state.balances,
        transactions: state.transactions,
        name: state.name,
        lastSaved: Date.now()
      }));
    }
  }

  function restoreFromLocalStorage() {
    const stored = localStorage.getItem('appData');
    if (!stored) return;

    const parsed = JSON.parse(stored);
    const tenMinutes = 10 * 60 * 1000;
    const isFresh = parsed.lastSaved && (Date.now() - parsed.lastSaved < tenMinutes);

    if (isFresh) {
      // Merge local with remote
      state.transactions = [...state.transactions, ...parsed.transactions.filter(
        tx => !state.transactions.some(localTx => JSON.stringify(localTx) === JSON.stringify(tx))
      )];
      state.balances = { ...state.balances, ...parsed.balances };
      state.name = parsed.name || state.name;
      console.log('🗂 Restored state from localStorage (fresh, merged).');
    } else {
      console.log('🌐 LocalStorage stale, using remote/empty state.');
    }
  }

  function showDashboard() {
    const dashboard = new DashboardView(state, root, async tx => {
      state.addTransaction(tx);
      await persistState();
      dashboard.render();
    });
    dashboard.render();

    // Background refresh every 5 minutes
    setInterval(async () => {
      try {
        const latest = await loadFromJsonBin();
        if (latest.record) {
          // Merge remote with local state
          const merged = [
            ...state.transactions,
            ...latest.record.transactions.filter(
              tx => !state.transactions.some(localTx => JSON.stringify(localTx) === JSON.stringify(tx))
            ),
          ];
          state.transactions = merged;
          state.balances = latest.record.balances || state.balances;
          state.name = latest.record.name || state.name;
          dashboard.render();

          localStorage.setItem('appData', JSON.stringify({ ...state, lastSaved: Date.now() }));
          console.log('🔄 Background refresh merged remote data');
        }
      } catch (err) {
        console.warn('Background refresh failed:', err);
      }
    }, 5 * 60 * 1000);
  }
}

init();
