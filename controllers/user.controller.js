import User from '../models/user.model.js'
import { generateToken } from '../middlewares/Jwt.js'
import bcrypt from 'bcrypt';
import { sendEmail } from '../util/sendEmail.js';
import crypto from 'crypto';

export const signUp = async (req,res)=>{
    const { name, email, password } = req.body;

    //Data Validation
    if(name?.trim()===''||email?.trim()===''||password?.trim()===''){
        return res.status(422).json({message:"Invalid Data, Please fill all fields"})
    }

    try {
        const findUser = await User.findOne({email:email})

        if(!findUser){
            //password hashing is handled in User Model i.e. ../models/user.model.js
            const user = await User.create({ name, email, password });
            const safeResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
            return res.status(201).json({message:"User created", user:safeResponse})
        }
        
        res.status(409).json({message:"Email already exists"});
    } catch (e) {
        console.log(e.message);
    }
}

export const logIn = async (req,res)=>{
    const { email, password } = req.body;

    //Data Validation
    if(!email || !password || email?.trim()===''||password?.trim()==='') 
        return res.status(422).json({message:"Invalid Data, Please fill all fields"})

    try {
        const user = await User.findOne({ email: email })

        if(!user) return res.status(401).json({message:"Wrong Email"}) 

        //Verify Input Password and Hashed Password
        const verify = await bcrypt.compare(password,user.password);
        if(!verify)
            return res.status(401).json({message:"Wrong Password"}) 

        //Creating a Safe Response object by omitting not required fields
        const safeResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }

        //Generate and send Token
        const token = generateToken(safeResponse);
        res.status(200).json({message:"Logged In",user:safeResponse, token})

    } catch (e) {
        console.log(e.message);
    }
}

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    
    try {
        const user = await User.findOne({email: email});
        if(!user) return res.status(404).json({message: "User not found"})

        const resetToken = await user.getResetToken();
        await user.save();
        const url = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        const message = `Click on the link to reset password. ${url} If you have not requested then please ignore.`
        sendEmail(user.email,"Reset Password",message)

        res.status(200).json({message: resetToken})
    } catch (error) {
        console.log(error.message);
    }
}

export const resetPassword = async (req, res) =>{
    const {token} = req.params
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest('hex');

        const user = await User.findOne({resetPasswordToken});


        if(!user || user.resetPasswordExpire < Date.now()) return res.status(400).json({message:"Token is invalid or expired",token:resetPasswordToken, result:user.resetPasswordExpire > Date.now()})

        //reset password
        user.password = req.body.password
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken= undefined;
        user.save();

        res.status(200).json({message: "Password Changed"})
    } catch (error) {
        console.log(error.message);
    }
}

