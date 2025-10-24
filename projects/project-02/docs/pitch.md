# Pitch — Personal Finance Dashboard

## Project Name
**Personal Finance Dashboard**

---

## Summary
A single-page browser app that helps users **track income and expenses**, **visualize spending**, and **synchronize summaries to the cloud**.  
The app loads instantly from local storage, fetches **live exchange rates**, and gives users a clear snapshot of their personal budget health.

---

## Target User
Individuals, students, or freelancers who want a simple but smart budgeting tool that runs anywhere in the browser — no signup, no ads, no backend setup.

---

## Core Features

| Category | Feature | Description |
|-----------|----------|-------------|
| **Finance Tracking** | Add/Edit/Delete transactions | Record income or expenses with category, amount, and date |
| **Visualization** | Dynamic charts | Bar & pie charts showing spending by category and trend over time |
| **Public GET API** | Exchange rates | Pulls latest rates from `https://api.exchangerate.host/latest?base=USD` for multi-currency display |
| **Cloud Sync (POST/PUT)** | Save summaries | Syncs total income/expense to JSONBin for remote backup |
| **Local-First Storage** | Offline mode | Auto-saves to `localStorage`; boots from cached data |
| **Routing** | Multi-view SPA | Dashboard / Reports / Settings views managed via hash router |
| **Responsive Design** | Adaptive layout | Works on tablet and laptop sizes with a fallback message for narrow screens |

---

## Technical Overview

- **Stack:** Vanilla JS ES modules + Chart.js + simple hash router  
- **Modules:** ≥ 6 (state, services, ui, routes, viz, utils)  
- **Classes:**  
  - `Transaction` (model)  
  - `Budget` (controller/system)  
  - `AppState` (global store)  
- **Rendering:** DOM components + Chart.js visual layer  
- **Networking:**  
  - GET `https://api.exchangerate.host/latest?base=USD` (1 h TTL cache)  
  - PUT to JSONBin for summary sync  
- **Local-First:** Load from localStorage → merge with cloud → display  

---

## Roadmap Preview

| Sprint | Focus | Deliverables |
|---------|--------|--------------|
| **1 – Plan (Days 1–2)** | Planning & docs | Pitch, architecture sketch, endpoints plan, roadmap |
| **2 – MVP (Days 3–10)** | Core flow | Add → state → render → GET → PUT/POST; responsive layout; console clean |
| **3 – Full + Polish (Days 11–21)** | Complete features & deploy | Multiple views, full responsive UI, final README + GitHub Pages deploy |

---

## Definition of Done (Sprint 1)

- `/docs/pitch.md` (this file)  
- `/docs/architecture_sketch.md` with module diagram  
- `/docs/endpoints.md` with API details  
- `/docs/roadmap.md` with 3-sprint tasks  
- GitHub project board (8–12 issues for Sprint 2) linked in README
