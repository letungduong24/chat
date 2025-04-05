import jwt from 'jsonwebtoken'

export const generateToken = (userId, res) => {
    console.log("🔐 generateToken called"); // Xác nhận hàm được gọi
    console.log("📦 userId:", userId); // Log ID người dùng
    console.log("🌍 NODE_ENV:", process.env.NODE_ENV); // Kiểm tra môi trường
    console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET); // Kiểm tra biến môi trường

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    console.log("✅ Token generated:", token);

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        httpOnly: true,
        sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict',
        secure: process.env.NODE_ENV !== 'development'
    });

    console.log("🍪 Cookie set successfully");

    return token;
}
