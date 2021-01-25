import axios from 'axios';

const apiClient = axios.create({ baseURL: '/api/games/' });

const get = (game_id) => {
  return apiClient.get(game_id).catch((error) => {
    console.warn(error);
    throw error;
  });
};

const post = (game_id, data) => {
  return apiClient.post(`${game_id}/guess`, data).catch((error) => {
    console.warn(error);
    throw error;
  });
};

const methods = {
  get,
  post,
};

export default methods;

// export default {
//   get(game_id) {
//     return apiClient.get(game_id).catch((error) => {
//       console.warn(error);
//       throw error;
//     });
//   },
//   post(game_id, data) {
//     return apiClient.post(`${game_id}/guess`, data).catch((error) => {
//       console.warn(error);
//       throw error;
//     });
//   },
// };
