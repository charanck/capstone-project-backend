"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFeedback = exports.getFeedbacks = void 0;
const feedback_1 = require("./../models/feedback");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedbacks = yield feedback_1.Feedback.find();
    res.json(feedbacks);
});
exports.getFeedbacks = getFeedbacks;
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { answerOne, answerTwo, answerThree } = req.body;
    const token = String(req.headers.token);
    const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = yield user_1.User.findOne({ _id: data.userId });
    const newFeedback = new feedback_1.Feedback({ answerOne: answerOne, answerTwo: answerTwo, answerThree: answerThree });
    yield newFeedback.save();
    currentUser.feedback = newFeedback;
    yield currentUser.save();
    res.json(newFeedback);
});
exports.createFeedback = createFeedback;
//# sourceMappingURL=feedbackController.js.map