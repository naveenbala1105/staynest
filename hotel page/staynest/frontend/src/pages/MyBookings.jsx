import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBookings, cancelBooking } from '../slices/bookingsSlice';

export default function MyBookings() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { items, loading } = useSelector((s) => s.bookings);

  useEffect(() => { dispatch(fetchBookings()); }, [dispatch]);

  const cancel = (b) => {
    if (window.confirm('Cancel this booking?')) dispatch(cancelBooking(b.id));
  };

  return (
    <div className="narrow wide">
      <button className="btn" onClick={() => nav('/')}>← Back to Hotels</button>
      <h2 className="title mt">My Bookings</h2>
      <p className="muted">Manage your hotel reservations.</p>
      {loading && <p className="muted">Loading...</p>}
      {!loading && !items.length && <p className="muted">No bookings yet.</p>}

      {items.map((b) => (
        <div className="card booking" key={b.id}>
          <div className="row-between">
            <h3>{b.hotel_name}</h3>
            <span className={'badge ' + b.status.toLowerCase()}>{b.status}</span>
          </div>
          <hr />
          {[
            ['Booking ID', b.ref], ['Customer', b.customer_name], ['Email', b.email], ['Phone', b.phone],
            ['Check-in', b.check_in], ['Check-out', b.check_out], ['Guests', b.guests], ['Rooms', b.rooms], ['Nights', b.nights],
          ].map(([k, v]) => <p key={k}><b>{k}:</b> {v}</p>)}
          <div className="price big">Total: ₹{b.total}</div>
          {b.status === 'Confirmed' && <button className="btn danger-outline" onClick={() => cancel(b)}>Cancel Booking</button>}
        </div>
      ))}
    </div>
  );
}
