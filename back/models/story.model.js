import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: () => new Date(Date.now()),
    }
});

storySchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Story = mongoose.model("Story", storySchema);
export default Story;
