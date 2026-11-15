import { configureStore } from '@reduxjs/toolkit';
import hotels from './slices/hotelsSlice';
import bookings from './slices/bookingsSlice';
export const store = configureStore({ reducer: { hotels, bookings } });
