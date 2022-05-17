import { Feedback } from './../models/feedback';
import { Request,Response} from "express";
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const getFeedbacks = async(req:Request,res:Response)=>{
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
}

export const createFeedback = async(req:Request,res:Response)=>{
    const {answerOne,answerTwo,answerThree}  = req.body;

    const token:string = String(req.headers.token)
    const data:any = jwt.verify(token,process.env.JWT_SECRET_KEY);

    const currentUser:any = await User.find({_id:data.userId});

    const newFeedback = new Feedback({answerOne:answerOne,answerTwo:answerTwo,answerThree:answerThree});
    await newFeedback.save();

    currentUser.feedback = newFeedback;
    await currentUser.save();

    res.json({message:"feedback saved"});
}