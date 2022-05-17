import mongoose from 'mongoose';
import { DBURI } from '../config';

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

export const initializeDBSocket = async ()=>{
    await getDB();
}