import { Router} from "express";
import { signupUser,loginUser ,deactivateUser} from "../controllers/userController";

export const userRouter = Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/deactivate", deactivateUser);
