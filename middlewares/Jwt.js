import jwt from "jsonwebtoken";

export const generateToken = (data) =>{
    const token = jwt.sign({
        // exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data:data
    }, process.env.JWT_SECRET);
    return token;
}

export const verifyToken = (req,res,next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized: Missing token"})
    }

    try {
        const tokenData = jwt.verify(token,process.env.JWT_SECRET);
        req.data = tokenData.data;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}