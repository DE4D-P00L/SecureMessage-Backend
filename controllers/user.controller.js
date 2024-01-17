import User from '../models/user.model.js'
import { generateToken } from '../middlewares/Jwt.js'
import bcrypt from 'bcrypt';

export const signUp = async (req,res)=>{
    const { name, email, password } = req.body;

    //Data Validation
    if(name?.trim()===''||email?.trim()===''||password?.trim()===''){
        return res.status(422).json({message:"Invalid Data, Please fill all fields"})
    }

    try {
        //password hashing is handled in User Model i.e. ../models/user.model.js
        const user = await User.create({ name, email, password });
        const safeResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }
        res.status(201).json({message:"User created", user:safeResponse})
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


