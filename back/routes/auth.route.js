import express from 'express'
import User from '../models/user.model.js'
import { generateToken } from '../lib/utils.js'
import bcrypt from 'bcryptjs'
const router = express.Router()
import { protect } from '../middleware/auth.middleware.js'
import Story from '../models/story.model.js'

// get current user
router.get('/', protect,  async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate("story")
        if(!user){
            return res.status(404).json({message: "Không tìm thấy người dùng"})
        } 
        return res.status(200).json(user)

    } catch (error) {
        console.log("Lỗi", error.message)
        return res.status(500).json({message: "Lỗi server."})
    }
})

// sign up
router.post('/signup', async (req, res) => {
    const {fullName, email, password} = req.body
    try {
        if(password.length < 6){
            return res.status(400).json({message: "Mật khẩu phải có tối thiểu 6 ký tự."})
        }
        const user = await User.findOne({email})
        if (user) return res.status(400).json({message: "Email đã tồn tại."})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName, email, password: hashedPassword
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save()
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({message: "Thông tin không hợp lệ."})
        }

    } catch (error) {
        console.log("Lỗi", error.message)
        return res.status(500).json({message: "Lỗi server."})
    }
})

// sign in
router.post('/login', async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (!user) return res.status(401).json({message: "Thông tin không hợp lệ."})

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(401).json({message: "Thông tin không hợp lệ."})
        }
        generateToken(user._id, res)
        return res.status(201).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            story: user.story,
            biography: user.biography,
            isPublic: user.isPublic,
            isShowSeen: user.isShowSeen,
            isShowActive: user.isShowActive,
            profilePic: user.profilePic,
            createdAt: user.createdAt
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Lỗi server."})
    }
})

// logout
router.post('/logout', (req, res) => {
    try {
        res.cookie('jwt', '', {maxAge: 0})
        res.status(200).json({message: "Đăng xuất thành công."})
    } catch (error) {
        console.log("Lỗi", error.message)
        return res.status(500).json({message: "Lỗi server."})
    }
})

// update user profile-pic
router.put('/update-profile-pic', protect, async (req, res) => {
    try {
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message: "Không có ảnh đại diện."})
        }
        await User.findByIdAndUpdate(userId, { profilePic: profilePic });
        const updatedUser = await User.findById(userId).populate("story");

        return res.status(200).json(updatedUser)

    } catch (error) {
        return res.status(500).json({message: "Lỗi server."})
    }
})

router.put('/update-user', protect, async (req, res) => {
    try {
        const {
            fullName, 
            biography,
            isPublic,
            isShowSeen,
            isShowActive,
            password,
        } = req.body
        const userId = req.user._id
        
        const user = await User.findById(userId).populate("story").select('-password')

        if (fullName && fullName !== user.fullName) {
            user.fullName = fullName;
        }

        if (biography && biography !== user.biography) {
            user.biography = biography;
        }
        
        if (req.body.hasOwnProperty("isPublic") && isPublic !== user.isPublic) {
            user.isPublic = isPublic;
        }

        if (req.body.hasOwnProperty("isShowActive") && isShowActive !== user.isShowActive) {
            user.isShowActive = isShowActive;
        }

        if (req.body.hasOwnProperty("isShowSeen") && isShowSeen !== user.isShowSeen) {
            user.isShowSeen = isShowSeen;
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save()
        
        return res.status(200).json(user)

    } catch (error) {
        return res.status(500).json({message: "Lỗi server."})
    }
})

router.put('/upload-story', protect, async (req, res) => {
    try {
        const { img, caption } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId).populate('story');
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        const newStory = new Story({
            userId,
            img,
            caption,
        });

        const savedStory = await newStory.save();

        user.story = savedStory._id;
        await user.save();

        return res.status(200).json({
            ...user.toObject(),
            story: savedStory,
        });

    } catch (error) {
        console.error("❌ Lỗi server khi upload story:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});


router.delete('/delete-story', protect, async (req, res) => {
    try {
        const userId = req.user._id

        await Story.findOneAndDelete({userId});
        
        return res.status(200).json({message: 'Xóa thành công'})
    } catch (error) {
        console.error("❌ Lỗi server khi xóa story:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
})

export default router