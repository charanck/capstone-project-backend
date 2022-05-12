import { sendMessage } from './controllers/messageController';
import express,{Express,Request,Response} from 'express';
import {PORT,ENVIRONMENT,FRONTEND_IP} from './config';
import { initializeDB } from './middlewares/connectToDb';
import helmet from 'helmet';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// Helpers
import { verifyToken } from './helpers/verifyToken';

// Routers
import {userRouter} from './routes/userRoute';

const app:Express = express();

// Middleware
// Cors config
if(ENVIRONMENT !== "DEV") cors({origin:FRONTEND_IP})
else cors();

app.use(helmet());
app.use(express.json());
app.use(initializeDB);


// Socket configuration
import { createServer } from "http";
import { Server } from "socket.io";
import { connectedUsers } from './state/connectedUsers';

const httpServer = createServer(app);
const io = new Server(httpServer);


io.on("connection", (socket) => {
    // To get auth token from socket headers
    const token:string = String(socket.handshake.headers.token);
    if(!verifyToken(token))return socket.disconnect();
    const data : any = jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(data.userId in connectedUsers) return socket.disconnect();
    connectedUsers[data.userId] = socket;

    // Socket Events
    socket.on('sendMessage',(data)=>{
        sendMessage(socket,data);
    });
});

// ROUTES
app.use('/users',userRouter);


app.get('/test',(req:Request,res:Response)=>{
    res.json({message:"OK"});
})


httpServer.listen(PORT,():void =>{console.log(`Listening on port ${PORT}`);
});