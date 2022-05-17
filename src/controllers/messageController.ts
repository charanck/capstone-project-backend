import { Message } from "../models/message";
import { User } from "../models/user";
import { connectedUsers } from "../state/connectedUsers";

export const sendMessage = async (data: any) => {
    const { content } = data;

    const messageTo = await User.findById(data.messageTo);
    const messageFrom = await User.findById(data.messageFrom);
    const newMessage = new Message({
        content: content,
        createdOn: new Date(),
        status: data.messageTo in connectedUsers ? "delivered" : "sent",
        messageFrom: messageFrom,
        messageTo: messageTo
    });

    await newMessage.save();
    if (data.messageTo in connectedUsers) {
        connectedUsers[data.messageTo].emit("receiveMessage", newMessage);
    }
};

export const deleteMessage = async(data:any)=>{
    const { messageId } = data;
    const messageTo = await User.findById(data.messageTo);

    await Message.deleteOne({_id:messageId});

    if(String(messageTo._id) in connectedUsers ){
       connectedUsers[String(messageTo._id)].emit('deleteMessage',{messageId:messageId});
    }
}
