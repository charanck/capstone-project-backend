"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    content: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String
    },
    deletedOn: {
        type: Date,
        default: null
    },
    messageFrom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    messageTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});
exports.Message = (0, mongoose_1.model)("message", MessageSchema);
//# sourceMappingURL=message.js.map