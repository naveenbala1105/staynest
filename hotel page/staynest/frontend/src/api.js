import axios from 'axios';
export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const api = axios.create({ baseURL: `${API}/api` });
export const imgUrl = (file) => (file ? `${API}/uploads/${file}` : '');
export const errMsg = (e, fallback) => e.response?.data?.message || fallback;
