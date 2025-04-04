import mongoose from "mongoose";
import Story from "./story.model.js";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        biography: {
            type: String,
            default: "",
        },
        isPublic: {
            type: Boolean,
            default: true,
        },
        isShowSeen: {
            type: Boolean,
            default: true,
        },
        isShowActive: {
            type: Boolean,
            default: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        },
        story: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Story", 
            },
        
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
