import { NextFunction ,Response,Request} from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

export const authorizeUser = async(req:Request,res:Response,next:NextFunction)=>{
    const token = String(req.headers['token']);
    let data:any;

    try{
        data = jwt.verify(token,process.env.JWT_SECRET_KEY);
    }catch(err){
        res.status(401).json({message:err.message});
        return;
    }
    const userId = data.userId;
    const user = await User.findOne({_id:userId});
    if(user.deactivatedOn !== null)return res.status(401).json({message:"user is deactivated"});
    if(!user)return res.status(401).json({message:"user is unauthorized"});
    next();
}