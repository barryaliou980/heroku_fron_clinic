import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useUserStore } from '../stores/userStore';
import { LocalStorage } from 'quasar';
const store = useUserStore();
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// const api = axios.create({
//   baseURL: 'https://backend.laclinico.com/api',
// });

// const backendImagePath = 'https://backend.laclinico.com/files/';
// const backendRDTPath = 'https://backend.laclinico.com/rdt/';
// const backendqrCodePath = 'https://backend.laclinico.com/qrCode/';



const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: false
});

api.interceptors.request.use(
  config => {
     if(LocalStorage.getItem('token')) {
        config.headers['Authorization'] = `Bearer ${LocalStorage.getItem('token')}`;
     }
     return config;
  },
  error => {
     Promise.reject(error);
  }
);

const backendImagePath = 'http://127.0.0.1:8000/files/';
const backendRDTPath = 'http://127.0.0.1:8000/rdt/';
const backendqrCodePath = 'http://127.0.0.1:8000/qrCode/';

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});


export { api, backendImagePath, backendRDTPath, backendqrCodePath };
