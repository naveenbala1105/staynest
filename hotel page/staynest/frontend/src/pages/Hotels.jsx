import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchHotels, fetchLocations, setFilter, clearFilters } from '../slices/hotelsSlice';
import HotelCard from '../components/HotelCard';

export default function Hotels() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { items, locations, filters, loading, error } = useSelector((s) => s.hotels);

  useEffect(() => { dispatch(fetchLocations()); }, [dispatch]);
  useEffect(() => {
    const t = setTimeout(() => dispatch(fetchHotels(filters)), 300); // debounce typing
    return () => clearTimeout(t);
  }, [filters, dispatch]);

  const set = (k) => (e) => dispatch(setFilter({ [k]: e.target.value }));

  return (
    <div className="two-col">
      <aside className="card filters">
        <h2>Hotel Finder</h2>
        <p className="muted">Find your perfect stay</p>
        <button className="btn full" onClick={() => nav('/add-hotel')}>+ Add Hotel</button>

        <label>Search Hotel</label>
        <input placeholder="Hotel name or address" value={filters.search} onChange={set('search')} />

        <label>Price Range</label>
        <input type="number" min="0" placeholder="Minimum price" value={filters.min} onChange={set('min')} />
        <input type="number" min="0" placeholder="Maximum price" value={filters.max} onChange={set('max')} />

        <label>Location</label>
        <select value={filters.location} onChange={set('location')}>
          <option value="">All Locations</option>
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>

        <label>Sort By</label>
        <select value={filters.sort} onChange={set('sort')}>
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name (A-Z)</option>
        </select>

        <button className="btn outline full" onClick={() => dispatch(clearFilters())}>Clear All Filters</button>
      </aside>

      <section>
        <div className="page-head">
          <div>
            <h2 className="title">Explore Hotels</h2>
            <p className="muted">Discover comfortable stays for your next trip.</p>
          </div>
          <div className="head-right">
            <span className="muted">{items.length} Hotels Found</span>
            <button className="btn accent" onClick={() => nav('/my-bookings')}>My Bookings</button>
          </div>
        </div>
        {error && <div className="alert">{error}</div>}
        {loading && !items.length && <p className="muted">Loading hotels...</p>}
        {!loading && !error && !items.length && <p className="muted">No hotels match your filters.</p>}
        <div className="grid">{items.map((h) => <HotelCard key={h.id} hotel={h} />)}</div>
      </section>
    </div>
  );
}
