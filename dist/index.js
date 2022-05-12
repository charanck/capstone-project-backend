"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const connectToDb_1 = require("./middlewares/connectToDb");
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Middleware
// Cors config
if (config_1.ENVIRONMENT !== "DEV")
    (0, cors_1.default)({ origin: config_1.FRONTEND_IP });
else
    (0, cors_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(connectToDb_1.initializeDB);
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, { /* options */});
io.on("connection", (socket) => {
    // Toget auth token from socket headers
    console.log(socket.handshake.headers.token);
});
app.get('/', (req, res) => {
    res.json({ message: "OK" });
});
httpServer.listen(config_1.PORT, () => {
    console.log(`Listening on port ${config_1.PORT}`);
});
//# sourceMappingURL=index.js.map