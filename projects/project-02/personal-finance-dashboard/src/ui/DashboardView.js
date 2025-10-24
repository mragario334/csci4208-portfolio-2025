import { saveToJsonBin } from '../services/jsonbinService.js';
import InitialBalancesView from './InitialBalancesView.js';

export default class DashboardView {
  constructor(state, root, onAddTransaction) {
    this.state = state;
    this.root = root;
    this.onAddTransaction = onAddTransaction;
    this.filter = { account: 'All', category: '' };
  }

  render() {
    const { balances, transactions, name, budgets } = this.state;

    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const net = income - expenses;

    this.root.innerHTML = `
      <div class="dashboard">
        <header>
          <h2>Welcome, ${name || 'User'}!</h2>
          <div class="summary">
            <span> Income: $${income.toFixed(2)}</span>
            <span>Expenses: $${expenses.toFixed(2)}</span>
            <span>Net: $${net.toFixed(2)}</span>
          </div>
        </header>

        <section id="balances">
          <h3>Account Balances</h3>
          ${balances && Object.keys(balances).length
            ? Object.entries(balances)
                .map(([acc, bal]) => `<div>${acc}: <span style="color:${bal < 0 ? 'red' : 'green'}">$${bal.toFixed(2)}</span></div>`)
                .join('')
            : '<p>No balances set.</p>'
          }
        </section>

        <section id="controls">
          <h3>Add Transaction</h3>
          <div class="form-row">
            <input type="date" id="tx-date">
            <select id="tx-account">
              ${balances ? Object.keys(balances).map(acc => `<option value="${acc}">${acc}</option>`).join('') : ''}
            </select>
            <input type="text" id="tx-category" placeholder="Category">
            <input type="number" id="tx-amount" placeholder="Amount">
            <select id="tx-type">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <input type="text" id="tx-note" placeholder="Note">
            <button id="add-tx">Add</button>
            <button id="reset-data" class="danger">Reset</button>
          </div>
        </section>

        <section id="budgets">
          <h3>Budgets</h3>
          <div id="budget-list">
            ${budgets && budgets.length
              ? budgets.map(b => {
                  const totalSpent = transactions
                    .filter(tx => tx.category === b.category && tx.type === 'expense')
                    .reduce((sum, tx) => sum + tx.amount, 0);
                  const over = totalSpent > b.amount;
                  return `<div class="budget-item">
                            ${b.category}: $${totalSpent.toFixed(2)} / $${b.amount.toFixed(2)}
                            ${over ? '<span style="color:red">⚠️ Over Budget</span>' : ''}
                          </div>`;
                }).join('')
              : '<p>No budgets set.</p>'
            }
          </div>
          <div id="budget-form">
            <input type="text" id="budget-category" placeholder="Category">
            <input type="number" id="budget-amount" placeholder="Amount">
            <button id="add-budget">Add Budget</button>
          </div>
        </section>

        <section id="filters">
          <h3>Filter Transactions</h3>
          <select id="filter-account">
            <option value="All">All Accounts</option>
            ${balances ? Object.keys(balances).map(acc => `<option value="${acc}">${acc}</option>`).join('') : ''}
          </select>
          <input type="text" id="filter-category" placeholder="Search category">
        </section>

        <section id="transactions">
          <h3>Transactions</h3>
          <ul></ul>
        </section>
      </div>
    `;

    this.attachHandlers();
    this.renderTransactions();
  }

  attachHandlers() {
    const addBtn = this.root.querySelector('#add-tx');
    const resetBtn = this.root.querySelector('#reset-data');
    const filterAccount = this.root.querySelector('#filter-account');
    const filterCategory = this.root.querySelector('#filter-category');
    const addBudgetBtn = this.root.querySelector('#add-budget');

    addBtn.onclick = async () => {
      const tx = {
        date: this.root.querySelector('#tx-date').value,
        account: this.root.querySelector('#tx-account').value,
        category: this.root.querySelector('#tx-category').value.trim(),
        amount: parseFloat(this.root.querySelector('#tx-amount').value),
        type: this.root.querySelector('#tx-type').value,
        note: this.root.querySelector('#tx-note').value.trim()
      };

      if (!tx.date || !tx.account || !tx.category || isNaN(tx.amount)) {
        alert('Please fill in all required fields correctly.');
        return;
      }

      this.onAddTransaction(tx);

      await saveToJsonBin({
        balances: this.state.balances,
        transactions: this.state.transactions,
        budgets: this.state.budgets || [],
        name: this.state.name
      });

      this.render();
    };

    addBudgetBtn.onclick = async () => {
      const category = this.root.querySelector('#budget-category').value.trim();
      const amount = parseFloat(this.root.querySelector('#budget-amount').value);
      if (!category || isNaN(amount)) {
        alert('Please enter a valid category and amount.');
        return;
      }

      if (!this.state.budgets) this.state.budgets = [];
      this.state.budgets.push({ category, amount });

      await saveToJsonBin({
        balances: this.state.balances,
        transactions: this.state.transactions,
        budgets: this.state.budgets,
        name: this.state.name
      });

      this.render();
    };

    resetBtn.onclick = async () => {
      if (confirm('Are you sure you want to reset all data?')) {
        this.state.reset();
        this.state.budgets = [];
        await saveToJsonBin({ balances: {}, transactions: [], budgets: [], name: '' });

        const initView = new InitialBalancesView(this.state, this.root, async () => {
          await saveToJsonBin({
            balances: this.state.balances,
            transactions: this.state.transactions,
            budgets: this.state.budgets,
            name: this.state.name
          });
          this.render();
        });
        initView.render();
      }
    };

    filterAccount.onchange = () => {
      this.filter.account = filterAccount.value;
      this.renderTransactions();
    };

    filterCategory.oninput = () => {
      this.filter.category = filterCategory.value.toLowerCase();
      this.renderTransactions();
    };
  }

  renderTransactions() {
    const list = this.root.querySelector('#transactions ul');
    const filtered = this.state.transactions.filter(tx => {
      const matchesAccount =
        this.filter.account === 'All' || tx.account === this.filter.account;
      const matchesCategory =
        !this.filter.category ||
        tx.category.toLowerCase().includes(this.filter.category);
      return matchesAccount && matchesCategory;
    });

    const sortedTx = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    list.innerHTML = sortedTx.length
    ? sortedTx.map(tx => `
        <li class="transaction-row ${tx.type}">
          <span class="col date">${tx.date}</span>
          <span class="col account">${tx.account}</span>
          <span class="col category">${tx.category}</span>
          <span class="col type">${tx.type}</span>
          <span class="col amount">$${tx.amount.toFixed(2)}</span>
          <span class="col note">${tx.note}</span>
        </li>
      `).join('')
    : `<p>No transactions found.</p>`;
  
  }
}
