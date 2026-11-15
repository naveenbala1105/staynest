import { Router } from 'express';
import { pool } from '../db.js';
import { wrap, bad } from '../utils.js';

const router = Router();

const COLS = `b.id, b.ref, b.hotel_id, h.name AS hotel_name, b.customer_name, b.email, b.phone,
  to_char(b.check_in,'YYYY-MM-DD') AS check_in, to_char(b.check_out,'YYYY-MM-DD') AS check_out,
  b.guests, b.rooms, b.nights, b.total, b.status`;

router.get('/', wrap(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${COLS} FROM bookings b JOIN hotels h ON h.id = b.hotel_id ORDER BY b.id DESC`
  );
  res.json(rows);
}));

router.post('/', wrap(async (req, res) => {
  const b = req.body;
  const guests = Number(b.guests), rooms = Number(b.rooms);
  if (!(b.customer_name || '').trim()) throw bad('Full name is required');
  if (!/^\S+@\S+\.\S+$/.test(b.email || '')) throw bad('Enter a valid email');
  if (!/^\d{10}$/.test(b.phone || '')) throw bad('Phone number must be 10 digits');
  if (!(guests >= 1) || !(rooms >= 1)) throw bad('Guests and rooms must be at least 1');

  const nights = Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000);
  if (isNaN(nights) || nights < 1) throw bad('Check-out must be after check-in');

  const hotel = (await pool.query('SELECT price FROM hotels WHERE id = $1', [b.hotel_id])).rows[0];
  if (!hotel) throw bad('Hotel not found', 404);

  const total = hotel.price * nights * rooms;
  const ref = 'BK' + Date.now();
  const { rows } = await pool.query(
    `INSERT INTO bookings (ref, hotel_id, customer_name, email, phone, check_in, check_out, guests, rooms, nights, total)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [ref, b.hotel_id, b.customer_name.trim(), b.email, b.phone, b.check_in, b.check_out, guests, rooms, nights, total]
  );
  const full = await pool.query(`SELECT ${COLS} FROM bookings b JOIN hotels h ON h.id=b.hotel_id WHERE b.id=$1`, [rows[0].id]);
  res.status(201).json(full.rows[0]);
}));

router.patch('/:id/cancel', wrap(async (req, res) => {
  const { rowCount } = await pool.query("UPDATE bookings SET status='Cancelled' WHERE id=$1", [req.params.id]);
  if (!rowCount) throw bad('Booking not found', 404);
  res.json({ message: 'Booking cancelled' });
}));

export default router;
