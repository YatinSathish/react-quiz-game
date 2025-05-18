// src/api/apiCalls.js
import api from '../utils/api';

export const loginUser = (email, password) => {
  return api.post('admin/auth/login', { email, password });
};

export const registerUser = (name, email, password) => {
  return api.post('admin/auth/register', { name, email, password });
};
