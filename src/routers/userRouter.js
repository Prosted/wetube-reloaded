import express from "express";
import { remove, see, startGithubLogin, finishGithubLogin, getEdit, postEdit } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";



const usersRouter = express.Router();

usersRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
usersRouter.get("/delete", remove);
usersRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
usersRouter.get("/:id", see);

export default usersRouter;