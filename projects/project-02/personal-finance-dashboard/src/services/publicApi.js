const API_URL = 'https://openexchangerates.org/api/latest.json?app_id=YOUR_API_KEY';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function fetchExchangeRates() {
  const cached = JSON.parse(localStorage.getItem('exchangeRates'));
  const now = Date.now();
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    localStorage.setItem('exchangeRates', JSON.stringify({ data, timestamp: now }));
    return data;
  } catch (err) {
    console.error(err);
    return cached ? cached.data : {};
  }
}
