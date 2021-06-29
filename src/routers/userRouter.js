import express from "express";
import { remove, edit } from "../controllers/userController";



const usersRouter = express.Router();


usersRouter.get("/edit", edit);
usersRouter.get("/delete", remove);

export default usersRouter;