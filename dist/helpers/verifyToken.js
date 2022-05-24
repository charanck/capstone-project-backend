"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token) => {
    let data;
    try {
        data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        return true;
    }
    catch (err) {
        return false;
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyToken.js.map