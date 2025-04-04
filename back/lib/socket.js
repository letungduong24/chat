import {Server} from 'socket.io'
import http from 'http'
import express from 'express'
import dotenv from 'dotenv'


dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [process.env.ORIGIN_URL]
    }
})

const userSocketMap = {}

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId]
}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('User ID from handshake:', userId);
    if (userId) {
        userSocketMap[userId] = socket.id;
      }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  
    socket.on('disconnect', () => {
      console.log('A user disconnected:', userId);
      if (userId && userSocketMap[userId]) {
        delete userSocketMap[userId];
        console.log(`Removed user ${userId} from map`);
      }
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });
  

export {io, app, server}

// io.on - lắng nghe khi client kết nối tới server
// socket.on - lắng nghe sự kiện do client gửi 