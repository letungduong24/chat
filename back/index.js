import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
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
app.use(cors({
    origin: process.env.ORIGIN_URL,
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

server.listen(port, () => {
    console.log('server is running')
    connectDB()
})

