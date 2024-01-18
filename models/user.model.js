import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
    resetPasswordToken: String,
    resetPasswordExpire: String,
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

userSchema.methods.getResetToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 15*50*1000;

    return resetToken;
}

export default mongoose.model('User', userSchema);