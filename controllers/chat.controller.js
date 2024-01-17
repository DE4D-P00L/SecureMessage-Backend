import Chat from '../models/chat.model.js'
import User from '../models/user.model.js'

export const sendMessage = async (req,res)=>{
    const { message } = req.body;
    const sentBy = req.data._id;

    //Data Validation
    if(message?.trim().length==0){
        return res.status(422).json({message:"Empty Message body!"})
    }

    try{
        const msg = await Chat.create({message,sentBy})
        
        //Update chatId in User document
        const chatId={chatId:msg._id}
        const updateUser = await User.findByIdAndUpdate({_id:sentBy},chatId,{new:true});

        res.status(200).json({message:msg});
    }catch(e){
        console.log(e.message);
    }
}

//Get all messages
export const getMessages = async (req,res)=>{
    try{
        const messages = await Chat.find({});
        res.status(200).json({ messages });
    }catch(e){
        console.log(e.message);
    }
}

//TODO: Update message