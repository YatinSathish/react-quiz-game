import api from '../utils/api';

export const fetchGames = () => api.get('admin/games');

export const createGame = (game) => api.put('admin/games', { game });
export const editGame = (game) => api.put('admin/games', { game });
export const deleteGame = (game) => api.put('admin/games', { games: game });
export const startGame = (gameid,mutationType="START") => api.post(`admin/game/${gameid}/mutate`, { mutationType });
export const stopGame = (gameid,mutationType="END") => api.post(`admin/game/${gameid}/mutate`, { mutationType });
export const advanceGame = (gameid,mutationType="ADVANCE") => api.post(`admin/game/${gameid}/mutate`, { mutationType });