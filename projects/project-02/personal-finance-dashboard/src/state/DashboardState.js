export default class DashboardState {
  constructor() {
    this.budgets = {};          // change to { category: amount } for easier lookups
    this.transactions = [];
  }

  addBudget(category, amount) {
    this.budgets[category] = amount;  // overwrite if exists
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  getCategoryTotal(category) {
    return this.transactions
      .filter(tx => tx.type === 'expense' && tx.category === category)
      .reduce((sum, tx) => sum + tx.amount, 0);
  }

  isOverBudget(category) {
    const budget = this.budgets[category] || 0;
    const spent = this.getCategoryTotal(category);
    return spent > budget;
  }

  async save() {
    localStorage.setItem('dashboard', JSON.stringify({
      budgets: this.budgets,
      transactions: this.transactions
    }));
    // optional: save to JSONBin here if needed
  }

  async load() {
    const data = JSON.parse(localStorage.getItem('dashboard'));
    if (data) {
      this.budgets = data.budgets || {};
      this.transactions = data.transactions || [];
    }
  }

  reset() {
    this.budgets = {};
    this.transactions = [];
  }
}
