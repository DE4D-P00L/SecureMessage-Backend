import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    message: String,
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true});

export default mongoose.model('Chat', chatSchema);