import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from '../db.js';
import { wrap, bad } from '../utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: 1024 * 1024 }, // 1 MB
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only image files are allowed')),
});

const removeFile = (f) => f && fs.unlink(path.join(uploadDir, f), () => {});

function clean(b) {
  const name = (b.name || '').trim();
  const location = (b.location || '').trim();
  const description = (b.description || '').trim();
  const price = Number(b.price);
  if (!name || !location) throw bad('Name and location are required');
  if (!Number.isInteger(price) || price <= 0) throw bad('Price must be a whole number greater than 0');
  return { name, location, description, price };
}

const router = Router();

// GET /api/hotels?search=&min=&max=&location=&sort=price_asc|price_desc|name
router.get('/', wrap(async (req, res) => {
  const { search, min, max, location, sort } = req.query;
  const where = [], vals = [];
  if (search) {
    vals.push(`%${search}%`);
    where.push(`(name ILIKE $${vals.length} OR description ILIKE $${vals.length} OR location ILIKE $${vals.length})`);
  }
  if (min && !isNaN(min)) { vals.push(Number(min)); where.push(`price >= $${vals.length}`); }
  if (max && !isNaN(max)) { vals.push(Number(max)); where.push(`price <= $${vals.length}`); }
  if (location) { vals.push(location); where.push(`location = $${vals.length}`); }
  const order = { price_asc: 'price ASC', price_desc: 'price DESC', name: 'name ASC' }[sort] || 'id ASC';
  const sql = `SELECT * FROM hotels ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY ${order}`;
  res.json((await pool.query(sql, vals)).rows);
}));

router.get('/locations', wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT DISTINCT location FROM hotels ORDER BY location');
  res.json(rows.map((r) => r.location));
}));

router.get('/:id', wrap(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
  if (!rows[0]) throw bad('Hotel not found', 404);
  res.json(rows[0]);
}));

router.post('/', upload.single('image'), wrap(async (req, res) => {
  try {
    const h = clean(req.body);
    if (!req.file) throw bad('Hotel image is required');
    const { rows } = await pool.query(
      'INSERT INTO hotels (name, description, location, price, image) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [h.name, h.description, h.location, h.price, req.file.filename]
    );
    res.status(201).json(rows[0]);
  } catch (e) { removeFile(req.file?.filename); throw e; }
}));

router.put('/:id', upload.single('image'), wrap(async (req, res) => {
  try {
    const old = (await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id])).rows[0];
    if (!old) throw bad('Hotel not found', 404);
    const h = clean(req.body);
    const image = req.file ? req.file.filename : old.image;
    const { rows } = await pool.query(
      'UPDATE hotels SET name=$1, description=$2, location=$3, price=$4, image=$5 WHERE id=$6 RETURNING *',
      [h.name, h.description, h.location, h.price, image, req.params.id]
    );
    if (req.file) removeFile(old.image);
    res.json(rows[0]);
  } catch (e) { removeFile(req.file?.filename); throw e; }
}));

router.delete('/:id', wrap(async (req, res) => {
  const { rows } = await pool.query('DELETE FROM hotels WHERE id = $1 RETURNING image', [req.params.id]);
  if (!rows[0]) throw bad('Hotel not found', 404);
  removeFile(rows[0].image);
  res.json({ message: 'Hotel deleted' });
}));

export default router;
