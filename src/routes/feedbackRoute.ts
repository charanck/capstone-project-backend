import { Router} from "express";
import { getFeedbacks, createFeedback } from "../controllers/feedbackController";
import { authorizeAdmin } from "../helpers/authorizeAdmin";
import { authorizeUser } from "../helpers/authorizeUser";

export const feedbackRouter = Router();

feedbackRouter.get("/",authorizeAdmin,getFeedbacks);
feedbackRouter.post('/',authorizeUser,createFeedback);