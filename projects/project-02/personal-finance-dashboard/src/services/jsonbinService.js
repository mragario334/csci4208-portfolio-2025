const BIN_ID = '68e4412b43b1c97be95cdf2c';
const API_KEY = '$2a$10$tMlrOom72RjwPmzn4oZHl.5VDFNh0DmZtNliSFdFbHoNqjdS5NrGW';
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export async function saveToJsonBin(data) {
  const res = await fetch(BASE_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Failed to save JSONBin: ${res.status}`);
  }

  return res.json();
}

export async function loadFromJsonBin() {
  const res = await fetch(BASE_URL + '/latest', {
    headers: { 'X-Master-Key': API_KEY }
  });

  if (!res.ok) {
    throw new Error(`Failed to load JSONBin: ${res.status}`);
  }

  return res.json();
}
