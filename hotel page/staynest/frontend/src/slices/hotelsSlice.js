import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, errMsg } from '../api';

const emptyFilters = { search: '', min: '', max: '', location: '', sort: '' };

export const fetchHotels = createAsyncThunk('hotels/fetch', async (filters) =>
  (await api.get('/hotels', { params: filters })).data);

export const fetchLocations = createAsyncThunk('hotels/locations', async () =>
  (await api.get('/hotels/locations')).data);

export const saveHotel = createAsyncThunk('hotels/save', async ({ id, form }, { rejectWithValue }) => {
  try {
    return (await (id ? api.put(`/hotels/${id}`, form) : api.post('/hotels', form))).data;
  } catch (e) {
    return rejectWithValue(errMsg(e, 'Could not save hotel'));
  }
});

export const deleteHotel = createAsyncThunk('hotels/delete', async (id) => {
  await api.delete(`/hotels/${id}`);
  return id;
});

const slice = createSlice({
  name: 'hotels',
  initialState: { items: [], locations: [], filters: emptyFilters, loading: false, error: null },
  reducers: {
    setFilter: (s, a) => { s.filters = { ...s.filters, ...a.payload }; },
    clearFilters: (s) => { s.filters = emptyFilters; },
  },
  extraReducers: (b) => {
    b.addCase(fetchHotels.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchHotels.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchHotels.rejected, (s) => { s.loading = false; s.error = 'Could not load hotels. Is the backend running?'; })
      .addCase(fetchLocations.fulfilled, (s, a) => { s.locations = a.payload; })
      .addCase(deleteHotel.fulfilled, (s, a) => { s.items = s.items.filter((h) => h.id !== a.payload); });
  },
});

export const { setFilter, clearFilters } = slice.actions;
export default slice.reducer;
