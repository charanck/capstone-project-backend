"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONTEND_IP = exports.DBURI = exports.ENVIRONMENT = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = Number(process.env.PORT);
exports.ENVIRONMENT = process.env.ENVIRONMENT;
exports.DBURI = process.env.DBURI;
exports.FRONTEND_IP = process.env.FRONEND_IP;
//# sourceMappingURL=config.js.map