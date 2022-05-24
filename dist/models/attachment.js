"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attachment = void 0;
const mongoose_1 = require("mongoose");
;
const attachmentSchema = new mongoose_1.Schema({
    attachmentURL: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    attachmentFrom: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    attachmentTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String
    }
});
exports.Attachment = (0, mongoose_1.model)('attachment', attachmentSchema);
//# sourceMappingURL=attachment.js.map