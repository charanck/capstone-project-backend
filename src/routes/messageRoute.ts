import { Router } from "express";
import { authorizeUser } from "../helpers/authorizeUser";

import { getAllMessages,sendMessage,deleteMessage } from "../controllers/messageController";

export const messageRouter = Router();

messageRouter.get('/:userId',authorizeUser,getAllMessages);
messageRouter.delete('/:messageId',authorizeUser,deleteMessage);
messageRouter.post('/',authorizeUser,sendMessage);