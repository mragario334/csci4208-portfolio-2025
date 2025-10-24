// src/ui/DashboardForms.js
export default class DashboardForms {
    constructor(state, renderer, rootElement) {
      this.state = state;         // instance of DashboardState
      this.renderer = renderer;   // instance of DashboardRenderer
      this.root = rootElement;    // container div
    }
  
    render() {
      // Clear previous forms
      const container = document.createElement('div');
      container.className = 'forms-container';
  
      // --- Budget Form ---
      const budgetForm = document.createElement('form');
      budgetForm.innerHTML = `
        <h3>Add Budget</h3>
        <input type="text" name="category" placeholder="Category" required />
        <input type="number" name="limit" placeholder="Limit" required />
        <button type="submit">Add Budget</button>
      `;
      budgetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = budgetForm.category.value.trim();
        const limit = parseFloat(budgetForm.limit.value);
        if (category && !isNaN(limit)) {
          this.state.addBudget({ category, limit });
          await this.state.save();     // persist to JSONBin / localStorage
          this.renderer.render();      // re-render dashboard
          budgetForm.reset();
        }
      });
      container.appendChild(budgetForm);
  
      // --- Transaction Form ---
      const transactionForm = document.createElement('form');
      transactionForm.innerHTML = `
        <h3>Add Transaction</h3>
        <input type="date" name="date" required />
        <input type="text" name="category" placeholder="Category" required />
        <input type="number" name="amount" placeholder="Amount" required />
        <input type="text" name="description" placeholder="Description" />
        <button type="submit">Add Transaction</button>
      `;
      transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const transaction = {
          date: transactionForm.date.value,
          category: transactionForm.category.value.trim(),
          amount: parseFloat(transactionForm.amount.value),
          description: transactionForm.description.value.trim()
        };
        if (transaction.category && !isNaN(transaction.amount) && transaction.date) {
          this.state.addTransaction(transaction);
          await this.state.save();      // persist to JSONBin / localStorage
          this.renderer.render();       // re-render dashboard
          transactionForm.reset();
        }
      });
      container.appendChild(transactionForm);
  
      this.root.appendChild(container);
    }
  }
  