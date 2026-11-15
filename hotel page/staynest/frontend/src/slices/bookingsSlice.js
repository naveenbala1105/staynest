import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, errMsg } from '../api';

export const fetchBookings = createAsyncThunk('bookings/fetch', async () => (await api.get('/bookings')).data);

export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try { return (await api.post('/bookings', data)).data; }
  catch (e) { return rejectWithValue(errMsg(e, 'Could not create booking')); }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async (id) => {
  await api.patch(`/bookings/${id}/cancel`);
  return id;
});

const slice = createSlice({
  name: 'bookings',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchBookings.pending, (s) => { s.loading = true; })
      .addCase(fetchBookings.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchBookings.rejected, (s) => { s.loading = false; })
      .addCase(cancelBooking.fulfilled, (s, a) => {
        const x = s.items.find((i) => i.id === a.payload);
        if (x) x.status = 'Cancelled';
      });
  },
});
export default slice.reducer;
