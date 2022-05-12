import { UserInterface } from './../models/user';
import { Request,Response } from "express";
import { User } from "../models/user";
import bcrypt from "bcrypt";
import jwt ,{JwtPayload}from 'jsonwebtoken';


export const signupUser = async(req:Request,res:Response)=>{
    const { username, email, gender, password, DOB, role } = req.body;
    const isDuplicateUsername = await User.findOne({ username: username });
    if (isDuplicateUsername)
        return res.status(409).json({ message: "username already exists" });
    
    let hash = await bcrypt.hash(password, 10);
    const newUser = new User({
        username: username,
        email: email,
        hash:hash,
        DOB: new Date(DOB),
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
    if(user.deactivatedOn) res.status(401).json({message:"account is deactivated"});
    
    if(await bcrypt.compare(String(password),user.hash)){
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const data = {userId:user._id};

        let expiresIn = (rememberMe) ? '30d' : '24h';

        const token = jwt.sign(data, jwtSecretKey,{expiresIn:expiresIn});

        res.json({token});
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