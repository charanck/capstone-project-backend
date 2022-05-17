import { deleteMessage, sendMessage } from './controllers/messageController';
import express,{Express,Request,Response} from 'express';
import {PORT,ENVIRONMENT,FRONTEND_IP} from './config';
import { initializeDB } from './middlewares/connectToDb';
import helmet from 'helmet';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { connectToCloudinary } from './middlewares/connectToCloudinary';
import upload from 'express-fileupload';

// Helpers
import { verifyToken } from './helpers/verifyToken';

// Routers
import { userRouter } from './routes/userRoute';
import { attachmentRouter } from './routes/attachmentRoute';
import { feedbackRouter } from './routes/feedbackRoute';

const app:Express = express();

// Middleware
// Cors config
if(ENVIRONMENT !== "DEV") cors({origin:FRONTEND_IP})
else cors();
app.use(helmet());
app.use(express.json());
app.use(initializeDB);
app.use(connectToCloudinary);
app.use(upload())


// Socket configuration
import { createServer } from "http";
import { Server } from "socket.io";
import { connectedUsers } from './state/connectedUsers';
import { initializeDBSocket } from './middlewares/connectToDbInSocket';

// Socket controllers
import { userConnected , userDisconnected} from './controllers/userController';

const httpServer = createServer(app);
const io = new Server(httpServer);


io.on("connection", async (socket) => {
    // init DB
    await initializeDBSocket();

    await userConnected(socket);
    const token:string = String(socket.handshake.headers.token);
    const data : any = jwt.verify(token,process.env.JWT_SECRET_KEY);

    // Socket Events
    socket.on('sendMessage',async (data)=>{
        sendMessage(data);
    });

    socket.on('deleteMessage',async (data)=>{
        deleteMessage(data);
    });

    socket.on('disconnect', async function() {
        await userDisconnected(data);
    });
});

// ROUTES
app.use('/users',userRouter);
app.use('/attachments',attachmentRouter);
app.use('/feedbacks',feedbackRouter)


app.get('/test',(req:Request,res:Response)=>{
    res.json({message:"OK"});
});



httpServer.listen(PORT,():void =>{console.log(`Listening on port ${PORT}`);
});