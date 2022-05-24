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
exports.putUser = exports.getUser = exports.getAllUsers = exports.userDisconnected = exports.userConnected = exports.deactivateUser = exports.loginUser = exports.signupUser = void 0;
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken_1 = require("../helpers/verifyToken");
const connectedUsers_1 = require("../state/connectedUsers");
const signupUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, gender, password, role } = req.body;
    const isDuplicateUsername = yield user_1.User.findOne({ username: username });
    if (isDuplicateUsername)
        return res.status(409).json({ message: "username already exists" });
    let hash = yield bcrypt_1.default.hash(password, 10);
    const newUser = new user_1.User({
        username: username,
        email: email,
        hash: hash,
        gender: gender,
        role: role,
        isActive: false,
        lastSeen: new Date(),
        status: "Hey There!!!",
        createdOn: new Date(),
    });
    yield newUser.save();
    res.json({ message: "user created successfully" });
});
exports.signupUser = signupUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, rememberMe } = req.body;
    const user = yield user_1.User.findOne({ username: username });
    if (!user)
        res.status(401).json({ message: "username not found" });
    if (user.deactivatedOn !== null)
        res.status(401).json({ message: "account is deactivated" });
    if (yield bcrypt_1.default.compare(String(password), user.hash)) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const data = { userId: user._id };
        let expiresIn = (rememberMe) ? '30d' : '24h';
        const token = jsonwebtoken_1.default.sign(data, jwtSecretKey, { expiresIn: expiresIn });
        res.json({ token, user: user });
    }
    else {
        res.status(401).json({ message: "password doesn't match" });
    }
});
exports.loginUser = loginUser;
const deactivateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    user.deactivatedOn = new Date();
    user.save();
    res.json({ message: "account deactivated successfully" });
});
exports.deactivateUser = deactivateUser;
const userConnected = (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("New User connected");
    // To get auth token from socket headers
    const token = String(socket.handshake.headers.token);
    if (!(0, verifyToken_1.verifyToken)(token))
        return socket.disconnect();
    const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    if (data.userId in connectedUsers_1.connectedUsers)
        return socket.disconnect();
    connectedUsers_1.connectedUsers[data.userId] = socket;
    const currentUser = yield user_1.User.findOne({ _id: data.userId });
    currentUser.isActive = true;
    yield currentUser.save();
    console.log("No of users online: ", Object.keys(connectedUsers_1.connectedUsers).length);
    for (const key in connectedUsers_1.connectedUsers) {
        if (key === data.userId)
            continue;
        connectedUsers_1.connectedUsers[key].emit('userConnected', { userId: data.userId });
    }
});
exports.userConnected = userConnected;
const userDisconnected = (data) => __awaiter(void 0, void 0, void 0, function* () {
    delete connectedUsers_1.connectedUsers[data.userId];
    console.log("An User disconnected");
    console.log("No of users active online: ", Object.keys(connectedUsers_1.connectedUsers).length);
    const currentUser = yield user_1.User.findOne({ _id: data.userId });
    currentUser.isActive = false;
    currentUser.lastSeen = new Date();
    yield currentUser.save();
    for (const key in connectedUsers_1.connectedUsers) {
        if (key === data.userId)
            continue;
        connectedUsers_1.connectedUsers[key].emit('userDisconnected', { userId: data.userId });
    }
});
exports.userDisconnected = userDisconnected;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find();
    res.json(users);
});
exports.getAllUsers = getAllUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({ _id: req.params.userId });
    res.json(user);
});
exports.getUser = getUser;
const putUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { status } = req.body;
    const user = yield user_1.User.findOne({ _id: userId });
    user.status = status;
    yield user.save();
    res.send();
});
exports.putUser = putUser;
//# sourceMappingURL=userController.js.map