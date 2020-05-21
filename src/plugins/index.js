import axios from "axios"
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'


