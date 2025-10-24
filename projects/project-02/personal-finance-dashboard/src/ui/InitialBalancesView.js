export default class InitialBalancesView {
    constructor(state, root, onSubmit) {
      this.state = state;
      this.root = root;
      this.onSubmit = onSubmit;
    }
  
    render() {
      this.root.innerHTML = `
        <h2>Enter Your Account Balances</h2>
        <div id="account-form">
          <label>Name:</label>
          <input type="text" id="account-name" placeholder="Account Name">
          <label>Checking:</label>
          <input type="number" id="balance-checking" placeholder="Amount">
          <label>Savings:</label>
          <input type="number" id="balance-savings" placeholder="Amount">
          <button id="submit-balances">Save Balances</button>
        </div>
      `;
  
      this.root.querySelector('#submit-balances').onclick = async () => {
        const checkingAmount = parseFloat(this.root.querySelector('#balance-checking').value) || 0;
        const savingsAmount = parseFloat(this.root.querySelector('#balance-savings').value) || 0;
        const accountName = this.root.querySelector('#account-name').value.trim() || 'Primary Account';
  
        this.state.name = accountName;
        this.state.balances = {
          Checking: checkingAmount,
          Savings: savingsAmount
        };
  
        await this.onSubmit();
      };
    }
  }
  