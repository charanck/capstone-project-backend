import mongoose from 'mongoose';
import { DBURI } from '../config';
import { Request, Response, NextFunction } from 'express';

function getDB():Promise<any>{
    return new Promise(async (resolve,reject)=>{
        try{
            await mongoose.connect(DBURI);
            resolve(0);
        }catch(err){
            reject(err);
        }
    });
}

export const initializeDB = async (req:Request,res:Response,next:NextFunction)=>{
    await getDB();
    next();
}