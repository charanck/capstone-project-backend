import { putUser } from './../controllers/userController';
import { Router} from "express";
import { signupUser,loginUser ,deactivateUser,getAllUsers,getUser} from "../controllers/userController";

import { authorizeUser } from "../helpers/authorizeUser";

export const userRouter = Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/deactivate", deactivateUser);
userRouter.get('/',authorizeUser,getAllUsers);
userRouter.get('/:userId',authorizeUser,getUser);
userRouter.put('/:userId',authorizeUser,putUser);
