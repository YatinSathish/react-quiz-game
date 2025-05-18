import api from '../utils/api';

export const createGame = (game) => api.put('admin/games', game);
export const updateGame = (id, game) => api.put(`admin/games/${id}`, game);

export const uniqueId = () => {
  return Date.now() + Math.floor(Math.random() * 10000);
};