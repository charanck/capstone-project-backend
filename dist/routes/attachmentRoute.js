"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachmentRouter = void 0;
const express_1 = require("express");
const authorizeUser_1 = require("../helpers/authorizeUser");
const attachmentController_1 = require("../controllers/attachmentController");
exports.attachmentRouter = (0, express_1.Router)();
exports.attachmentRouter.post("/", authorizeUser_1.authorizeUser, attachmentController_1.sendAttachment);
exports.attachmentRouter.delete("/:attachmentId", authorizeUser_1.authorizeUser, attachmentController_1.deleteAttachment);
//# sourceMappingURL=attachmentRoute.js.map