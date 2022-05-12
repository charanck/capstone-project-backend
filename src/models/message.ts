import { Schema, model, connect,Model ,Types} from 'mongoose';
import { User ,UserInterface} from './user';


export interface MessageInterface extends Document{
    content:String,
    createdOn:Date,
    status:String,
    deletedOn:Date,
    messageFrom:Types.ObjectId,
    messageTo:Types.ObjectId
}

const MessageSchema:Schema<MessageInterface> = new Schema<MessageInterface>({
    content:{
        type:String,
    },
    createdOn:{
        type:Date,
        default:new Date()
    },
    status:{
        type:String
    },
    deletedOn:{
        type:Date,
        default:null
    },
    messageFrom:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    messageTo:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
});

export const Message:Model<MessageInterface> = model<MessageInterface>("message",MessageSchema);