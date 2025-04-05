import axios from 'axios'

export const configuredAxios = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:9000/api' : '/api',
    withCredentials: true,
})
