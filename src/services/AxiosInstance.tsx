import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import MyStorage from '../utils/MyStorage';

const generateInstance = (baseURL: string, defaultHeaders?: AxiosRequestHeaders) => {
  const options: AxiosRequestConfig = {
    baseURL,
    timeout: 60000,
    withCredentials: true,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      ...(defaultHeaders || {}),
    },
  };

  const http = axios.create(options);

  // Add a request interceptor
  http.interceptors.request.use(
    (config) => config,
    (requestError) => {
      return Promise.reject(requestError);
    },
  );

  // Add a response interceptor
  http.interceptors.response.use(
    (response) => response,
    (error) => {
      return Promise.reject(error);
    },
  );
  return http;
};

export const defaultHeaders = (isFormData?: boolean): AxiosRequestHeaders => {
  const headers: AxiosRequestHeaders = {
    // 'x-refresh': MyStorage.getRefreshToken(),
    Authorization: `Bearer ${MyStorage.getAccessToken()}`,
  };
  if (isFormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  return headers;
};

const Client = {
  apiNextJS() {
    return generateInstance('http://localhost:3000/api');
  },
  apiBackend() {
    return generateInstance('http://localhost:3333/api/v1');
  },
};

export default Client;
