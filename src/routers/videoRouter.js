import express from "express";
import { watch, getEdit, postEdit, getUpload, postUpload } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); 
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit); //하나의 URL에 get과 post 방식을 쓸 때 유용한 코드
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;