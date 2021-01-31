import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api/games/' });

const get = (game_id) => apiClient.get(game_id);

const guess = (game_id, data) => apiClient.post(`${game_id}/guess`, data);

const methods = {
  get,
  guess,
};

export default methods;
