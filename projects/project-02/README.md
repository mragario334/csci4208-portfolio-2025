# Personal Finance Dashboard

A web-based personal finance tracker to manage account balances, budgets, and transactions. Built with a modular JavaScript front-end, local-first storage, and JSONBin for cloud persistence.  

---

## Table of Contents

- [Personal Finance Dashboard](#personal-finance-dashboard)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Demo](#demo)
  - [Installation \& Run](#installation--run)
  - [Architecture](#architecture)
  - [State \& Storage](#state--storage)
  - [Networking](#networking)

---

## Features

- **Initial Account Setup:** Enter checking and savings balances at first launch.  
- **Transactions:** Add income and expenses with category, date, and notes.  
- **Filtering:** Filter transactions by account or category.  
- **Balances Overview:** Real-time display of balances, income, expenses, and net total.  
- **Local-First Persistence:** Data saved in `localStorage` with automatic merge from JSONBin.  
- **Reset Functionality:** Clear all data and start fresh.  
- **Responsive Layout:** Works on desktop and smaller screens.  

---

## Demo

![Dashboard Demo](docs/media/dashboard-demo.gif)  

*(Replace with your actual GIF/video link.)*

---

## Installation & Run

1. **Install `http-server`:**

```
npm install -g http-server
```
2. **Clone the repo:**

```
git clone https://github.com/mragario334/project-02.git
cd personal-finance-dashboard
```
3. **Run the local server:**

```
http-server .
```

4. **Open in your browser:**
The server will print something like this:
```
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8080
  http://192.168.1.10:8080
```
Open the first url in your browser.

## Architecture
```
InitialBalancesView → AppState → DashboardView
                 ↑                 |
                 |                 ↓
          JSONBin / localStorage → persist & restore

```
* **AppState:** Tracks balances, transactions, and account name.

* **DashboardView:** Renders balances, transactions, and controls; handles filtering and form input.

* **InitialBalancesView:** Collects starting balances.

* **JSONBinService:** Handles PUT/GET to JSONBin.

* **LocalStorage:** Provides offline support and background refresh merge.

## State & Storage

* **State Objects:**

    * `AppState` — main app balances and transactions.

    * `DashboardState` — used for budgets and extra transactions (optional module).

* **Persistence:**

    * Saved locally in `localStorage` under `appData`.

    * Periodic background refresh fetches latest JSONBin data and merges.

    * Last-saved timestamp ensures deterministic merge behavior.

## Networking
* **JSONBin.io**
    * GET /latest — load latest remote state.

    * PUT — persist current state (balances, transactions, name).

* **Public API Example:** `publicApi.js` fetches exchange rates with TTL and local cache.

