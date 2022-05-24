"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackRouter = void 0;
const express_1 = require("express");
const feedbackController_1 = require("../controllers/feedbackController");
const authorizeAdmin_1 = require("../helpers/authorizeAdmin");
const authorizeUser_1 = require("../helpers/authorizeUser");
exports.feedbackRouter = (0, express_1.Router)();
exports.feedbackRouter.get("/", authorizeAdmin_1.authorizeAdmin, feedbackController_1.getFeedbacks);
exports.feedbackRouter.post('/', authorizeUser_1.authorizeUser, feedbackController_1.createFeedback);
//# sourceMappingURL=feedbackRoute.js.map