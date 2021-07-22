import express from "express";
import { remove, see, startGithubLogin, finishGithubLogin, getEdit, postEdit } from "../controllers/userController";



const usersRouter = express.Router();

usersRouter.route("/edit").get(getEdit).post(postEdit);
usersRouter.get("/delete", remove);
usersRouter.get("/github/start", startGithubLogin);
usersRouter.get("/github/finish", finishGithubLogin);
usersRouter.get("/:id", see);

export default usersRouter;