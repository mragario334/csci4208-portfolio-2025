export default class AppState {
    constructor() {
      this.balances = {};
      this.transactions = [];
      this.name = '';
    }
  
    addTransaction(tx) {
      this.transactions.push(tx);
  
      if (this.balances[tx.account] === undefined) {
        this.balances[tx.account] = 0;
      }
  
      if (tx.type === 'income') {
        this.balances[tx.account] += tx.amount;
      } else if (tx.type === 'expense') {
        this.balances[tx.account] -= tx.amount;
      }
    }
  
    reset() {
      this.balances = {};
      this.transactions = [];
      this.name = '';
    }
  }
  