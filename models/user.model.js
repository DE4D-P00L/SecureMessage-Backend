import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name is required"]
    },
    email:{
        type: String,
        required: [true,"Email is required"],
        match: /^.+@.+\..+$/,
        unique: true,
    },
    password:{
        type: String,
        required: [true,"Password is required"]
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
},{timestamps:true});

//Hash password field before saving document
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')){
        // Skip hashing if password unchanged
        return next(); 
    }
  
    try {
      const salt = await bcrypt.genSalt(10); 
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error) {
      console.log(error);
    }
});

export default mongoose.model('User', userSchema);