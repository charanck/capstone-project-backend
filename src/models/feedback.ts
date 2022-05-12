import { Schema, model, connect,Model } from 'mongoose';
import { User ,UserInterface} from './user';

export interface FeedbackInterface extends Document{
    answerOne:String,
    answerTwo:String,
    answerThree:String,
}

const FeedbackSchema:Schema<FeedbackInterface> = new Schema<FeedbackInterface>({
    answerOne:{
        type:String,
        required:true
    },
    answerTwo:{
        type:String,
        required:true
    },
    answerThree:{
        type:String,
        required:true
    }
});

export const Feedback:Model<FeedbackInterface> = model<FeedbackInterface>('feedback',FeedbackSchema);