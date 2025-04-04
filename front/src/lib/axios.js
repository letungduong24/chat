import axios from 'axios'

export const configuredAxios = axios.create({
    baseURL: '/api', 
    withCredentials: true,
})
