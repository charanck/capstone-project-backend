"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
;
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    DOB: {
        type: Date,
        required: true,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "feedback",
        default: null
    }
});
exports.User = (0, mongoose_1.model)('user', userSchema);
//# sourceMappingURL=user.js.map