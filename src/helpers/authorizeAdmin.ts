import { NextFunction ,Response,Request} from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

export const authorizeAdmin = async(req:Request,res:Response,next:NextFunction)=>{
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
    if(!user.deactivatedOn)return res.status(401).json({message:"user is deactivated"});
    if(!user || user.role !== 'admin')return res.status(401).json({message:"user is unauthorized"});
    next();
}