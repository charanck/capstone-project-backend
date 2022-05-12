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
    mimeType: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    }
});
exports.Attachment = (0, mongoose_1.model)('attachment', attachmentSchema);
//# sourceMappingURL=attachment.js.map