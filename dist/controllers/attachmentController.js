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
exports.deleteAttachment = exports.sendAttachment = void 0;
const cloudinary_1 = require("cloudinary");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const attachment_1 = require("../models/attachment");
const user_1 = require("../models/user");
const connectedUsers_1 = require("../state/connectedUsers");
const fs_1 = __importDefault(require("fs"));
const sendAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.files.image;
    fs_1.default.writeFileSync(`${process.cwd()}/uploads/${image.name}`, image.data, {
        encoding: "binary"
    });
    const uploadedFile = yield cloudinary_1.v2.uploader.upload(`${process.cwd()}/uploads/${image.name}`);
    fs_1.default.unlinkSync(`${process.cwd()}/uploads/${image.name}`);
    const token = String(req.headers.token);
    const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    const userId = String(data.userId);
    const attachmentFrom = yield user_1.User.findById(userId);
    const attachmentTo = yield user_1.User.findById(req.body.attachmentTo);
    const newAttachment = new attachment_1.Attachment({
        attachmentURL: uploadedFile.secure_url,
        attachmentFrom: attachmentFrom,
        attachmentTo: attachmentTo,
        createdOn: new Date(),
        publicId: uploadedFile.public_id,
        status: req.body.attachmentTo in connectedUsers_1.connectedUsers ? "delivered" : "sent"
    });
    newAttachment.save();
    if (req.body.attachmentTo in connectedUsers_1.connectedUsers) {
        connectedUsers_1.connectedUsers[req.body.attachmentTo].emit("receiveAttachment", newAttachment);
    }
    res.json(newAttachment);
});
exports.sendAttachment = sendAttachment;
const deleteAttachment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const attachmentId = req.params.attachmentId;
    const attachment = yield attachment_1.Attachment.findById(attachmentId);
    const result = yield cloudinary_1.v2.uploader.destroy(attachment.publicId);
    yield attachment_1.Attachment.deleteOne({ _id: attachmentId });
    if (String(attachment.attachmentTo._id) in connectedUsers_1.connectedUsers) {
        connectedUsers_1.connectedUsers[String(attachment.attachmentTo._id)].emit("deleteAttachment", { attachmentId: attachmentId });
    }
    res.json(result);
});
exports.deleteAttachment = deleteAttachment;
//# sourceMappingURL=attachmentController.js.map