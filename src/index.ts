import { deleteMessage } from "./controllers/messageController";
import express, { Express, Request, Response } from "express";
import { PORT } from "./config";
import { initializeDB } from "./middlewares/connectToDb";
import helmet from "helmet";
import cors from "cors";
import jwt from "jsonwebtoken";
import { connectToCloudinary } from "./middlewares/connectToCloudinary";
import upload from "express-fileupload";

// Routers
import { userRouter } from "./routes/userRoute";
import { attachmentRouter } from "./routes/attachmentRoute";
import { feedbackRouter } from "./routes/feedbackRoute";
import { messageRouter } from "./routes/messageRoute";

const app: Express = express();

// Middleware
// Cors config
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(initializeDB);
app.use(connectToCloudinary);
app.use(upload());

// Socket configuration
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeDBSocket } from "./middlewares/connectToDbInSocket";

// Socket controllers
import { userConnected, userDisconnected } from "./controllers/userController";

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", async (socket) => {
    // init DB
    await initializeDBSocket();

    await userConnected(socket);
    const token: string = String(socket.handshake.headers.token);
    let data: any;
    try {
        data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        console.log(err);
    }

    socket.on("disconnect", async function () {
        await userDisconnected(data);
    });
});

// ROUTES
app.use("/users", userRouter);
app.use("/attachments", attachmentRouter);
app.use("/feedbacks", feedbackRouter);
app.use("/messages", messageRouter);

app.get("/test", (req: Request, res: Response) => {
    res.json({ message: "OK" });
});

httpServer.listen(PORT, (): void => {
    console.log(`Listening on port ${PORT}`);
});
