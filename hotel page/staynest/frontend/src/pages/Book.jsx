import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api, imgUrl, errMsg } from '../api';
import { createBooking } from '../slices/bookingsSlice';

const today = new Date().toISOString().slice(0, 10);

export default function Book() {
  const { id } = useParams();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState('');
  const [f, setF] = useState({ customer_name: '', email: '', phone: '', check_in: '', check_out: '', guests: 1, rooms: 1 });

  useEffect(() => {
    api.get(`/hotels/${id}`).then(({ data }) => setHotel(data)).catch((e) => setError(errMsg(e, 'Hotel not found')));
  }, [id]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const nights = f.check_in && f.check_out ? Math.round((new Date(f.check_out) - new Date(f.check_in)) / 86400000) : 0;
  const total = hotel && nights > 0 ? hotel.price * nights * Number(f.rooms || 0) : 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!f.customer_name.trim()) return setError('Full name is required');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError('Enter a valid email');
    if (!/^\d{10}$/.test(f.phone)) return setError('Phone number must be 10 digits');
    if (nights < 1) return setError('Check-out must be after check-in');
    if (f.guests < 1 || f.rooms < 1) return setError('Guests and rooms must be at least 1');
    const res = await dispatch(createBooking({ ...f, hotel_id: id }));
    if (createBooking.fulfilled.match(res)) nav('/my-bookings');
    else setError(res.payload || 'Could not create booking');
  };

  if (!hotel) return <p className="muted">{error || 'Loading...'}</p>;

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2 className="title">Book {hotel.name}</h2>
      <div className="mini">
        <img src={imgUrl(hotel.image)} alt={hotel.name} />
        <div><b>{hotel.name}</b><p className="muted">📍 {hotel.location}</p><div className="price">₹{hotel.price} <small>/ night</small></div></div>
      </div>
      {error && <div className="alert">{error}</div>}

      <h3>Guest Details</h3>
      <label>Full Name</label>
      <input value={f.customer_name} onChange={set('customer_name')} />
      <label>Email</label>
      <input type="email" value={f.email} onChange={set('email')} />
      <label>Phone Number</label>
      <input inputMode="numeric" maxLength="10" value={f.phone} onChange={set('phone')} />

      <h3>Stay Details</h3>
      <label>Check-in Date</label>
      <input type="date" min={today} value={f.check_in} onChange={set('check_in')} />
      <label>Check-out Date</label>
      <input type="date" min={f.check_in || today} value={f.check_out} onChange={set('check_out')} />
      <label>Number of Guests</label>
      <input type="number" min="1" value={f.guests} onChange={set('guests')} />
      <label>Number of Rooms</label>
      <input type="number" min="1" value={f.rooms} onChange={set('rooms')} />

      <div className="summary">
        <p>Number of Nights: {Math.max(nights, 0)}</p>
        <p>Rooms: {f.rooms}</p>
        <div className="price big">Total Amount: ₹{total}</div>
        <small className="muted">Demo booking. No payment is collected.</small>
      </div>
      <button className="btn full">Confirm Booking</button>
    </form>
  );
}
