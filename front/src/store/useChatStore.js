import {create} from 'zustand'
import { configuredAxios } from '../lib/axios'
import { useAuthStore } from './useAuthStore'


export const useChatStore = create((set, get) => ({
    users: [],
    selectedUser: null,

    messages: [],

    isUsersLoading: false,
    isMessageLoading: false,
    isGetMessagesLoading: false,
    isGetMoreMessagesLoading: false,
    hasMore: false,

    getUsers: async () => {
        set({isUsersLoading: true})
        try {
            const res = await configuredAxios.get(
                '/message/users',
            )
            set({users: res.data})
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isUsersLoading: false})
        }
    },

    getMessages: async (userId) => {
        set({isGetMessagesLoading: true})
        try {
            const res = await configuredAxios.get(
                `/message/${userId}`
            )
            set({messages: res.data.messages.reverse()})
            set({hasMore: res.data.hasMore})
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isGetMessagesLoading: false})
        }
    },

    getMoreMessages: async (userId, page = 1) => {
        set({isGetMoreMessagesLoading: true})
        try {
            const res = await configuredAxios.get(
                `/message/${userId}?page=${page}`
            )
            set((state) => ({messages: [...res.data.messages.reverse(), ...state.messages]}))
            set({hasMore: res.data.hasMore})
            return res.data.length
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isGetMoreMessagesLoading: false})
        }
    },

    clearMessages: () => {
        set({messages: []})
    },

    setSelectedUser: (selectedUser) => {
        set({selectedUser})
    },

    sendMessage: async ({id, message}) => {
        set({isMessageLoading: true})
        try {
            const res = await configuredAxios.post(
                `/message/${id}`, message
            )
            set((state) => ({
                messages: [...state.messages, res.data]
              }))
        } catch (error) {
            throw new Error(error.response.data.message)
        } finally{
            set({isMessageLoading: false})
        }
    },

    subscribeToMessage: () => {
        const {selectedUser} = get()
        if(!selectedUser) return

        const socket = useAuthStore.getState().socket

        socket.on('newMessage', (newMessage) => {
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unSubscribeFromMessage: () => {
        const socket = useAuthStore.getState().socket
        socket.off('newMessage')
    }
}))