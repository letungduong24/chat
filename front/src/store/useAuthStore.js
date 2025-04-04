import {create} from 'zustand'
import { configuredAxios } from '../lib/axios'
import { toast } from 'sonner'
import {io} from 'socket.io-client'

export const useAuthStore = create((set, get) => ({
    user: null,
    socket: null,
    onlineUsers: [],

    isCheckingAuth: true,
    isLogging: false,
    isRegistering: false,
    isUpdatingProfile: false,
    isLogoutIng: false,

    checkAuth: async() => {
        try {
            const res = await configuredAxios.get(
                '/auth'
            )
            set({user: res.data})
            get().connectSocket()
        } catch (error) {
            set({user: null})
        } finally{
            set({isCheckingAuth: false})
        }
    },

    login: async (data) => {
        set({isLogginging: true})
        try {
            const res = await configuredAxios.post(
                '/auth/login', data
            )
            set({user: res.data})
            get().connectSocket()
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isLogginging: false})
        }
    },

    signup: async (data) => {
        set({isRegistering: true})
        try {
            const res = await configuredAxios.post(
                '/auth/signup', data
            )
            set({user: res.data})
            get().connectSocket()
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isRegistering: false})
        }
    },

    logout: async () => {
        set({isLogoutIng: true})
        try {
            const res = await configuredAxios.post(
                '/auth/logout'
            )
            set({user: null})
            get().disconnectSocket()
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isLogoutIng: false})
        }
    },

    updateProfile: async (data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await configuredAxios.put(
                '/auth/update-user',
                data
            )
            set({user: res.data})
            console.log(data)
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isUpdatingProfile: false})
        }
    },

    uploadStory: async (data) => {
        try {
            const res = await configuredAxios.put(
                '/auth/upload-story',
                data
            )
            set({user: res.data})
        } catch (error) {
            throw new Error(error.response.data.message)
        } 
    },

    deleteStory: async () => {
        try {
            const res = await configuredAxios.delete(
                '/auth/delete-story',
            )
            set((state) => ({ user: { ...state.user, story: null } }));
        } catch (error) {
            throw new Error(error.response.data.message)
        } 
    },

    updateAvatar: async (data) => {
        try {
            const res = await configuredAxios.put(
                '/auth/update-profile-pic',
                data
            )
            console.log(res.data)
            set({user: res.data})
        } catch (error) {
            throw new Error(error.response.data.message)
        } 
    },

    connectSocket: () => {
        const {user} = get()
        if(!user || get().socket?.connected) return

        const socket = io(import.meta.env.VITE_SERVER_URL, {
            query: {
                userId: user._id
            }
        })
        socket.connect()

        set({socket: socket})

        socket.on('getOnlineUsers', (userIds) => {
            set({onlineUsers: userIds})
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
    }

}))