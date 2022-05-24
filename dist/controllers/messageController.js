"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.sendMessage = exports.getAllMessages = void 0;
const attachment_1 = require("./../models/attachment");
const message_1 = require("../models/message");
const user_1 = require("../models/user");
const connectedUsers_1 = require("../state/connectedUsers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const token = String(req.headers.token);
    let data;
    try {
        data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch (err) {
        res.status(401).json({ message: err });
    }
    const messageFrom = data.userId;
    const messages = yield message_1.Message.find({ $and: [{ $or: [{ messageTo: userId }, { messageTo: messageFrom }] }, { $or: [{ messageFrom: userId }, { messageFrom: messageFrom }] }] });
    const attachments = yield attachment_1.Attachment.find({ $and: [{ $or: [{ attachmentTo: userId }, { attachmentTo: messageFrom }] }, { $or: [{ attachmentFrom: userId }, { attachmentFrom: messageFrom }] }] });
    res.json({ messages: messages, attachments: attachments });
});
exports.getAllMessages = getAllMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { content } = req.body;
    const messageTo = yield user_1.User.findById(req.body.messageTo);
    const messageFrom = yield user_1.User.findById(req.body.messageFrom);
    const newMessage = new message_1.Message({
        content: content,
        createdOn: new Date(),
        status: req.body.messageTo in connectedUsers_1.connectedUsers ? "delivered" : "sent",
        messageFrom: messageFrom,
        messageTo: messageTo
    });
    yield newMessage.save();
    if (req.body.messageTo in connectedUsers_1.connectedUsers) {
        connectedUsers_1.connectedUsers[req.body.messageTo].emit("receiveMessage", newMessage);
    }
    res.send();
});
exports.sendMessage = sendMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const message = yield message_1.Message.findOne({ _id: messageId });
    yield message_1.Message.deleteOne({ _id: message._id });
    if (String(message.messageTo) in connectedUsers_1.connectedUsers) {
        connectedUsers_1.connectedUsers[String(message.messageTo)].emit('deleteMessage', { messageId: messageId });
    }
    res.send();
});
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=messageController.js.map