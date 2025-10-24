# Architecture Sketch — Personal Finance Dashboard

## Overview
A single-page **Personal Finance Dashboard** built with **Vanilla JS (ES modules)**.  
It follows an **MVC-style structure** (Model → Controller → View) with **local-first data**, **cloud sync (JSONBin)**, and **Chart.js** visualizations.

---

## Structure

index.html

└─ src/

├─ state/ # AppState (global store)

├─ models/ # Transaction model

├─ controllers/ # Budget logic

├─ services/ # LocalStore, PublicAPI, CloudAPI

├─ ui/ # Components + Views

├─ routes/ # Router (hash-based)

├─ engine/ # ChartRenderer (Chart.js)

└─ utils/ # Helpers


---

## Key Classes
| Class | Role |
|-------|------|
| `AppState` | Central store for all data; handles load/save/merge |
| `Transaction` | Represents one income or expense |
| `Budget` | Controller logic for totals and filtering |

---

## Data Flow
User input → Budget controller → AppState update
→ Save to LocalStorage → View re-render (Chart.js)
→ Optional Cloud sync via JSONBin


---

## APIs
| Type | Example | Purpose |
|------|----------|----------|
| Public GET | `https://api.exchangerate.host/latest` | Currency rates |
| Cloud PUT | JSONBin endpoint | Save budget summary |

---

## Local-First Boot
1. Load from `localStorage`
2. Render immediately
3. Fetch + merge network data
4. Save + re-render

---

## Routing
Two main routes:
- `#/dashboard` – transactions & chart  
- `#/reports` – summary and trends  

---

## Merge Policy
Simple **last-write-wins** using `updated_ts` timestamps.

---

## Responsive
- ≥1280px: Full dashboard  
- ≥768px: Tablet layout  
- <768px: Show “Not supported” message 