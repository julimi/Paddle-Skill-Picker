import axios from 'axios';
import { Message } from 'element-ui';

const API_PORT = '8000';

const paddleRequest = axios.create({
  baseURL: `${location.protocol}//${location.hostname}:${API_PORT}/api/`,
  timeout: 120000,
  withCredentials: true,
});

const refreshTokenInConfig = (config) => {
  // set token when the Authorization field in header is missing
  const token = localStorage.getItem('accessToken');
  if (token) {
    if (!config.headers.common) {
      config.headers.common = {};
    }
    config.headers.common.Authorization = `Bearer ${token}`;
  }
  // console.log('token: ', token);
  return config;
};

paddleRequest.interceptors.request.use(
  (config) => {
    if (!(config.headers.common && config.headers.common.Authorization)) {
      return refreshTokenInConfig(config);
    }
    return config;
  },
  error => Promise.reject(error),
);

paddleRequest.interceptors.response.use(
  response => response,
  (error) => {
    const originalRequest = error.config;
    // retry request when meeting server error
    if (error.status >= 500 && !originalRequest.did_retry) {
      refreshTokenInConfig(originalRequest);
      originalRequest.did_retry = true;
      return paddleRequest(originalRequest);
    }
    if (error.response) {
      // console.log(error.response.data)
      Message.error(`Error: ${Object.values(error.response.data)}`)
    }
    return Promise.reject(error.response);
  },
);

const payloadToRequest = ({ method, url, data }) => {
  if (['post', 'put', 'patch'].includes(method)) {
    return paddleRequest({ method, url, data });
  } else if (['get'].includes(method)) {
    return paddleRequest({ method, url, params: data });
  }
  Message.error(`Methods NOT ALLOWED: ${method}`);
  return 'error';
};

const once = ({
  url, data, method,
}) => new Promise((resolve, reject) => {
  payloadToRequest({
    url, data, method,
  }).then(
    response => resolve(response.data),
  ).catch(
    error => reject(error),
  );
});

export default {
  get(url, data) {
    return once({ url, data, method: 'get' })
  },
  post(url, data) {
    return once({ url, data, method: 'post' });
  },
  put(url, data) {
    return once({ url, data, method: 'put' });
  },
  patch(url, data) {
    return once({ url, data, method: 'patch' });
  },

  // batch requests for future features use
  all(requestsList) {
    const axiosRequests = [];
    requestsList.forEach(r => axiosRequests.push(payloadToRequest(r)));
    return new Promise((resolve, reject) => {
      Promise.all(axiosRequests).then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};
