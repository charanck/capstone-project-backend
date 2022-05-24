"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const userController_1 = require("./../controllers/userController");
const express_1 = require("express");
const userController_2 = require("../controllers/userController");
const authorizeUser_1 = require("../helpers/authorizeUser");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/signup", userController_2.signupUser);
exports.userRouter.post("/login", userController_2.loginUser);
exports.userRouter.post("/deactivate", userController_2.deactivateUser);
exports.userRouter.get('/', authorizeUser_1.authorizeUser, userController_2.getAllUsers);
exports.userRouter.get('/:userId', authorizeUser_1.authorizeUser, userController_2.getUser);
exports.userRouter.put('/:userId', authorizeUser_1.authorizeUser, userController_1.putUser);
//# sourceMappingURL=userRoute.js.map