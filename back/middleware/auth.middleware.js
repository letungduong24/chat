import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import cookieParser from 'cookie-parser'

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({message: "Bạn không có quyền truy cập"})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message: "Bạn không có quyền truy cập"})
        }
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(404).json({message: "Không tìm thấy user"})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({message: "Lỗi server"})
    }
}