import jwt from 'jsonwebtoken';

export const verifyToken = (token:string):boolean=>{
    let data;
    try{
        data = jwt.verify(token,process.env.JWT_SECRET_KEY);
        return true;
    }catch(err){
        return false;
    }
}