import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connect DB sucessfully')
    } catch (error) {
        console.log("Error: ", error)
    }
}