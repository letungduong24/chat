import express from 'express'
const router = express.Router()
import { protect } from '../middleware/auth.middleware.js'
import User from '../models/user.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketId, io } from '../lib/socket.js'

// get all user messaged for sidebar
router.get('/users', protect, async (req, res) => {
    try {
        const loggedUserId = req.user._id
        const filteredUsers = await User.find({_id: {$ne: loggedUserId}}).select('-password')
        res.status(200).json(filteredUsers)
    } catch (error) {
        return res.status(500).json({message: "Lỗi server."})
    }
})

// get message
router.get('/:id', protect, async (req, res) => {
    try {
        const {id: userToChatId} = req.params
        const myId = req.user._id

        const page = parseInt(req.query.page) || 1
        const limit = 20

        // Tìm tin nhắn giữa người dùng
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        .sort({createdAt: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        
        const hasMore = messages.length === limit; 
        
        res.status(200).json({
            messages,
            hasMore
        })
    } catch (error) {
        return res.status(500).json({message: "Lỗi server."})
    }
})


// send message
router.post('/:id', protect, async (req, res) => {
    try {
        const {text, image} = req.body
        const {id: receiverId} = req.params
        const myId = req.user._id

        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text,
            image
        })

        await newMessage.save()

        // khi có tin nhắn mới, tạo sự kiện và gửi tin nhắn mới đến socket id đang online
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }

        res.status(201).json(newMessage)
    } catch (error) {
        return res.status(500).json({message: "Lỗi server."})
    }
})

export default router