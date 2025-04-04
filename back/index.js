import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';

import {app, server} from './lib/socket.js'

dotenv.config()

const port = process.env.PORT

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

// Xóa dòng cors cũ này nếu bạn đang sử dụng
// app.use(cors({
//     origin: process.env.ORIGIN_URL,
//     credentials: true
// }))

// Thêm middleware CORS tùy chỉnh này
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

server.listen(port, () => {
    console.log('server is running')
    connectDB()
})