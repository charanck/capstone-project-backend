"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = require("express");
const authorizeUser_1 = require("../helpers/authorizeUser");
const messageController_1 = require("../controllers/messageController");
exports.messageRouter = (0, express_1.Router)();
exports.messageRouter.get('/:userId', authorizeUser_1.authorizeUser, messageController_1.getAllMessages);
exports.messageRouter.delete('/:messageId', authorizeUser_1.authorizeUser, messageController_1.deleteMessage);
exports.messageRouter.post('/', authorizeUser_1.authorizeUser, messageController_1.sendMessage);
//# sourceMappingURL=messageRoute.js.map