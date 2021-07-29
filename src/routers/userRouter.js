import express from "express";
import { remove, see, startGithubLogin, finishGithubLogin, getEdit, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from "../middlewares";



const usersRouter = express.Router();

usersRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
usersRouter.get("/delete", remove);
usersRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
usersRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
usersRouter.get("/:id", see);

export default usersRouter;