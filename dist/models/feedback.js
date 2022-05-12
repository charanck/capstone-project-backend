"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = require("mongoose");
const FeedbackSchema = new mongoose_1.Schema({
    answerOne: {
        type: String,
        required: true
    },
    answerTwo: {
        type: String,
        required: true
    },
    answerThree: {
        type: String,
        required: true
    }
});
exports.Feedback = (0, mongoose_1.model)('feedback', FeedbackSchema);
//# sourceMappingURL=feedback.js.map