import { Schema, model,Model, Types } from 'mongoose';

export interface AttachmentInterface extends Document{
    attachmentURL:string,
    publicId:string,
    createdOn:Date,
    attachmentFrom:Types.ObjectId,
    attachmentTo:Types.ObjectId,
    status:string
};

const attachmentSchema:Schema<AttachmentInterface> = new Schema<AttachmentInterface>({
    attachmentURL:{
        type:String,
        required:true
    },
    publicId:{
        type:String,
        required:true
    },
    createdOn:{
        type:Date,
        default:new Date()
    },
    attachmentFrom:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    attachmentTo:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    status:{
        type:String
    }
});

export const Attachment:Model<AttachmentInterface> = model<AttachmentInterface>('attachment',attachmentSchema);
