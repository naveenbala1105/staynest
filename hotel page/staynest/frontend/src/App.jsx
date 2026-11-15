import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hotels from './pages/Hotels';
import HotelForm from './pages/HotelForm';
import Book from './pages/Book';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import About from './pages/About';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Hotels />} />
        <Route path="/add-hotel" element={<HotelForm />} />
        <Route path="/edit-hotel/:id" element={<HotelForm />} />
        <Route path="/book/:id" element={<Book />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
