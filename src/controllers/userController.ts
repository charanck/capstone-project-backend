import { UserInterface } from './../models/user';
import { Request,Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { verifyToken } from '../helpers/verifyToken';
import { connectedUsers } from '../state/connectedUsers';


export const signupUser = async(req:Request,res:Response)=>{
    const { username, email, gender, password, role } = req.body;
    const isDuplicateUsername = await User.findOne({ username: username });
    if (isDuplicateUsername)
        return res.status(409).json({ message: "username already exists" });
    
    let hash : string = await bcrypt.hash(password, 10);
    const newUser:UserInterface = new User({
        username: username,
        email: email,
        hash:hash,
        gender: gender,
        role: role,
        isActive: false,
        lastSeen: new Date(),
        status: "Hey There!!!",
        createdOn: new Date(),
    });

    await newUser.save();
    res.json({message:"user created successfully"});
}

export const loginUser = async(req:Request,res:Response)=>{
    const {username,password,rememberMe}= req.body;
    const user = await User.findOne({username:username});

    if(!user) res.status(401).json({message:"username not found"});
    if(user.deactivatedOn !== null) res.status(401).json({message:"account is deactivated"});
    
    if(await bcrypt.compare(String(password),user.hash)){
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const data = {userId:user._id};

        let expiresIn = (rememberMe) ? '30d' : '24h';

        const token = jwt.sign(data, jwtSecretKey,{expiresIn:expiresIn});

        res.json({token,user:user});
    }else{
        res.status(401).json({message:"password doesn't match"});
    }
}

export const deactivateUser = async(req:Request,res:Response)=>{
    const token = String(req.headers['token']);
    let data:any;

    try{
        data = jwt.verify(token,process.env.JWT_SECRET_KEY);
    }catch(err){
        res.json({message:err.message});
        return;
    }
    const userId = data.userId;
    const user = await User.findOne({_id:userId});
    user.deactivatedOn = new Date();
    user.save();
    res.json({message:"account deactivated successfully"});    
}

export const userConnected = async(socket:any)=>{
    console.log("New User connected");
    
    // To get auth token from socket headers
    const token:string = String(socket.handshake.headers.token);
    if(!verifyToken(token))return socket.disconnect();
    const data : any = jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(data.userId in connectedUsers) return socket.disconnect();
    connectedUsers[data.userId] = socket;

    const currentUser:any = await User.findOne({_id:data.userId});
    currentUser.isActive = true;
    await currentUser.save();

    console.log("No of users online: ",Object.keys(connectedUsers).length);

    for(const key in connectedUsers){
        if(key === data.userId) continue;
        connectedUsers[key].emit('userConnected',{userId:data.userId});
    }
}

export const userDisconnected = async(data:any)=>{
    delete connectedUsers[data.userId];

    console.log("An User disconnected");
    console.log("No of users active online: ",Object.keys(connectedUsers).length);

    const currentUser:any = await User.findOne({_id:data.userId});
    currentUser.isActive = false;
    currentUser.lastSeen = new Date();
    await currentUser.save();

    for(const key in connectedUsers){
        if(key === data.userId) continue;
        connectedUsers[key].emit('userDisconnected',{userId:data.userId});
    }
}

export const getAllUsers = async(req:Request,res:Response)=>{
    const users = await User.find();
    res.json(users);
}

export const getUser = async(req:Request,res:Response)=>{
    const user = await User.findOne({_id:req.params.userId});
    res.json(user);
}

export const putUser = async(req:Request,res:Response) =>{
    const { userId } = req.params;
    const {status} = req.body;

    const user = await User.findOne({_id:userId});

    user.status =  status;

    await user.save();

    res.send();
}