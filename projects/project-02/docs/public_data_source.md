# Public Data Source

**Purpose:** Provide real-time or up-to-date financial data for personal finance dashboard.

**Chosen API:** [Open Exchange Rates](https://openexchangerates.org/)  
- Provides currency exchange rates, market data, and historical values  
- Free tier sufficient for MVP (latest rates via GET request)  

**Endpoints planned for MVP:**
- `GET /latest.json?app_id=<API_KEY>` → fetch current exchange rates
- Optional: `GET /currencies.json` → fetch currency codes and names

**Network handling:**
- Async/await fetch with try/catch
- Loading, empty, and error UI states
- TTL cache: 30 minutes in `localStorage` before re-fetch
