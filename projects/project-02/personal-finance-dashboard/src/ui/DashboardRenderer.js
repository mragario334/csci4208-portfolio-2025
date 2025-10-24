// src/ui/DashboardRenderer.js
export default class DashboardRenderer {
    constructor(state, rootElement) {
      this.state = state;       // instance of DashboardState
      this.root = rootElement;  // container div
    }
  
    render() {
      this.root.innerHTML = '';
  
      // Title
      const title = document.createElement('h1');
      title.textContent = 'Personal Finance Dashboard';
      this.root.appendChild(title);
  
      // Budgets Section
      const budgetSection = document.createElement('section');
      const budgetTitle = document.createElement('h2');
      budgetTitle.textContent = 'Budgets';
      budgetSection.appendChild(budgetTitle);
  
      if (this.state.budgets.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No budgets yet.';
        budgetSection.appendChild(empty);
      } else {
        const list = document.createElement('ul');
        this.state.budgets.forEach(b => {
          const item = document.createElement('li');
          item.textContent = `${b.category}: $${b.limit}`;
          list.appendChild(item);
        });
        budgetSection.appendChild(list);
      }
  
      this.root.appendChild(budgetSection);
  
      // Transactions Section
      const transactionSection = document.createElement('section');
      const transactionTitle = document.createElement('h2');
      transactionTitle.textContent = 'Transactions';
      transactionSection.appendChild(transactionTitle);
  
      if (this.state.transactions.length === 0) {
        const empty = document.createElement('p');
        empty.textContent = 'No transactions yet.';
        transactionSection.appendChild(empty);
      } else {
        const list = document.createElement('ul');
        this.state.transactions.forEach(t => {
          const item = document.createElement('li');
          item.textContent = `${t.date} | ${t.category} | $${t.amount} | ${t.description}`;
          list.appendChild(item);
        });
        transactionSection.appendChild(list);
      }
  
      this.root.appendChild(transactionSection);
    }
  }
  