# JSONBin Plan (Cloud Write)

**Purpose:** Save user-defined presets, budgets, and transaction records to the cloud.

**Service:** [JSONBin.io](https://jsonbin.io/)  
- Non-sensitive artifact storage (budget settings, dashboards)  
- REST API supports `GET` / `PUT` / `POST` JSON objects  

**Endpoints planned:**
- `GET /b/<BIN_ID>/latest` → fetch latest user data
- `PUT /b/<BIN_ID>` → update user data
- Optional: `POST /b` → create new bin for export/import  

**Network handling:**
- Merge policy: last-write-wins using `updated_ts`  
- Local-first: load from `localStorage` first, then merge with JSONBin
