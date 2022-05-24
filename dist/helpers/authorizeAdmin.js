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
exports.authorizeAdmin = void 0;
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorizeAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = String(req.headers['token']);
    let data;
    try {
        data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch (err) {
        res.json({ message: err.message });
        return;
    }
    const userId = data.userId;
    const user = yield user_1.User.findOne({ _id: userId });
    if (user.deactivatedOn !== null)
        return res.status(401).json({ message: "user is deactivated" });
    if (!user || user.role !== 'admin')
        return res.status(401).json({ message: "user is unauthorized" });
    next();
});
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=authorizeAdmin.js.map