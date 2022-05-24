import { Attachment } from './../models/attachment';
import { Response,Request } from 'express';
import { Message } from "../models/message";
import { User } from "../models/user";
import { connectedUsers } from "../state/connectedUsers";

import jwt from 'jsonwebtoken';



// export const sendMessage = async (data: any) => {
//     console.log(data);
    
//     const { content } = data;

//     const messageTo = await User.findById(data.messageTo);
//     const messageFrom = await User.findById(data.messageFrom);
//     const newMessage = new Message({
//         content: content,
//         createdOn: new Date(),
//         status: data.messageTo in connectedUsers ? "delivered" : "sent",
//         messageFrom: messageFrom,
//         messageTo: messageTo
//     });

//     await newMessage.save();
//     if (data.messageTo in connectedUsers) {
//         connectedUsers[data.messageTo].emit("receiveMessage", newMessage);
//     }
// };

// export const deleteMessage = async(data:any)=>{
//     const { messageId } = data;
//     const messageTo = await User.findById(data.messageTo);

//     await Message.deleteOne({_id:messageId});

//     if(String(messageTo._id) in connectedUsers ){
//        connectedUsers[String(messageTo._id)].emit('deleteMessage',{messageId:messageId});
//     }
// }

export const getAllMessages = async(req:Request,res:Response)=>{
    const {userId} = req.params;
    const token = String(req.headers.token);
    let data:any;
    try{
        data = jwt.verify(token,process.env.JWT_SECRET_KEY);
    }catch(err){
        res.status(401).json({message:err})
    }
    const messageFrom = data.userId;

    const messages = await Message.find({$and:[{$or:[{messageTo:userId},{messageTo:messageFrom}]},{$or:[{messageFrom:userId},{messageFrom:messageFrom}]}]});

    const attachments = await Attachment.find({$and:[{$or:[{attachmentTo:userId},{attachmentTo:messageFrom}]},{$or:[{attachmentFrom:userId},{attachmentFrom:messageFrom}]}]});

    res.json({messages:messages,attachments:attachments});
}

export const sendMessage = async(req:Request,res:Response)=>{
    const { content } = req.body;

    const messageTo = await User.findById(req.body.messageTo);
    const messageFrom = await User.findById(req.body.messageFrom);
    const newMessage = new Message({
        content: content,
        createdOn: new Date(),
        status: req.body.messageTo in connectedUsers ? "delivered" : "sent",
        messageFrom: messageFrom,
        messageTo: messageTo
    });
    await newMessage.save();
    if (req.body.messageTo in connectedUsers) {
        connectedUsers[req.body.messageTo].emit("receiveMessage", newMessage);
    }
    res.send();
}

export const deleteMessage = async(req:Request,res:Response)=>{
    const { messageId } = req.params;

    const message = await Message.findOne({_id:messageId});

    await Message.deleteOne({_id:message._id});

    if(String(message.messageTo) in connectedUsers ){
       connectedUsers[String(message.messageTo)].emit('deleteMessage',{messageId:messageId});
    }

    res.send();
}
