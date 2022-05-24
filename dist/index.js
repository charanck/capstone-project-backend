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
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const connectToDb_1 = require("./middlewares/connectToDb");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const connectToCloudinary_1 = require("./middlewares/connectToCloudinary");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// Routers
const userRoute_1 = require("./routes/userRoute");
const attachmentRoute_1 = require("./routes/attachmentRoute");
const feedbackRoute_1 = require("./routes/feedbackRoute");
const messageRoute_1 = require("./routes/messageRoute");
const app = (0, express_1.default)();
// Middleware
// Cors config
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(connectToDb_1.initializeDB);
app.use(connectToCloudinary_1.connectToCloudinary);
app.use((0, express_fileupload_1.default)());
// Socket configuration
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const connectToDbInSocket_1 = require("./middlewares/connectToDbInSocket");
// Socket controllers
const userController_1 = require("./controllers/userController");
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    // init DB
    yield (0, connectToDbInSocket_1.initializeDBSocket)();
    yield (0, userController_1.userConnected)(socket);
    const token = String(socket.handshake.headers.token);
    let data;
    try {
        data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    }
    catch (err) {
        console.log(err);
    }
    socket.on("disconnect", function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, userController_1.userDisconnected)(data);
        });
    });
}));
// ROUTES
app.use("/users", userRoute_1.userRouter);
app.use("/attachments", attachmentRoute_1.attachmentRouter);
app.use("/feedbacks", feedbackRoute_1.feedbackRouter);
app.use("/messages", messageRoute_1.messageRouter);
app.get("/test", (req, res) => {
    res.json({ message: "OK" });
});
httpServer.listen(config_1.PORT, () => {
    console.log(`Listening on port ${config_1.PORT}`);
});
//# sourceMappingURL=index.js.map