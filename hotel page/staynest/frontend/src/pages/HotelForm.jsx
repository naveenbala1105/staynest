import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { api, imgUrl, errMsg } from '../api';
import { saveHotel } from '../slices/hotelsSlice';

export default function HotelForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [f, setF] = useState({ name: '', description: '', location: '', price: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/hotels/${id}`)
      .then(({ data }) => {
        setF({ name: data.name, description: data.description || '', location: data.location, price: data.price });
        setPreview(imgUrl(data.image));
      })
      .catch((e) => setError(errMsg(e, 'Could not load hotel')));
  }, [id]);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const pick = (e) => {
    const x = e.target.files[0];
    if (!x) return;
    if (!x.type.startsWith('image/')) return setError('Please choose an image file');
    if (x.size > 1024 * 1024) return setError('Image must be 1MB or smaller');
    setError('');
    setFile(x);
    setPreview(URL.createObjectURL(x));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.location.trim()) return setError('Name and location are required');
    if (!(Number(f.price) > 0)) return setError('Enter a valid price');
    if (!id && !file) return setError('Please upload a hotel image');

    const form = new FormData();
    Object.entries(f).forEach(([k, v]) => form.append(k, v));
    if (file) form.append('image', file);

    setBusy(true);
    const res = await dispatch(saveHotel({ id, form }));
    setBusy(false);
    if (saveHotel.fulfilled.match(res)) nav('/');
    else setError(res.payload || 'Could not save hotel');
  };

  return (
    <form className="card form narrow" onSubmit={submit}>
      <h2 className="title">{id ? 'Edit Hotel' : 'Add New Hotel'}</h2>
      {error && <div className="alert">{error}</div>}

      <label>Hotel Name</label>
      <input value={f.name} onChange={set('name')} placeholder="e.g. Lotus Grand" />
      <label>Description</label>
      <textarea rows="3" value={f.description} onChange={set('description')} placeholder="Short description" />
      <label>Location</label>
      <input value={f.location} onChange={set('location')} placeholder="e.g. Thanjavur" />
      <label>Price Per Night (₹)</label>
      <input type="number" min="1" value={f.price} onChange={set('price')} />
      <label>Hotel Image</label>
      <input type="file" accept="image/*" onChange={pick} />
      <small className="muted">Upload JPG, PNG or another image format. Maximum size: 1MB.</small>
      {preview && <div className="preview"><img src={preview} alt="preview" /></div>}

      <button className="btn full" disabled={busy}>{busy ? 'Saving...' : id ? 'Update Hotel' : 'Add Hotel'}</button>
      <button type="button" className="btn outline full" onClick={() => nav('/')}>Cancel</button>
    </form>
  );
}
