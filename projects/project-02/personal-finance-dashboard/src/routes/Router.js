// src/routes/Router.js
export default class Router {
    constructor(routes) {
      this.routes = routes;
      window.addEventListener('hashchange', () => this.render());
    }
  
    render() {
      const hash = location.hash.slice(1);
      const view = this.routes[hash] || this.routes['dashboard'];
      view.render();
    }
  }
  