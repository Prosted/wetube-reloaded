import express from "express";
import { remove, edit, see } from "../controllers/userController";



const usersRouter = express.Router();

usersRouter.get("/edit", edit);
usersRouter.get("/delete", remove);
usersRouter.get("/:id", see);

export default usersRouter;