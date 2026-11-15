// Creates tables, then adds 9 demo hotels with generated local images.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploads = path.join(__dirname, 'uploads');
fs.mkdirSync(uploads, { recursive: true });

const art = (name, c1, c2) => {
  let win = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++)
    win += `<rect x="${225 + c * 52}" y="${210 + r * 55}" width="30" height="34" rx="3" fill="#ffd98e"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="800" height="500" fill="url(#g)"/><circle cx="650" cy="110" r="46" fill="#fff" opacity=".85"/>
<rect x="200" y="190" width="400" height="190" rx="8" fill="#0b2e2c" opacity=".85"/>${win}
<rect y="380" width="800" height="120" fill="#0e6f73" opacity=".9"/>
<text x="400" y="445" font-family="Arial" font-size="34" font-weight="700" fill="#fff" text-anchor="middle">${name}</text></svg>`;
};

const hotels = [
  ['Lotus Grand', 'A centrally located stay near Trichy Central Bus Stand.', 'Trichy', 3200, '#1b4965', '#bee9e8'],
  ['Cauvery Residency', 'Riverside hotel suited for business and family stays.', 'Trichy', 2900, '#5f0f40', '#fb8b24'],
  ['Thanjai Palace Inn', 'Comfortable rooms close to the Big Temple.', 'Thanjavur', 2300, '#264653', '#e9c46a'],
  ['Sea Breeze Suites', 'Seaside suites with a calm, relaxing atmosphere.', 'Chennai', 4200, '#023e8a', '#caf0f8'],
  ['Marina Heights', 'Modern high-rise hotel near Marina Beach.', 'Chennai', 5200, '#3a0ca3', '#f72585'],
  ['Temple View Stay', 'Budget-friendly rooms in the temple town.', 'Kumbakonam', 1900, '#386641', '#f2e8cf'],
  ['Green Orchid Resort', 'Garden resort with a pool and open lawns.', 'Madurai', 3800, '#2d6a4f', '#d8f3dc'],
  ['Royal Meenakshi', 'Heritage-style hotel near Meenakshi Temple.', 'Madurai', 3500, '#9d0208', '#ffba08'],
  ['Sunrise Deepam', 'Clean, simple rooms for short city stays.', 'Thanjavur', 1800, '#ff6d00', '#ffecd1'],
];

const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
await pool.query(sql);

const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM hotels');
if (rows[0].n === 0) {
  for (const [i, [name, desc, loc, price, c1, c2]] of hotels.entries()) {
    const file = `seed-${i + 1}.svg`;
    fs.writeFileSync(path.join(uploads, file), art(name, c1, c2));
    await pool.query(
      'INSERT INTO hotels (name, description, location, price, image) VALUES ($1,$2,$3,$4,$5)',
      [name, desc, loc, price, file]
    );
  }
  console.log('Seeded 9 hotels.');
} else {
  console.log('Hotels already exist, skipping seed.');
}
await pool.end();
