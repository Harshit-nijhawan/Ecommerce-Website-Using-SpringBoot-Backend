import axios from "axios";

// Use the environment variable if it exists, otherwise use the localhost URL
const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/api';

const API = axios.create({
  baseURL: baseURL,
});

delete API.defaults.headers.common["Authorization"];
export default API;