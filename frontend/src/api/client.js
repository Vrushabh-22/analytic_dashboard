import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const makeGetRequest = async (endpoint, config = {}, params = {}) => {
  const { data } = await apiClient.get(endpoint, {
    ...config,
    params,
  });
  return data;
};

export const makePostRequest = async (endpoint, body, config = {}) => {
  const { data } = await apiClient.post(endpoint, body, config);
  return data;
};

export const makePutRequest = async (endpoint, body, config = {}) => {
  const { data } = await apiClient.put(endpoint, body, config);
  return data;
};

export const makeDeleteRequest = async (endpoint, config = {}) => {
  const { data } = await apiClient.delete(endpoint, config);
  return data;
};
