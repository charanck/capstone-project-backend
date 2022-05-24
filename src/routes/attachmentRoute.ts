import { Router } from "express";
import { authorizeUser } from "../helpers/authorizeUser";

import {
    sendAttachment,
    deleteAttachment
} from "../controllers/attachmentController";

export const attachmentRouter = Router();

attachmentRouter.post("/", authorizeUser, sendAttachment);

attachmentRouter.delete("/:attachmentId",authorizeUser, deleteAttachment);
