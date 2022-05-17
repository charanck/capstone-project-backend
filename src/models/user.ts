import { Schema, model, Model, Types, Document } from "mongoose";

export interface UserInterface extends Document {
    username: string;
    email: string;
    DOB: Date;
    gender: string;
    deactivatedOn: Date;
    hash: string;
    role: string;
    isActive: boolean;
    lastSeen: Date;
    status: string;
    createdOn: Date;
    feedback: Types.ObjectId;
}

const userSchema = new Schema<UserInterface>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address"
        ]
    },
    DOB: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    deactivatedOn: {
        type: Date,
        default: null
    },
    hash: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date
    },
    status: {
        type: String,
        default: "Hi there!!!"
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    feedback: {
        type: Schema.Types.ObjectId,
        ref: "feedback",
        default: null
    },
    role: {
        type: String,
        required: true
    }
});

export const User: Model<UserInterface> = model<UserInterface>(
    "user",
    userSchema
);
