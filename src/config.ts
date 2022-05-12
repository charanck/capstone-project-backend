import dotenv from "dotenv";
dotenv.config();

export const PORT:number = Number(process.env.PORT);
export const ENVIRONMENT:string = process.env.ENVIRONMENT;
export const DBURI:string = process.env.DBURI;
export const FRONTEND_IP:string = process.env.FRONEND_IP;