import { connectedUsers } from "../state/connectedUsers";

export const sendMessage = (socket:any,data:any)=>{
    const {messageTo,content} = data;

    socket.emit("receiveMessage",data);
}