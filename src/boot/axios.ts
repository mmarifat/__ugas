import axios, {AxiosInstance} from 'axios';
import {boot} from 'quasar/wrappers';
import {Notify} from "quasar";
import {ResponseStatus} from "components/IImports";

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

const Axios = axios.create({
  baseURL: process.env.API,
  headers: {
    'key': 'ugas-system-mmarifat-112233'
  }
});
Axios.interceptors.response.use(response => {
  return new Promise(resolve => {
    if (response.data.status === ResponseStatus.ERROR) {
      Notify.create({
        message: 'Operation Failed!',
        caption: response.data.message,
        type: 'negative'
      })
      resolve(response)
    } else {
      resolve(response)
    }
  })
}, error => {
  if (error.message === 'Network Error') {
    Notify.create({
      caption: "Retrying in 5 sec...",
      message: "Network Error",
      type: 'warning',
      timeout: 4000
    })
    return new Promise(resolve => {
      setTimeout(() => {
        return resolve();
      }, 5000)
    }).then(value => {
      return Axios.request(error.config);
    })
  } else {
    return error;
  }
})
export default boot(({Vue}: any) => {
  Vue.prototype.$axios = Axios
});
export {Axios}
