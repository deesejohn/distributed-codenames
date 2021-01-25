import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api/games/' });

export default {
  get(game_id) {
    return apiClient.get(game_id).catch((error) => {
      console.warn(error);
      throw error;
    });
  },
  post(game_id, data) {
    return apiClient.post(`${game_id}/guess`, data).catch((error) => {
      console.warn(error);
      throw error;
    });
  },
};
