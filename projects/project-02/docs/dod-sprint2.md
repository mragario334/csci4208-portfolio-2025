# Sprint 2 — Definition of Done (MVP Vertical Slice)

## A. Acceptance Checklist
- ✅ Boots from `index.html` / `http-server`; app loads Initial Balances or Dashboard based on saved data.
- ✅ Core flow: Input → AppState → render in DOM → JSONBin GET/PUT works.
- ✅ UI states for network: loading (`Loading your data...`), error (`⚠️ Could not load remote data`), empty transactions.
- ✅ Local-first behavior: localStorage restore, background refresh every 5 min, merge remote transactions without duplicates.
- ✅ ≥6 ES modules, ≥3 classes: `AppState`, `DashboardState`, `DashboardView`, `InitialBalancesView`, `DashboardForms`, `DashboardRenderer`.
- ✅ Evidence: Demo visible in browser, board filter, commits tagged (`v0.2-mvp`).

## B. Evidence
- Project board (filtered to **Sprint-2**): <https://github.com/users/mragario334/projects/5?pane=issue&itemId=131735416>
- Closed issues (label:`sprint-2`): <https://github.com/mragario334/csci4208-portfolio-2025/issues/12>
- Demo: Refer to docs/media/demo.mp4
- Run: `npx http-server` and open browser at `http://127.0.0.1:8080`

## C. Notes
- Added: filtering transactions by account & category.
- Deferred: budgets & enhanced analytics (planned for Sprint 3).
- Next sprint: full feature set, polish layout, responsive UI.
