import axios from 'axios'

export const configuredAxios = axios.create({
    baseURL: import.meta.env.MODE === "development" ? import.meta.env.VITE_BACKEND_URL : import.meta.env.VITE_BACKEND_PRODUCTION_URL,
    withCredentials: true,
})