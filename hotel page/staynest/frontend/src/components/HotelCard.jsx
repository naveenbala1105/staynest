import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteHotel } from '../slices/hotelsSlice';
import { imgUrl } from '../api';

export default function HotelCard({ hotel }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const remove = () => {
    setOpen(false);
    if (window.confirm(`Delete "${hotel.name}"? Its bookings will also be removed.`)) dispatch(deleteHotel(hotel.id));
  };

  return (
    <article className="card hotel">
      <div className="thumb">
        <img src={imgUrl(hotel.image)} alt={hotel.name} />
        <span className="tag">📍 {hotel.location}</span>
        <button className="dots" onClick={() => setOpen(!open)} aria-label="Options">⋮</button>
        {open && (
          <div className="menu">
            <button onClick={() => nav(`/edit-hotel/${hotel.id}`)}>✏️ Edit</button>
            <button className="danger" onClick={remove}>🗑️ Delete</button>
          </div>
        )}
      </div>
      <div className="info">
        <h3>{hotel.name}</h3>
        <p>{hotel.description}</p>
        <div className="price">₹{hotel.price} <small>/ night</small></div>
        <button className="btn full" onClick={() => nav(`/book/${hotel.id}`)}>Book Now</button>
      </div>
    </article>
  );
}
